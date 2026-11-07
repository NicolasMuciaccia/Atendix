package com.uvv.atendix.security;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public class NotRevokedTokenValidator implements OAuth2TokenValidator<Jwt> {

    private static final OAuth2Error REVOKED_TOKEN =
            new OAuth2Error(OAuth2ErrorCodes.INVALID_TOKEN, "Token has been revoked", null);

    private final TokenDenylist tokenDenylist;

    public NotRevokedTokenValidator(TokenDenylist tokenDenylist) {
        this.tokenDenylist = tokenDenylist;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        if (tokenDenylist.isRevoked(jwt.getId())) {
            return OAuth2TokenValidatorResult.failure(REVOKED_TOKEN);
        }
        return OAuth2TokenValidatorResult.success();
    }
}
