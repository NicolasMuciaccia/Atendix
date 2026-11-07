package com.uvv.atendix.model.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "Item (equipamento) cadastrado, com o setor e a etiqueta a que pertence.")
public record ItemResponse(

        @Schema(description = "Identificador do item.", example = "3d2c1b0a-9f8e-4d7c-8b6a-5f4e3d2c1b0a")
        UUID id,

        @Schema(description = "Nome do equipamento.", example = "Impressora HP LaserJet")
        String name,

        @Schema(description = "Identificador do setor.", example = "5f0c3a52-7d1e-4c9b-8a2f-1b3c4d5e6f70")
        UUID sectorId,

        @Schema(description = "Nome do setor.", example = "Financeiro")
        String sectorName,

        @Schema(description = "Identificador da etiqueta.", example = "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d")
        UUID assetTagId,

        @Schema(description = "Código da etiqueta.", example = "PAT-004512")
        String assetTagCode,

        @Schema(description = "Momento do cadastro, em UTC.", example = "2026-11-07T14:30:00Z")
        Instant createdAt) {
}
