package com.uvv.atendix.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;

@Schema(description = "Página de resultados.")
public record PageResponse<T>(

        @Schema(description = "Itens da página.")
        List<T> content,

        @Schema(description = "Número da página, começando em 0.", example = "0")
        int page,

        @Schema(description = "Tamanho da página.", example = "20")
        int size,

        @Schema(description = "Total de itens encontrados.", example = "42")
        long totalElements,

        @Schema(description = "Total de páginas.", example = "3")
        int totalPages) {

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }
}
