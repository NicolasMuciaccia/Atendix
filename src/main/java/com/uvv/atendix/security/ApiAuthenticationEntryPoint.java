package com.uvv.atendix.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ApiAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger log = LoggerFactory.getLogger(ApiAuthenticationEntryPoint.class);

    private static final String ERROR = "Não autenticado";
    private static final String MESSAGE = "Sessão ausente, expirada ou inválida. Faça login novamente.";

    private final ApiErrorWriter apiErrorWriter;

    public ApiAuthenticationEntryPoint(ApiErrorWriter apiErrorWriter) {
        this.apiErrorWriter = apiErrorWriter;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        log.warn("{}: {} {} ({})", ERROR, request.getMethod(), request.getRequestURI(),
                authException.getClass().getSimpleName());
        apiErrorWriter.write(response, HttpStatus.UNAUTHORIZED, ERROR, MESSAGE);
    }
}
