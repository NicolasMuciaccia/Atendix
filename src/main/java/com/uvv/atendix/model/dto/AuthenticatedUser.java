package com.uvv.atendix.model.dto;

import com.uvv.atendix.model.enums.Role;

import java.time.Instant;
import java.util.UUID;

/**
 * The caller of the current request, taken from the validated access token.
 */
public record AuthenticatedUser(UUID id, Role role, String accessTokenId, Instant accessTokenExpiresAt) {

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }
}
