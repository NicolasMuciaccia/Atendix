package com.uvv.atendix.controller;

import com.uvv.atendix.ApiErrorResponse;
import com.uvv.atendix.model.dto.AuthSession;
import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.request.ChangePasswordRequest;
import com.uvv.atendix.model.request.LoginRequest;
import com.uvv.atendix.model.response.UserResponse;
import com.uvv.atendix.security.AuthCookies;
import com.uvv.atendix.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiRoutes.AUTH)
@Tag(name = "Autenticação", description = "Login, renovação de sessão, logout e troca de senha. "
        + "Os tokens trafegam apenas em cookies HttpOnly.")
public class AuthController {

    private final AuthService authService;
    private final AuthCookies authCookies;

    public AuthController(AuthService authService, AuthCookies authCookies) {
        this.authService = authService;
        this.authCookies = authCookies;
    }

    @GetMapping(ApiRoutes.CSRF)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SecurityRequirements
    @Operation(summary = "Emite o token CSRF",
            description = "Grava o cookie XSRF-TOKEN. O front-end chama ao iniciar e devolve o valor no header "
                    + "X-XSRF-TOKEN em toda requisição que altera dados, inclusive o login.")
    @ApiResponse(responseCode = "204", description = "Cookie XSRF-TOKEN gravado")
    public void issueCsrfToken(@Parameter(hidden = true) CsrfToken csrfToken) {
        // The token is generated lazily: reading it is what makes Spring Security write the cookie
        csrfToken.getToken();
    }

    @PostMapping(ApiRoutes.LOGIN)
    @SecurityRequirements
    @Operation(summary = "Autentica o usuário",
            description = "Grava os cookies de sessão. Se mustChangePassword vier verdadeiro, o usuário só pode "
                    + "trocar a senha, consultar o próprio perfil e sair até concluir a troca.")
    @ApiResponse(responseCode = "200", description = "Login realizado; cookies de sessão gravados")
    @ApiResponse(responseCode = "400", description = "Login ou senha não informados",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Login ou senha inválidos, ou conta desativada",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "429", description = "Login bloqueado temporariamente após várias senhas erradas",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Token CSRF ausente ou inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<UserResponse> login(@RequestBody @Valid LoginRequest request) {
        return withSessionCookies(authService.login(request));
    }

    @PostMapping(ApiRoutes.REFRESH)
    @SecurityRequirements
    @Operation(summary = "Renova a sessão",
            description = "Troca o refresh token por um novo par de tokens. Cada refresh token vale uma única vez.")
    @ApiResponse(responseCode = "200", description = "Sessão renovada; novos cookies gravados")
    @ApiResponse(responseCode = "401", description = "Refresh token ausente, expirado ou revogado",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Token CSRF ausente ou inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<UserResponse> refresh(
            @Parameter(hidden = true)
            @CookieValue(name = AuthCookies.REFRESH_TOKEN, required = false) String refreshToken) {
        return withSessionCookies(authService.refresh(refreshToken));
    }

    @PostMapping(ApiRoutes.LOGOUT)
    @SecurityRequirements
    @Operation(summary = "Encerra a sessão",
            description = "Revoga os tokens ainda válidos até a expiração deles e apaga os cookies.")
    @ApiResponse(responseCode = "204", description = "Sessão encerrada")
    @ApiResponse(responseCode = "403", description = "Token CSRF ausente ou inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<Void> logout(
            @Parameter(hidden = true)
            @CookieValue(name = AuthCookies.ACCESS_TOKEN, required = false) String accessToken,
            @Parameter(hidden = true)
            @CookieValue(name = AuthCookies.REFRESH_TOKEN, required = false) String refreshToken) {
        authService.logout(accessToken, refreshToken);
        return ResponseEntity.noContent().headers(authCookies.clearedCookies()).build();
    }

    @PutMapping(ApiRoutes.PASSWORD)
    @Operation(summary = "Troca a senha do usuário autenticado",
            description = "Obrigatória no primeiro acesso. Revoga a sessão atual e grava novos cookies.")
    @ApiResponse(responseCode = "200", description = "Senha alterada; novos cookies gravados")
    @ApiResponse(responseCode = "400", description = "Nova senha fora da política de senha",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sessão ausente, expirada ou inválida",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Token CSRF ausente ou inválido",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "422", description = "Senha atual incorreta ou nova senha igual à inicial ou à atual",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<UserResponse> changePassword(
            AuthenticatedUser currentUser,
            @RequestBody @Valid ChangePasswordRequest request,
            @Parameter(hidden = true)
            @CookieValue(name = AuthCookies.REFRESH_TOKEN, required = false) String refreshToken) {
        return withSessionCookies(authService.changePassword(currentUser, request, refreshToken));
    }

    private ResponseEntity<UserResponse> withSessionCookies(AuthSession session) {
        return ResponseEntity.ok().headers(authCookies.sessionCookies(session.tokens())).body(session.user());
    }
}
