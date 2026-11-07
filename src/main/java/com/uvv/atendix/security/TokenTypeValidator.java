package com.uvv.atendix.security;

import com.uvv.atendix.model.enums.TokenType;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Keeps a refresh token from being accepted as an access token and vice versa.
 */
public class TokenTypeValidator implements OAuth2TokenValidator<Jwt> {

    private final TokenType expectedType;
    private final OAuth2Error wrongTypeError;

    public TokenTypeValidator(TokenType expectedType) {
        this.expectedType = expectedType;
        this.wrongTypeError = new OAuth2Error(OAuth2ErrorCodes.INVALID_TOKEN,
                "Expected a token of type " + expectedType, null);
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        if (expectedType.name().equals(jwt.getClaimAsString(TokenClaims.TOKEN_TYPE))) {
            return OAuth2TokenValidatorResult.success();
        }
        return OAuth2TokenValidatorResult.failure(wrongTypeError);
    }
}
