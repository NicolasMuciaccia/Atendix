package com.uvv.atendix.model.request;

import com.uvv.atendix.model.enums.TicketStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Novo status do chamado.")
public record ChangeTicketStatusRequest(

        @NotNull(message = "O status é obrigatório")
        @Schema(description = "Status de destino: IN_PROGRESS (em andamento) ou FINISHED (finalizado).",
                example = "IN_PROGRESS")
        TicketStatus status) {
}
