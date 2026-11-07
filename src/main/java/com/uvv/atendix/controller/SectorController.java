package com.uvv.atendix.controller;

import com.uvv.atendix.ApiErrorResponse;
import com.uvv.atendix.model.request.SectorRequest;
import com.uvv.atendix.model.response.SectorResponse;
import com.uvv.atendix.service.SectorService;
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
@RequestMapping(ApiRoutes.SECTORS)
@Tag(name = "Setores", description = "Cadastro de setores. Leitura para todos; alteração exclusiva do administrador.")
public class SectorController {

    private static final String SECTOR_ID = "Identificador do setor.";
    private static final String SECTOR_ID_EXAMPLE = "5f0c3a52-7d1e-4c9b-8a2f-1b3c4d5e6f70";

    private final SectorService sectorService;

    public SectorController(SectorService sectorService) {
        this.sectorService = sectorService;
    }

    @GetMapping
    @Operation(summary = "Lista os setores", description = "Ordenados por nome.")
    @ApiResponse(responseCode = "200", description = "Setores cadastrados")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public List<SectorResponse> listSectors() {
        return sectorService.listSectors();
    }

    @PostMapping
    @Operation(summary = "Cadastra um setor", description = "Exclusivo do administrador.")
    @ApiResponse(responseCode = "201", description = "Setor cadastrado")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Já existe um setor com esse nome",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<SectorResponse> createSector(@RequestBody @Valid SectorRequest request) {
        SectorResponse createdSector = sectorService.createSector(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{sectorId}").buildAndExpand(createdSector.id()).toUri();
        return ResponseEntity.created(location).body(createdSector);
    }

    @PutMapping("/{sectorId}")
    @Operation(summary = "Edita um setor", description = "Exclusivo do administrador.")
    @ApiResponse(responseCode = "200", description = "Setor editado")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Setor não encontrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Já existe outro setor com esse nome",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public SectorResponse updateSector(
            @Parameter(description = SECTOR_ID, example = SECTOR_ID_EXAMPLE) @PathVariable UUID sectorId,
            @RequestBody @Valid SectorRequest request) {
        return sectorService.updateSector(sectorId, request);
    }

    @DeleteMapping("/{sectorId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui um setor", description = "Exclusivo do administrador. Só é possível sem itens no setor.")
    @ApiResponse(responseCode = "204", description = "Setor excluído")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Setor não encontrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "O setor tem itens cadastrados",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public void deleteSector(
            @Parameter(description = SECTOR_ID, example = SECTOR_ID_EXAMPLE) @PathVariable UUID sectorId) {
        sectorService.deleteSector(sectorId);
    }
}
