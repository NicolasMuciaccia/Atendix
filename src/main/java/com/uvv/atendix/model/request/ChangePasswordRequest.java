package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Troca da senha do usuário autenticado.")
public record ChangePasswordRequest(

        @NotBlank(message = "A senha atual é obrigatória")
        @Size(max = 128, message = "A senha atual deve ter no máximo 128 caracteres")
        @Schema(description = "Senha em uso, inclusive a senha inicial no primeiro acesso.", example = "mudar@123")
        String currentPassword,

        @NotBlank(message = "A nova senha é obrigatória")
        @Pattern(regexp = PASSWORD_POLICY,
                message = "A nova senha deve ter de 8 a 128 caracteres, com letra maiúscula, letra minúscula, número e caractere especial")
        @Schema(description = "Nova senha: de 8 a 128 caracteres, com maiúscula, minúscula, número e caractere especial.",
                example = "Atendix#2026")
        String newPassword) {

    public static final String PASSWORD_POLICY = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,128}$";

    @Override
    public String toString() {
        return "ChangePasswordRequest[currentPassword=***, newPassword=***]";
    }
}
