package com.uvv.atendix;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Map;

@Schema(description = "Modelo de resposta de erro padronizada da API")
public record ApiErrorResponse(
        @Schema(description = "Momento em que o erro ocorreu", example = "2026-11-07T11:45:12.123456")
        LocalDateTime timestamp,

        @Schema(description = "Código HTTP de status", example = "409")
        int status,

        @Schema(description = "Tipo de erro ocorrido", example = "Conflito com o estado atual")
        String error,

        @Schema(description = "Mensagem detalhada do erro",
                example = "O chamado 8f14e45f-ceea-467a-9575-0f9a2c6e0b1d não pode ser cancelado porque já possui tratativa iniciada (status IN_PROGRESS)")
        String message,

        @Schema(description = "Campos que apresentaram erro e suas mensagens; preenchido só em erro de validação")
        Map<String, String> fields) {
}
