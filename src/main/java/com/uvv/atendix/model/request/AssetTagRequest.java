package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados de uma etiqueta de patrimônio, usados para cadastrar e para editar.")
public record AssetTagRequest(

        @NotBlank(message = "O código da etiqueta é obrigatório")
        @Size(max = 40, message = "O código da etiqueta deve ter no máximo 40 caracteres")
        @Schema(description = "Código impresso na etiqueta; gravado em maiúsculas e único.", example = "PAT-004512")
        String code) {
}
