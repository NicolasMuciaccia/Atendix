package com.uvv.atendix.controller;

import com.uvv.atendix.ApiErrorResponse;
import com.uvv.atendix.model.request.ItemRequest;
import com.uvv.atendix.model.response.ItemResponse;
import com.uvv.atendix.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiRoutes.ITEMS)
@Tag(name = "Itens", description = "Cadastro de itens (equipamentos), cada um com setor e etiqueta. "
        + "Leitura para todos; alteração exclusiva do administrador.")
public class ItemController {

    private static final String ITEM_ID = "Identificador do item.";
    private static final String ITEM_ID_EXAMPLE = "3d2c1b0a-9f8e-4d7c-8b6a-5f4e3d2c1b0a";

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    @Operation(summary = "Lista os itens", description = "Ordenados por nome, com setor e etiqueta.")
    @ApiResponse(responseCode = "200", description = "Itens cadastrados")
    @ApiResponse(responseCode = "400", description = "Identificador de setor inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public List<ItemResponse> listItems(
            @Parameter(description = "Mostra só os itens deste setor.", example = "5f0c3a52-7d1e-4c9b-8a2f-1b3c4d5e6f70")
            @RequestParam(required = false) UUID sectorId) {
        return itemService.listItems(sectorId);
    }

    @PostMapping
    @Operation(summary = "Cadastra um item", description = "Exclusivo do administrador. A etiqueta precisa estar livre.")
    @ApiResponse(responseCode = "201", description = "Item cadastrado")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "A etiqueta já pertence a outro item",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "422", description = "Setor ou etiqueta informados não existem",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<ItemResponse> createItem(@RequestBody @Valid ItemRequest request) {
        ItemResponse createdItem = itemService.createItem(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{itemId}").buildAndExpand(createdItem.id()).toUri();
        return ResponseEntity.created(location).body(createdItem);
    }

    @PutMapping("/{itemId}")
    @Operation(summary = "Edita um item",
            description = "Exclusivo do administrador. Chamados do item passam a mostrar o setor e a etiqueta novos.")
    @ApiResponse(responseCode = "200", description = "Item editado")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Item não encontrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "A etiqueta já pertence a outro item",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "422", description = "Setor ou etiqueta informados não existem",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ItemResponse updateItem(
            @Parameter(description = ITEM_ID, example = ITEM_ID_EXAMPLE) @PathVariable UUID itemId,
            @RequestBody @Valid ItemRequest request) {
        return itemService.updateItem(itemId, request);
    }

    @DeleteMapping("/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui um item", description = "Exclusivo do administrador. Só é possível sem chamados do item.")
    @ApiResponse(responseCode = "204", description = "Item excluído")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Item não encontrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "O item tem chamados registrados",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public void deleteItem(@Parameter(description = ITEM_ID, example = ITEM_ID_EXAMPLE) @PathVariable UUID itemId) {
        itemService.deleteItem(itemId);
    }
}
