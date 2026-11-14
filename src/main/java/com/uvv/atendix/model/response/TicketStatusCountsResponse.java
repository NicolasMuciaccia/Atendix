package com.uvv.atendix.model.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Quantidade de chamados em cada status, respeitando os filtros informados.")
public record TicketStatusCountsResponse(

        @Schema(description = "Chamados abertos.", example = "4")
        long open,

        @Schema(description = "Chamados em andamento.", example = "2")
        long inProgress,

        @Schema(description = "Chamados finalizados.", example = "9")
        long finished,

        @Schema(description = "Soma dos três status.", example = "15")
        long total) {

    public static TicketStatusCountsResponse of(long open, long inProgress, long finished) {
        return new TicketStatusCountsResponse(open, inProgress, finished, open + inProgress + finished);
    }
}
