package com.uvv.atendix.controller;

import com.uvv.atendix.ApiErrorResponse;
import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.request.ChangeRoleRequest;
import com.uvv.atendix.model.request.ChangeUserActiveRequest;
import com.uvv.atendix.model.request.CreateUserRequest;
import com.uvv.atendix.model.request.ListUsersRequest;
import com.uvv.atendix.model.response.PageResponse;
import com.uvv.atendix.model.response.UserResponse;
import com.uvv.atendix.service.UserService;
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
@RequestMapping(ApiRoutes.USERS)
@Tag(name = "Usuários", description = "Perfil do usuário autenticado e administração de usuários")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(ApiRoutes.CURRENT_USER)
    @Operation(summary = "Consulta o usuário autenticado")
    @ApiResponse(responseCode = "200", description = "Dados do usuário autenticado")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public UserResponse getCurrentUser(AuthenticatedUser currentUser) {
        return userService.getUser(currentUser.id());
    }

    @PostMapping
    @Operation(summary = "Cadastra um usuário",
            description = "Exclusivo do administrador. O usuário nasce com a senha inicial e precisa trocá-la no primeiro acesso.")
    @ApiResponse(responseCode = "201", description = "Usuário cadastrado")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Login já cadastrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        UserResponse createdUser = userService.createUser(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{userId}").buildAndExpand(createdUser.id()).toUri();
        return ResponseEntity.created(location).body(createdUser);
    }

    @GetMapping
    @Operation(summary = "Lista os usuários", description = "Exclusivo do administrador. Ordenado por nome.")
    @ApiResponse(responseCode = "200", description = "Página de usuários")
    @ApiResponse(responseCode = "400", description = "Paginação inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public PageResponse<UserResponse> listUsers(@Valid @ParameterObject ListUsersRequest request) {
        return userService.listUsers(request);
    }

    @PatchMapping("/{userId}/role")
    @Operation(summary = "Altera o perfil de um usuário", description = "Exclusivo do administrador.")
    @ApiResponse(responseCode = "200", description = "Perfil alterado")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Usuário não encontrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "422", description = "Tentativa de alterar o próprio perfil",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public UserResponse changeRole(
            @Parameter(description = "Identificador do usuário.", example = "8f14e45f-ceea-467a-9575-0f9a2c6e0b1d")
            @PathVariable UUID userId,
            @RequestBody @Valid ChangeRoleRequest request,
            AuthenticatedUser currentUser) {
        return userService.changeRole(userId, request, currentUser);
    }

    @PatchMapping("/{userId}/active")
    @Operation(summary = "Ativa ou desativa um usuário",
            description = "Exclusivo do administrador. A conta desativada não entra e tem as sessões encerradas; "
                    + "os chamados dela continuam no histórico. A própria conta não pode ser desativada.")
    @ApiResponse(responseCode = "200", description = "Situação da conta alterada")
    @ApiResponse(responseCode = "400", description = "Payload inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Usuário não encontrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "422", description = "Tentativa de desativar a própria conta",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public UserResponse changeActive(
            @Parameter(description = "Identificador do usuário.", example = "8f14e45f-ceea-467a-9575-0f9a2c6e0b1d")
            @PathVariable UUID userId,
            @RequestBody @Valid ChangeUserActiveRequest request,
            AuthenticatedUser currentUser) {
        return userService.changeActive(userId, request, currentUser);
    }

    @PostMapping("/{userId}/password-reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Redefine a senha de um usuário para a senha inicial",
            description = "Exclusivo do administrador. O usuário precisará trocar a senha no próximo acesso.")
    @ApiResponse(responseCode = "204", description = "Senha redefinida")
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Usuário não é administrador ou token CSRF inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Usuário não encontrado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public void resetPassword(
            @Parameter(description = "Identificador do usuário.", example = "8f14e45f-ceea-467a-9575-0f9a2c6e0b1d")
            @PathVariable UUID userId) {
        userService.resetPassword(userId);
    }
}
