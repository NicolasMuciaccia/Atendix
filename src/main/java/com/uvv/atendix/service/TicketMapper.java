package com.uvv.atendix.service;

import com.uvv.atendix.model.entity.Item;
import com.uvv.atendix.model.entity.Ticket;
import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.response.TicketResponse;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketResponse toResponse(Ticket ticket) {
        User requester = ticket.getRequester();
        Item item = ticket.getItem();
        return new TicketResponse(
                ticket.getId(),
                ticket.getRequestDate(),
                item.getId(),
                item.getName(),
                item.getSector().getId(),
                item.getSector().getName(),
                item.getAssetTag().getCode(),
                ticket.getProblemDescription(),
                ticket.getStatus(),
                requester.getId(),
                requester.getName(),
                nameOf(ticket.getStartedBy()),
                ticket.getStartedAt(),
                nameOf(ticket.getFinishedBy()),
                ticket.getFinishedAt(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt());
    }

    // The handling fields stay empty until the ticket reaches that step
    private String nameOf(User user) {
        return user == null ? null : user.getName();
    }
}
