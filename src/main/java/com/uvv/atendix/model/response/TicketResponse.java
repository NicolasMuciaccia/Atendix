package com.uvv.atendix.model.response;

import com.uvv.atendix.model.enums.TicketStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Chamado de reparo de equipamento.")
public record TicketResponse(

        @Schema(description = "Identificador do chamado.", example = "8f14e45f-ceea-467a-9575-0f9a2c6e0b1d")
        UUID id,

        @Schema(description = "Data da solicitação.", example = "2026-11-07")
        LocalDate requestDate,

        @Schema(description = "Identificador do item com problema.", example = "3d2c1b0a-9f8e-4d7c-8b6a-5f4e3d2c1b0a")
        UUID itemId,

        @Schema(description = "Nome do item com problema.", example = "Impressora HP LaserJet")
        String itemName,

        @Schema(description = "Identificador do setor do item.", example = "5f0c3a52-7d1e-4c9b-8a2f-1b3c4d5e6f70")
        UUID sectorId,

        @Schema(description = "Setor onde está o item.", example = "Financeiro")
        String sector,

        @Schema(description = "Número da etiqueta de patrimônio do item.", example = "PAT-004512")
        String assetTag,

        @Schema(description = "O que está acontecendo com o equipamento.", example = "A impressora não puxa o papel da bandeja 2.")
        String problemDescription,

        @Schema(description = "Status: OPEN (aberto), IN_PROGRESS (em andamento) ou FINISHED (finalizado).", example = "OPEN")
        TicketStatus status,

        @Schema(description = "Identificador de quem abriu o chamado.", example = "3c6e0b8a-9c0b-4a7e-8f2a-1d2b3c4d5e6f")
        UUID requesterId,

        @Schema(description = "Nome de quem abriu o chamado.", example = "Usuário Comum")
        String requesterName,

        @Schema(description = "Momento da abertura, em UTC.", example = "2026-11-07T14:30:00Z")
        Instant createdAt,

        @Schema(description = "Momento da última alteração, em UTC.", example = "2026-11-07T15:10:00Z")
        Instant updatedAt) {
}
