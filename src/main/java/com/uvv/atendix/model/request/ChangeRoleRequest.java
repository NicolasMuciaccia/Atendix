package com.uvv.atendix.model.request;

import com.uvv.atendix.model.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Novo perfil de acesso do usuário.")
public record ChangeRoleRequest(

        @NotNull(message = "O perfil é obrigatório")
        @Schema(description = "Perfil de acesso: COMMON (0) ou ADMIN (1).", example = "ADMIN")
        Role role) {
}
