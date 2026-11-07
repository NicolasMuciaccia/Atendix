package com.uvv.atendix.model.request;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ListUsersRequest(

        @Parameter(description = "Página desejada, começando em 0.", example = "0",
                schema = @Schema(defaultValue = "0"))
        @PositiveOrZero(message = "A página não pode ser negativa")
        Integer page,

        @Parameter(description = "Quantidade de usuários por página.", example = "20",
                schema = @Schema(defaultValue = "20"))
        @Positive(message = "O tamanho da página deve ser maior que zero")
        @Max(value = PageLimits.MAX_SIZE, message = "O tamanho máximo da página é 100")
        Integer size) {

    public ListUsersRequest {
        page = page == null ? PageLimits.FIRST_PAGE : page;
        size = size == null ? PageLimits.DEFAULT_SIZE : size;
    }
}
