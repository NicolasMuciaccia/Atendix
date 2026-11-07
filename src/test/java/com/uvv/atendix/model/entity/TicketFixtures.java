package com.uvv.atendix.model.entity;

import com.uvv.atendix.model.dto.TicketDetails;
import com.uvv.atendix.model.enums.TicketStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.UUID;

public final class TicketFixtures {

    public static final LocalDate REQUEST_DATE = LocalDate.of(2026, 11, 7);

    private TicketFixtures() {
    }

    public static TicketDetails details() {
        return new TicketDetails(REQUEST_DATE, "A impressora não puxa o papel da bandeja 2.");
    }

    public static Ticket open(User requester) {
        Ticket ticket = Ticket.open(requester, CatalogFixtures.item(), details());
        ReflectionTestUtils.setField(ticket, "id", UUID.randomUUID());
        return ticket;
    }

    public static Ticket inProgress(User requester) {
        Ticket ticket = open(requester);
        ticket.changeStatus(TicketStatus.IN_PROGRESS);
        return ticket;
    }

    public static Ticket finished(User requester) {
        Ticket ticket = inProgress(requester);
        ticket.changeStatus(TicketStatus.FINISHED);
        return ticket;
    }
}
