package com.uvv.atendix.model.entity;

import com.uvv.atendix.model.enums.Role;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

public final class UserFixtures {

    public static final String PASSWORD_HASH = "$argon2id$v=19$m=1024,t=1,p=1$fixture$hash";

    private UserFixtures() {
    }

    public static User common() {
        return withId(User.register("Usuário Comum", "usuario", Role.COMMON, PASSWORD_HASH));
    }

    public static User admin() {
        return withId(User.register("Administrador", "admin", Role.ADMIN, PASSWORD_HASH));
    }

    public static User withPasswordHash(String passwordHash) {
        return withId(User.register("Usuário Comum", "usuario", Role.COMMON, passwordHash));
    }

    // Simulates the id the Hibernate generator assigns on persist
    private static User withId(User user) {
        ReflectionTestUtils.setField(user, "id", UUID.randomUUID());
        return user;
    }
}
