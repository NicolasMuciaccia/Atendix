package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Credenciais de acesso ao sistema.")
public record LoginRequest(

        @NotBlank(message = "O login é obrigatório")
        @Size(max = 40, message = "O login deve ter no máximo 40 caracteres")
        @Schema(description = "Login do usuário.", example = "admin")
        String login,

        @NotBlank(message = "A senha é obrigatória")
        @Size(max = 128, message = "A senha deve ter no máximo 128 caracteres")
        @Schema(description = "Senha do usuário.", example = "mudar@123")
        String password) {

    @Override
    public String toString() {
        return "LoginRequest[login=" + login + ", password=***]";
    }
}
