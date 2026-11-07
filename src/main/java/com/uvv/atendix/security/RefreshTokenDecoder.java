package com.uvv.atendix.security;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

/**
 * Wraps the refresh token decoder in its own type so the resource server keeps a single
 * {@link JwtDecoder} bean, the one that only accepts access tokens.
 */
public final class RefreshTokenDecoder {

    private final JwtDecoder delegate;

    public RefreshTokenDecoder(JwtDecoder delegate) {
        this.delegate = delegate;
    }

    public Jwt decode(String token) throws JwtException {
        return delegate.decode(token);
    }
}
