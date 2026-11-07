package com.uvv.atendix.security;

public final class SecurityAuthorities {

    public static final String ROLE_PREFIX = "ROLE_";
    public static final String ADMIN = "ADMIN";
    public static final String COMMON = "COMMON";

    // Granted instead of the role while the user still holds the initial password
    public static final String PASSWORD_CHANGE_REQUIRED = "PASSWORD_CHANGE_REQUIRED";

    private SecurityAuthorities() {
    }
}
