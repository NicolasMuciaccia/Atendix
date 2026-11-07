package com.uvv.atendix.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.csrf.CsrfException;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ApiAccessDeniedHandler implements AccessDeniedHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiAccessDeniedHandler.class);

    private static final String ERROR = "Acesso negado";
    private static final String FORBIDDEN_MESSAGE = "Você não tem permissão para executar esta operação.";
    private static final String PASSWORD_CHANGE_MESSAGE = "Troque a senha inicial antes de continuar.";
    private static final String CSRF_MESSAGE = "Token CSRF ausente ou inválido. Recarregue a página e tente novamente.";

    private final ApiErrorWriter apiErrorWriter;

    public ApiAccessDeniedHandler(ApiErrorWriter apiErrorWriter) {
        this.apiErrorWriter = apiErrorWriter;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        log.warn("{}: {} {} ({})", ERROR, request.getMethod(), request.getRequestURI(),
                accessDeniedException.getClass().getSimpleName());
        apiErrorWriter.write(response, HttpStatus.FORBIDDEN, ERROR, messageFor(accessDeniedException));
    }

    private String messageFor(AccessDeniedException exception) {
        if (exception instanceof CsrfException) {
            return CSRF_MESSAGE;
        }
        if (isWaitingForPasswordChange()) {
            return PASSWORD_CHANGE_MESSAGE;
        }
        return FORBIDDEN_MESSAGE;
    }

    private boolean isWaitingForPasswordChange() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> SecurityAuthorities.PASSWORD_CHANGE_REQUIRED.equals(authority.getAuthority()));
    }
}
