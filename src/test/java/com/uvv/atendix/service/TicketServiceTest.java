package com.uvv.atendix.service;

import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.entity.CatalogFixtures;
import com.uvv.atendix.model.entity.Item;
import com.uvv.atendix.model.entity.Ticket;
import com.uvv.atendix.model.entity.TicketFixtures;
import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.entity.UserFixtures;
import com.uvv.atendix.model.enums.TicketStatus;
import com.uvv.atendix.model.request.ChangeTicketStatusRequest;
import com.uvv.atendix.model.request.CreateTicketRequest;
import com.uvv.atendix.model.request.ListTicketsRequest;
import com.uvv.atendix.model.response.TicketResponse;
import com.uvv.atendix.repository.ItemRepository;
import com.uvv.atendix.repository.TicketRepository;
import com.uvv.atendix.repository.UserRepository;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.BusinessException;
import com.uvv.atendix.util.exception.ForbiddenOperationException;
import com.uvv.atendix.util.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    private static final Instant TOKEN_EXPIRES_AT = Instant.parse("2026-11-07T12:15:00Z");
    private static final Instant NOW = Instant.parse("2026-11-07T12:00:00Z");

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ItemRepository itemRepository;

    private TicketService ticketService;
    private final User requester = UserFixtures.common();
    private final User admin = UserFixtures.admin();
    private final Item item = CatalogFixtures.item();

    @BeforeEach
    void setUp() {
        ticketService = new TicketService(ticketRepository, userRepository, itemRepository, new TicketMapper(),
                Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void shouldOpenTicketForTheSelectedItemWithItsSectorAndTag() {
        when(userRepository.findById(requester.getId())).thenReturn(Optional.of(requester));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TicketResponse response = ticketService.openTicket(createRequest(), authenticated(requester));

        assertThat(response.status()).isEqualTo(TicketStatus.OPEN);
        assertThat(response.requesterId()).isEqualTo(requester.getId());
        assertThat(response.sector()).isEqualTo(CatalogFixtures.SECTOR_NAME);
        assertThat(response.assetTag()).isEqualTo(CatalogFixtures.TAG_CODE);
    }

    @Test
    void shouldRejectTicketForItemThatNoLongerExists() {
        when(userRepository.findById(requester.getId())).thenReturn(Optional.of(requester));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketService.openTicket(createRequest(), authenticated(requester)))
                .isInstanceOf(BusinessException.class);
        verify(ticketRepository, never()).save(any(Ticket.class));
    }

    @Test
    void shouldForbidCommonUserFromSearchingBySector() {
        ListTicketsRequest request = new ListTicketsRequest(null, item.getSector().getId(), null, null);

        assertThatThrownBy(() -> ticketService.listTickets(request, authenticated(requester)))
                .isInstanceOf(ForbiddenOperationException.class);
    }

    @Test
    void shouldHideTicketOpenedByAnotherUser() {
        Ticket ticket = TicketFixtures.open(admin);
        when(ticketRepository.findById(ticket.getId())).thenReturn(Optional.of(ticket));

        assertThatThrownBy(() -> ticketService.getTicket(ticket.getId(), authenticated(requester)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldDeleteOpenTicketWhenCancelled() {
        Ticket ticket = TicketFixtures.open(requester);
        when(ticketRepository.findById(ticket.getId())).thenReturn(Optional.of(ticket));

        ticketService.cancelTicket(ticket.getId(), authenticated(requester));

        verify(ticketRepository).delete(ticket);
    }

    @Test
    void shouldKeepTicketWhenHandlingAlreadyStarted() {
        Ticket ticket = TicketFixtures.inProgress(requester);
        when(ticketRepository.findById(ticket.getId())).thenReturn(Optional.of(ticket));

        assertThatThrownBy(() -> ticketService.cancelTicket(ticket.getId(), authenticated(requester)))
                .isInstanceOf(BusinessConflictException.class);
        verify(ticketRepository, never()).delete(any(Ticket.class));
    }

    @Test
    void shouldLetAdminCancelTicketOfAnotherUser() {
        Ticket ticket = TicketFixtures.open(requester);
        when(ticketRepository.findById(ticket.getId())).thenReturn(Optional.of(ticket));

        ticketService.cancelTicket(ticket.getId(), authenticated(admin));

        verify(ticketRepository).delete(ticket);
    }

    @Test
    void shouldStartHandlingInTheNameOfTheCurrentAdmin() {
        Ticket ticket = TicketFixtures.open(requester);
        when(ticketRepository.findById(ticket.getId())).thenReturn(Optional.of(ticket));
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));
        when(ticketRepository.saveAndFlush(ticket)).thenReturn(ticket);

        TicketResponse response = ticketService.changeStatus(ticket.getId(),
                new ChangeTicketStatusRequest(TicketStatus.IN_PROGRESS), authenticated(admin));

        assertThat(response.status()).isEqualTo(TicketStatus.IN_PROGRESS);
        assertThat(response.startedByName()).isEqualTo(admin.getName());
        assertThat(response.startedAt()).isEqualTo(NOW);
    }

    @Test
    void shouldNotFinishTicketThatWasNotStarted() {
        Ticket ticket = TicketFixtures.open(requester);
        when(ticketRepository.findById(ticket.getId())).thenReturn(Optional.of(ticket));
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> ticketService.changeStatus(ticket.getId(),
                new ChangeTicketStatusRequest(TicketStatus.FINISHED), authenticated(admin)))
                .isInstanceOf(BusinessConflictException.class);
        verify(ticketRepository, never()).saveAndFlush(any(Ticket.class));
    }

    @Test
    void shouldNotOpenSecondTicketForItemStillBeingHandled() {
        when(userRepository.findById(requester.getId())).thenReturn(Optional.of(requester));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));
        when(ticketRepository.findFirstByItemIdAndStatusIn(eq(item.getId()), any()))
                .thenReturn(Optional.of(TicketFixtures.open(requester)));

        assertThatThrownBy(() -> ticketService.openTicket(createRequest(), authenticated(requester)))
                .isInstanceOf(BusinessConflictException.class);
        verify(ticketRepository, never()).save(any(Ticket.class));
    }

    private CreateTicketRequest createRequest() {
        return new CreateTicketRequest(TicketFixtures.REQUEST_DATE, item.getId(),
                "A impressora não puxa o papel da bandeja 2.");
    }

    private AuthenticatedUser authenticated(User user) {
        return new AuthenticatedUser(user.getId(), user.getRole(), "token-id", TOKEN_EXPIRES_AT);
    }
}
