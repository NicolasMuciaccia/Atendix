package com.uvv.atendix.model.dto;

import java.time.LocalDate;
import java.util.UUID;

/**
 * @param requesterId only tickets opened by this user; {@code null} means every ticket
 */
public record TicketFilter(UUID requesterId, LocalDate requestDate, UUID sectorId) {
}
