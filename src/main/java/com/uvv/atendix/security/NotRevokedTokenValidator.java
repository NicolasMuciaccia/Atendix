package com.uvv.atendix.security;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.UUID;

public class NotRevokedTokenValidator implements OAuth2TokenValidator<Jwt> {

    private static final OAuth2Error REVOKED_TOKEN =
            new OAuth2Error(OAuth2ErrorCodes.INVALID_TOKEN, "Token has been revoked", null);
    private static final OAuth2Error INVALID_SUBJECT =
            new OAuth2Error(OAuth2ErrorCodes.INVALID_TOKEN, "Token subject is not a user id", null);

    private final TokenDenylist tokenDenylist;

    public NotRevokedTokenValidator(TokenDenylist tokenDenylist) {
        this.tokenDenylist = tokenDenylist;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        if (jwt.getSubject() == null) {
            return OAuth2TokenValidatorResult.failure(INVALID_SUBJECT);
        }

        UUID userId;
        try {
            userId = UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException e) {
            return OAuth2TokenValidatorResult.failure(INVALID_SUBJECT);
        }

        if (tokenDenylist.isRevoked(jwt.getId(), userId, issuedAtOf(jwt))) {
            return OAuth2TokenValidatorResult.failure(REVOKED_TOKEN);
        }
        return OAuth2TokenValidatorResult.success();
    }

    // Milliseconds when the token has them; "iat" (whole seconds) otherwise
    private Instant issuedAtOf(Jwt jwt) {
        Object millis = jwt.getClaim(TokenClaims.ISSUED_AT_MILLIS);
        return millis instanceof Number number ? Instant.ofEpochMilli(number.longValue()) : jwt.getIssuedAt();
    }
}
