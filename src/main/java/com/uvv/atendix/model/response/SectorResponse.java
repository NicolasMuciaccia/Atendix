package com.uvv.atendix.model.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "Setor cadastrado.")
public record SectorResponse(

        @Schema(description = "Identificador do setor.", example = "5f0c3a52-7d1e-4c9b-8a2f-1b3c4d5e6f70")
        UUID id,

        @Schema(description = "Nome do setor.", example = "Financeiro")
        String name,

        @Schema(description = "Momento do cadastro, em UTC.", example = "2026-11-07T14:30:00Z")
        Instant createdAt) {
}
