package com.uvv.atendix.model.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "Etiqueta de patrimônio cadastrada.")
public record AssetTagResponse(

        @Schema(description = "Identificador da etiqueta.", example = "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d")
        UUID id,

        @Schema(description = "Código da etiqueta.", example = "PAT-004512")
        String code,

        @Schema(description = "Item identificado pela etiqueta; nulo enquanto a etiqueta estiver livre.",
                example = "3d2c1b0a-9f8e-4d7c-8b6a-5f4e3d2c1b0a")
        UUID itemId,

        @Schema(description = "Nome do item identificado pela etiqueta; nulo enquanto estiver livre.",
                example = "Impressora HP LaserJet")
        String itemName,

        @Schema(description = "Momento do cadastro, em UTC.", example = "2026-11-07T14:30:00Z")
        Instant createdAt) {
}
