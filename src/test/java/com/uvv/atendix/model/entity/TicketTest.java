package com.uvv.atendix.model.entity;

import com.uvv.atendix.model.enums.TicketStatus;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.BusinessException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TicketTest {

    private final User requester = UserFixtures.common();

    @Test
    void shouldAlwaysOpenWithStatusOpen() {
        Item item = CatalogFixtures.item();

        Ticket ticket = Ticket.open(requester, item, TicketFixtures.details());

        assertThat(ticket.getStatus()).isEqualTo(TicketStatus.OPEN);
        assertThat(ticket.getRequester()).isSameAs(requester);
        assertThat(ticket.getItem()).isSameAs(item);
    }

    @Test
    void shouldRejectTicketWithoutRequester() {
        assertThatThrownBy(() -> Ticket.open(null, CatalogFixtures.item(), TicketFixtures.details()))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void shouldRejectTicketWithoutItem() {
        assertThatThrownBy(() -> Ticket.open(requester, null, TicketFixtures.details()))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void shouldMoveFromOpenToInProgress() {
        Ticket ticket = TicketFixtures.open(requester);

        ticket.changeStatus(TicketStatus.IN_PROGRESS);

        assertThat(ticket.getStatus()).isEqualTo(TicketStatus.IN_PROGRESS);
    }

    @Test
    void shouldFinishTicketDirectlyFromOpen() {
        Ticket ticket = TicketFixtures.open(requester);

        ticket.changeStatus(TicketStatus.FINISHED);

        assertThat(ticket.getStatus()).isEqualTo(TicketStatus.FINISHED);
    }

    @Test
    void shouldNotReopenFinishedTicket() {
        Ticket ticket = TicketFixtures.finished(requester);

        assertThatThrownBy(() -> ticket.changeStatus(TicketStatus.OPEN))
                .isInstanceOf(BusinessConflictException.class);
    }

    @Test
    void shouldNotMoveInProgressTicketBackToOpen() {
        Ticket ticket = TicketFixtures.inProgress(requester);

        assertThatThrownBy(() -> ticket.changeStatus(TicketStatus.OPEN))
                .isInstanceOf(BusinessConflictException.class);
    }

    @Test
    void shouldAllowCancelWhileOpen() {
        Ticket ticket = TicketFixtures.open(requester);

        ticket.ensureCancelable();

        assertThat(ticket.isCancelable()).isTrue();
    }

    @Test
    void shouldNotCancelTicketAlreadyInProgress() {
        Ticket ticket = TicketFixtures.inProgress(requester);

        assertThatThrownBy(ticket::ensureCancelable)
                .isInstanceOf(BusinessConflictException.class);
    }

    @Test
    void shouldRecognizeItsRequester() {
        Ticket ticket = TicketFixtures.open(requester);

        assertThat(ticket.isRequestedBy(requester.getId())).isTrue();
        assertThat(ticket.isRequestedBy(UserFixtures.admin().getId())).isFalse();
    }
}
