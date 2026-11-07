package com.uvv.atendix.model.dto;

import java.time.Instant;

public record IssuedToken(String value, String id, Instant expiresAt) {

    @Override
    public String toString() {
        return "IssuedToken[value=***, id=" + id + ", expiresAt=" + expiresAt + "]";
    }
}
