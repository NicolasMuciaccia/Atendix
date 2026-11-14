package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.UUID;

/** Same filters as the ticket list, except the status, which is what gets counted. */
public record CountTicketsRequest(

        @Parameter(description = "Conta só os chamados desta data. Exclusivo do administrador.", example = "2026-11-07")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate date,

        @Parameter(description = "Conta só os chamados deste setor. Exclusivo do administrador.",
                example = "5f0c3a52-7d1e-4c9b-8a2f-1b3c4d5e6f70")
        UUID sectorId,

        @Parameter(description = "Conta só os chamados desta etiqueta.", example = "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d")
        UUID assetTagId) {

    public boolean hasSearchFilters() {
        return date != null || sectorId != null;
    }
}
