package com.uvv.atendix.repository;

import com.uvv.atendix.model.dto.TicketFilter;
import com.uvv.atendix.model.entity.Ticket;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class TicketSpecifications {

    private TicketSpecifications() {
    }

    public static Specification<Ticket> matching(TicketFilter filter) {
        List<Specification<Ticket>> conditions = new ArrayList<>();
        if (filter.requesterId() != null) {
            conditions.add(requestedBy(filter.requesterId()));
        }
        if (filter.requestDate() != null) {
            conditions.add(requestedOn(filter.requestDate()));
        }
        if (filter.sectorId() != null) {
            conditions.add(inSector(filter.sectorId()));
        }
        return Specification.allOf(conditions);
    }

    private static Specification<Ticket> requestedBy(UUID requesterId) {
        return (root, query, cb) -> cb.equal(root.get("requester").get("id"), requesterId);
    }

    private static Specification<Ticket> requestedOn(LocalDate requestDate) {
        return (root, query, cb) -> cb.equal(root.get("requestDate"), requestDate);
    }

    private static Specification<Ticket> inSector(UUID sectorId) {
        return (root, query, cb) -> cb.equal(root.get("item").get("sector").get("id"), sectorId);
    }
}
