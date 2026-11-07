package com.uvv.atendix.controller;

import com.uvv.atendix.ApiErrorResponse;
import com.uvv.atendix.model.request.AssetTagRequest;
import com.uvv.atendix.model.response.AssetTagResponse;
import com.uvv.atendix.service.AssetTagService;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiRoutes.ASSET_TAGS)
@Tag(name = "Etiquetas", description = "Cadastro de etiquetas de patrimônio. Leitura para todos; alteração exclusiva do administrador.")
public class AssetTagController {

    private static final String TAG_ID = "Identificador da etiqueta.";
    private static final String TAG_ID_EXAMPLE = "9a8b7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d";

    private final AssetTagService assetTagService;

    public AssetTagController(AssetTagService assetTagService) {
        this.assetTagService = assetTagService;
    }

    @GetMapping
    @Operation(summary = "Lista as etiquetas", description = "Ordenadas por código, com o item que cada uma identifica.")
    @ApiResponse(responseCode = "200", description = "Etiquetas cadastradas")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public List<AssetTagResponse> listAssetTags() {
        return assetTagService.listAssetTags();
    }

    @PostMapping
    @Operation(summary = "Cadastra uma etiqueta", description = "Exclusivo do administrador. O código é gravado em maiúsculas.")
    @ApiResponse(responseCode = "201", description = "Etiqueta cadastrada")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Já existe uma etiqueta com esse código",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<AssetTagResponse> createAssetTag(@RequestBody @Valid AssetTagRequest request) {
        AssetTagResponse createdTag = assetTagService.createAssetTag(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{assetTagId}").buildAndExpand(createdTag.id()).toUri();
        return ResponseEntity.created(location).body(createdTag);
    }

    @PutMapping("/{assetTagId}")
    @Operation(summary = "Edita uma etiqueta", description = "Exclusivo do administrador.")
    @ApiResponse(responseCode = "200", description = "Etiqueta editada")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Etiqueta não encontrada",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Já existe outra etiqueta com esse código",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public AssetTagResponse updateAssetTag(
            @Parameter(description = TAG_ID, example = TAG_ID_EXAMPLE) @PathVariable UUID assetTagId,
            @RequestBody @Valid AssetTagRequest request) {
        return assetTagService.updateAssetTag(assetTagId, request);
    }

    @DeleteMapping("/{assetTagId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui uma etiqueta", description = "Exclusivo do administrador. Só é possível com a etiqueta livre.")
    @ApiResponse(responseCode = "204", description = "Etiqueta excluída")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Etiqueta não encontrada",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "A etiqueta está vinculada a um item",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public void deleteAssetTag(
            @Parameter(description = TAG_ID, example = TAG_ID_EXAMPLE) @PathVariable UUID assetTagId) {
        assetTagService.deleteAssetTag(assetTagId);
    }
}
