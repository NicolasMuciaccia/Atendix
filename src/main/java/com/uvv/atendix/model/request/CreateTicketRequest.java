package com.uvv.atendix.model.request;

import com.uvv.atendix.model.dto.TicketDetails;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Dados para abrir um chamado. Setor e etiqueta vêm do item escolhido; o status inicial é sempre OPEN.")
public record CreateTicketRequest(

        @NotNull(message = "A data do chamado é obrigatória")
        @PastOrPresent(message = "A data do chamado não pode estar no futuro")
        @Schema(description = "Data da solicitação.", example = "2026-11-07")
        LocalDate requestDate,

        @NotNull(message = "Selecione o item com problema")
        @Schema(description = "Item cadastrado que precisa de reparo.", example = "3d2c1b0a-9f8e-4d7c-8b6a-5f4e3d2c1b0a")
        UUID itemId,

        @NotBlank(message = "A descrição do problema é obrigatória")
        @Size(max = 2000, message = "A descrição do problema deve ter no máximo 2000 caracteres")
        @Schema(description = "O que está acontecendo com o equipamento.", example = "A impressora não puxa o papel da bandeja 2.")
        String problemDescription) {

    public TicketDetails toDetails() {
        return new TicketDetails(requestDate, problemDescription);
    }
}
