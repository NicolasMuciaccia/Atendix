package com.uvv.atendix.controller;

import com.uvv.atendix.ApiErrorResponse;
import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.request.ChangeTicketStatusRequest;
import com.uvv.atendix.model.request.CreateTicketRequest;
import com.uvv.atendix.model.request.ListTicketsRequest;
import com.uvv.atendix.model.response.PageResponse;
import com.uvv.atendix.model.response.TicketResponse;
import com.uvv.atendix.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping(ApiRoutes.TICKETS)
@Tag(name = "Chamados", description = "Abertura, acompanhamento, cancelamento e tratativa de chamados")
public class TicketController {

    private static final String TICKET_ID_DESCRIPTION = "Identificador do chamado.";
    private static final String TICKET_ID_EXAMPLE = "8f14e45f-ceea-467a-9575-0f9a2c6e0b1d";

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @Operation(summary = "Abre um chamado",
            description = "O chamado nasce sempre com status OPEN. Setor e etiqueta vêm do item cadastrado.")
    @ApiResponse(responseCode = "201", description = "Chamado aberto")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Senha inicial ainda não trocada ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "422", description = "O item informado não existe",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<TicketResponse> openTicket(@RequestBody @Valid CreateTicketRequest request,
                                                     AuthenticatedUser currentUser) {
        TicketResponse openedTicket = ticketService.openTicket(request, currentUser);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{ticketId}").buildAndExpand(openedTicket.id()).toUri();
        return ResponseEntity.created(location).body(openedTicket);
    }

    @GetMapping
    @Operation(summary = "Lista os chamados",
            description = "Ordenado da data mais recente para a mais antiga. O usuário comum vê só os chamados que "
                    + "abriu; o administrador vê todos e pode filtrar por data ou setor.")
    @ApiResponse(responseCode = "200", description = "Página de chamados")
    @ApiResponse(responseCode = "400", description = "Filtro ou paginação inválidos",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário comum usando filtro de data ou setor",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public PageResponse<TicketResponse> listTickets(@Valid @ParameterObject ListTicketsRequest request,
                                                    AuthenticatedUser currentUser) {
        return ticketService.listTickets(request, currentUser);
    }

    @GetMapping("/{ticketId}")
    @Operation(summary = "Consulta um chamado")
    @ApiResponse(responseCode = "200", description = "Dados do chamado")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Chamado não encontrado ou de outro usuário",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public TicketResponse getTicket(
            @Parameter(description = TICKET_ID_DESCRIPTION, example = TICKET_ID_EXAMPLE) @PathVariable UUID ticketId,
            AuthenticatedUser currentUser) {
        return ticketService.getTicket(ticketId, currentUser);
    }

    @DeleteMapping("/{ticketId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cancela um chamado",
            description = "Só é permitido enquanto o chamado está OPEN. O chamado cancelado é excluído do sistema.")
    @ApiResponse(responseCode = "204", description = "Chamado cancelado e excluído")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Token CSRF ausente ou inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Chamado não encontrado ou de outro usuário",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Chamado com tratativa já iniciada",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public void cancelTicket(
            @Parameter(description = TICKET_ID_DESCRIPTION, example = TICKET_ID_EXAMPLE) @PathVariable UUID ticketId,
            AuthenticatedUser currentUser) {
        ticketService.cancelTicket(ticketId, currentUser);
    }

    @PatchMapping(ApiRoutes.TICKET_STATUS)
    @Operation(summary = "Altera o status de um chamado",
            description = "Exclusivo do administrador. Transições permitidas: OPEN → IN_PROGRESS, "
                    + "OPEN → FINISHED e IN_PROGRESS → FINISHED.")
    @ApiResponse(responseCode = "200", description = "Status alterado")
    @ApiResponse(responseCode = "400", description = "Status ausente ou desconhecido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Chamado não encontrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Transição de status não permitida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public TicketResponse changeStatus(
            @Parameter(description = TICKET_ID_DESCRIPTION, example = TICKET_ID_EXAMPLE) @PathVariable UUID ticketId,
            @RequestBody @Valid ChangeTicketStatusRequest request) {
        return ticketService.changeStatus(ticketId, request);
    }
}
