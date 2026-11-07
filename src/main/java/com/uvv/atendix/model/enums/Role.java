package com.uvv.atendix.model.enums;

import java.util.Arrays;

public enum Role {

    COMMON(0),
    ADMIN(1);

    private final int code;

    Role(int code) {
        this.code = code;
    }

    public int code() {
        return code;
    }

    public static Role fromCode(int code) {
        return Arrays.stream(values())
                .filter(role -> role.code == code)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Unknown role code in column users.role: " + code));
    }
}
