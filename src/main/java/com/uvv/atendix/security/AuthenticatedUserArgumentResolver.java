package com.uvv.atendix.security;

import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.enums.Role;
import com.uvv.atendix.util.exception.AuthenticationFailedException;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.UUID;

@Component
public class AuthenticatedUserArgumentResolver implements HandlerMethodArgumentResolver {

    private static final String NOT_AUTHENTICATED = "Sessão não autenticada. Faça login novamente.";

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return AuthenticatedUser.class.equals(parameter.getParameterType());
    }

    @Override
    public AuthenticatedUser resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                             NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new AuthenticationFailedException(NOT_AUTHENTICATED);
        }

        Jwt jwt = jwtAuthentication.getToken();
        return new AuthenticatedUser(
                UUID.fromString(jwt.getSubject()),
                Role.valueOf(jwt.getClaimAsString(TokenClaims.ROLE)),
                jwt.getId(),
                jwt.getExpiresAt());
    }
}
