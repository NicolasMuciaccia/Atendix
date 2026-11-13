package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Ativa ou desativa uma conta. Conta desativada não entra no sistema; os chamados dela continuam no histórico.")
public record ChangeUserActiveRequest(

        @NotNull(message = "Informe se a conta fica ativa")
        @Schema(description = "true para ativar, false para desativar.", example = "false")
        Boolean active) {
}
