package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados de um setor, usados para cadastrar e para editar.")
public record SectorRequest(

        @NotBlank(message = "O nome do setor é obrigatório")
        @Size(max = 80, message = "O nome do setor deve ter no máximo 80 caracteres")
        @Schema(description = "Nome do setor, único sem diferenciar maiúsculas.", example = "Financeiro")
        String name) {
}
