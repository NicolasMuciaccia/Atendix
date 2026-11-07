package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.UUID;

public record ListTicketsRequest(

        @Parameter(description = "Filtra pela data do chamado. Exclusivo do administrador.", example = "2026-11-07")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate date,

        @Parameter(description = "Filtra pelo setor do item. Exclusivo do administrador.",
                example = "5f0c3a52-7d1e-4c9b-8a2f-1b3c4d5e6f70")
        UUID sectorId,

        @Parameter(description = "Página desejada, começando em 0.", example = "0",
                schema = @Schema(defaultValue = "0"))
        @PositiveOrZero(message = "A página não pode ser negativa")
        Integer page,

        @Parameter(description = "Quantidade de chamados por página.", example = "20",
                schema = @Schema(defaultValue = "20"))
        @Positive(message = "O tamanho da página deve ser maior que zero")
        @Max(value = PageLimits.MAX_SIZE, message = "O tamanho máximo da página é 100")
        Integer size) {

    public ListTicketsRequest {
        page = page == null ? PageLimits.FIRST_PAGE : page;
        size = size == null ? PageLimits.DEFAULT_SIZE : size;
    }

    public boolean hasSearchFilters() {
        return date != null || sectorId != null;
    }
}
