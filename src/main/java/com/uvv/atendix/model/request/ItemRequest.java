package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

@Schema(description = "Dados de um item (equipamento), usados para cadastrar e para editar.")
public record ItemRequest(

        @NotBlank(message = "O nome do item é obrigatório")
        @Size(max = 120, message = "O nome do item deve ter no máximo 120 caracteres")
        @Schema(description = "Nome do equipamento.", example = "Impressora HP LaserJet")
        String name,

        @NotNull(message = "O setor é obrigatório")
        @Schema(description = "Setor onde o equipamento fica.", example = "5f0c3a52-7d1e-4c9b-8a2f-1b3c4d5e6f70")
        UUID sectorId,

        @NotNull(message = "A etiqueta é obrigatória")
        @Schema(description = "Etiqueta de patrimônio do equipamento; cada etiqueta pertence a um único item.",
                example = "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d")
        UUID assetTagId) {
}
