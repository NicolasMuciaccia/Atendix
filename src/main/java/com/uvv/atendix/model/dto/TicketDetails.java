package com.uvv.atendix.model.dto;

import com.uvv.atendix.util.exception.BusinessException;

import java.time.LocalDate;

/** What the requester writes when opening a ticket; the equipment comes from the registered item. */
public record TicketDetails(LocalDate requestDate, String problemDescription) {

    public TicketDetails {
        if (requestDate == null) {
            throw new BusinessException("A data do chamado é obrigatória");
        }
        if (problemDescription == null || problemDescription.isBlank()) {
            throw new BusinessException("A descrição do problema é obrigatória");
        }
        problemDescription = problemDescription.trim();
    }
}
