package com.uvv.atendix.model.entity;

import com.uvv.atendix.model.dto.TicketDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public final class TicketFixtures {

    public static final LocalDate REQUEST_DATE = LocalDate.of(2026, 11, 7);
    public static final Instant STARTED_AT = Instant.parse("2026-11-07T15:00:00Z");
    public static final Instant FINISHED_AT = Instant.parse("2026-11-07T16:20:00Z");

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
        ticket.startHandling(UserFixtures.admin(), STARTED_AT);
        return ticket;
    }

    public static Ticket finished(User requester) {
        Ticket ticket = inProgress(requester);
        ticket.finish(UserFixtures.admin(), FINISHED_AT);
        return ticket;
    }
}
