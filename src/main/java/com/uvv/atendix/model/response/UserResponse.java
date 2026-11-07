package com.uvv.atendix.model.response;

import com.uvv.atendix.model.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "Usuário do sistema.")
public record UserResponse(

        @Schema(description = "Identificador do usuário.", example = "8f14e45f-ceea-467a-9575-0f9a2c6e0b1d")
        UUID id,

        @Schema(description = "Nome completo.", example = "Maria Souza")
        String name,

        @Schema(description = "Login de acesso.", example = "maria.souza")
        String login,

        @Schema(description = "Perfil de acesso: COMMON (0) ou ADMIN (1).", example = "COMMON")
        Role role,

        @Schema(description = "Verdadeiro enquanto o usuário não trocar a senha inicial.", example = "true")
        boolean mustChangePassword,

        @Schema(description = "Momento do cadastro, em UTC.", example = "2026-11-07T14:30:00Z")
        Instant createdAt) {
}
