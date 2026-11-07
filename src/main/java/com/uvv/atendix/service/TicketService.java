package com.uvv.atendix.service;

import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.dto.TicketFilter;
import com.uvv.atendix.model.entity.Item;
import com.uvv.atendix.model.entity.Ticket;
import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.request.ChangeTicketStatusRequest;
import com.uvv.atendix.model.request.CreateTicketRequest;
import com.uvv.atendix.model.request.ListTicketsRequest;
import com.uvv.atendix.model.response.PageResponse;
import com.uvv.atendix.model.response.TicketResponse;
import com.uvv.atendix.repository.TicketRepository;
import com.uvv.atendix.repository.TicketSpecifications;
import com.uvv.atendix.repository.ItemRepository;
import com.uvv.atendix.repository.UserRepository;
import com.uvv.atendix.util.exception.BusinessException;
import com.uvv.atendix.util.exception.ForbiddenOperationException;
import com.uvv.atendix.util.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketService.class);

    // Tickets are always listed from the most recent to the oldest
    private static final Sort MOST_RECENT_FIRST =
            Sort.by(Sort.Order.desc("requestDate"), Sort.Order.desc("createdAt"));
    private static final String TICKET_NOT_FOUND = "Chamado não encontrado: ";
    private static final String USER_NOT_FOUND = "Usuário não encontrado: ";
    private static final String SEARCH_REQUIRES_ADMIN = "Apenas administradores podem buscar chamados por data ou setor";
    private static final String ITEM_NOT_FOUND = "O item selecionado não existe mais. Atualize a página e escolha outro.";

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final TicketMapper ticketMapper;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository,
                         ItemRepository itemRepository, TicketMapper ticketMapper) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.ticketMapper = ticketMapper;
    }

    @Transactional
    public TicketResponse openTicket(CreateTicketRequest request, AuthenticatedUser currentUser) {
        User requester = findUser(currentUser.id());
        Item item = findItem(request.itemId());

        Ticket savedTicket = ticketRepository.save(Ticket.open(requester, item, request.toDetails()));

        log.info("Ticket {} opened by user {}", savedTicket.getId(), requester.getId());
        return ticketMapper.toResponse(savedTicket);
    }

    @Transactional(readOnly = true)
    public PageResponse<TicketResponse> listTickets(ListTicketsRequest request, AuthenticatedUser currentUser) {
        validateSearchPermission(request, currentUser);

        TicketFilter filter = new TicketFilter(visibleRequesterId(currentUser), request.date(), request.sectorId());
        PageRequest pageRequest = PageRequest.of(request.page(), request.size(), MOST_RECENT_FIRST);

        return PageResponse.from(ticketRepository
                .findAll(TicketSpecifications.matching(filter), pageRequest)
                .map(ticketMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(UUID ticketId, AuthenticatedUser currentUser) {
        return ticketMapper.toResponse(findVisibleTicket(ticketId, currentUser));
    }

    @Transactional
    public void cancelTicket(UUID ticketId, AuthenticatedUser currentUser) {
        Ticket ticket = findVisibleTicket(ticketId, currentUser);
        ticket.ensureCancelable();

        ticketRepository.delete(ticket);

        log.info("Ticket {} cancelled and deleted by user {}", ticketId, currentUser.id());
    }

    @Transactional
    public TicketResponse changeStatus(UUID ticketId, ChangeTicketStatusRequest request) {
        Ticket ticket = findTicket(ticketId);
        ticket.changeStatus(request.status());

        // Flushed now so the response carries the updated_at set by the auditing listener
        Ticket savedTicket = ticketRepository.saveAndFlush(ticket);

        log.info("Ticket {} moved to status {}", savedTicket.getId(), savedTicket.getStatus());
        return ticketMapper.toResponse(savedTicket);
    }

    private void validateSearchPermission(ListTicketsRequest request, AuthenticatedUser currentUser) {
        if (request.hasSearchFilters() && !currentUser.isAdmin()) {
            throw new ForbiddenOperationException(SEARCH_REQUIRES_ADMIN);
        }
    }

    // Administrators see every ticket; common users only the ones they opened
    private UUID visibleRequesterId(AuthenticatedUser currentUser) {
        return currentUser.isAdmin() ? null : currentUser.id();
    }

    // A ticket from someone else answers as not found, so its existence is not disclosed
    private Ticket findVisibleTicket(UUID ticketId, AuthenticatedUser currentUser) {
        Ticket ticket = findTicket(ticketId);
        if (!currentUser.isAdmin() && !ticket.isRequestedBy(currentUser.id())) {
            throw new ResourceNotFoundException(TICKET_NOT_FOUND + ticketId);
        }
        return ticket;
    }

    private Ticket findTicket(UUID ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException(TICKET_NOT_FOUND + ticketId));
    }

    private Item findItem(UUID itemId) {
        return itemRepository.findById(itemId).orElseThrow(() -> new BusinessException(ITEM_NOT_FOUND));
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND + userId));
    }
}
