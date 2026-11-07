package com.uvv.atendix.model.request;

import com.uvv.atendix.model.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para cadastrar um usuário. A senha inicial é definida pelo sistema e deve ser trocada no primeiro acesso.")
public record CreateUserRequest(

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        @Schema(description = "Nome completo do usuário.", example = "Maria Souza")
        String name,

        @NotBlank(message = "O login é obrigatório")
        @Pattern(regexp = "^[A-Za-z0-9._-]{3,40}$",
                message = "O login deve ter de 3 a 40 caracteres, usando apenas letras, números, ponto, hífen ou sublinhado")
        @Schema(description = "Login de acesso, gravado em minúsculas.", example = "maria.souza")
        String login,

        @NotNull(message = "O perfil é obrigatório")
        @Schema(description = "Perfil de acesso: COMMON (0) ou ADMIN (1).", example = "COMMON")
        Role role) {
}
