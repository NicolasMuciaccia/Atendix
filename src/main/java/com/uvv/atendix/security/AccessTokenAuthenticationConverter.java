package com.uvv.atendix.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AccessTokenAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final GrantedAuthority PASSWORD_CHANGE_ONLY =
            new SimpleGrantedAuthority(SecurityAuthorities.PASSWORD_CHANGE_REQUIRED);

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        return new JwtAuthenticationToken(jwt, authoritiesOf(jwt), jwt.getSubject());
    }

    private List<GrantedAuthority> authoritiesOf(Jwt jwt) {
        if (Boolean.TRUE.equals(jwt.getClaimAsBoolean(TokenClaims.PASSWORD_CHANGE_REQUIRED))) {
            return List.of(PASSWORD_CHANGE_ONLY);
        }
        String role = jwt.getClaimAsString(TokenClaims.ROLE);
        return List.of(new SimpleGrantedAuthority(SecurityAuthorities.ROLE_PREFIX + role));
    }
}
