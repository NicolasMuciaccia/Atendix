package com.uvv.atendix.security;

public final class TokenClaims {

    public static final String ROLE = "role";
    public static final String TOKEN_TYPE = "token_type";
    public static final String PASSWORD_CHANGE_REQUIRED = "pwd_change_required";
    // "iat" has whole seconds only; ending a user's sessions needs to tell apart tokens of the same second
    public static final String ISSUED_AT_MILLIS = "iat_ms";

    private TokenClaims() {
    }
}
