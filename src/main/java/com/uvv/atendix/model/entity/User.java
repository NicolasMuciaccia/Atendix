package com.uvv.atendix.model.entity;

import com.uvv.atendix.model.enums.Role;
import com.uvv.atendix.model.enums.RoleConverter;
import com.uvv.atendix.util.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Locale;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "name", length = ColumnLengths.NAME, nullable = false)
    private String name;

    @Column(name = "login", length = ColumnLengths.LOGIN, nullable = false, unique = true)
    private String login;

    @Column(name = "password_hash", length = ColumnLengths.PASSWORD_HASH, nullable = false)
    private String passwordHash;

    @Convert(converter = RoleConverter.class)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "must_change_password", nullable = false)
    private boolean mustChangePassword;

    @Column(name = "active", nullable = false)
    private boolean active;

    protected User() {
        // required by JPA; callers use the register(...) factory
    }

    public static User register(String name, String login, Role role, String initialPasswordHash) {
        requireText(name, "O nome do usuário é obrigatório");
        requireText(login, "O login do usuário é obrigatório");
        requireText(initialPasswordHash, "A senha inicial do usuário é obrigatória");
        requireRole(role);

        User user = new User();
        user.name = name.trim();
        user.login = normalizeLogin(login);
        user.role = role;
        user.passwordHash = initialPasswordHash;
        user.mustChangePassword = true;
        user.active = true;
        return user;
    }

    public static String normalizeLogin(String login) {
        return login.trim().toLowerCase(Locale.ROOT);
    }

    public void changePassword(String newPasswordHash) {
        requireText(newPasswordHash, "A nova senha é obrigatória");
        passwordHash = newPasswordHash;
        mustChangePassword = false;
    }

    public void resetPassword(String initialPasswordHash) {
        requireText(initialPasswordHash, "A senha inicial é obrigatória");
        passwordHash = initialPasswordHash;
        mustChangePassword = true;
    }

    public void assignRole(Role newRole) {
        requireRole(newRole);
        role = newRole;
    }

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    public void deactivate() {
        active = false;
    }

    public void activate() {
        active = true;
    }

    private static void requireRole(Role role) {
        if (role == null) {
            throw new BusinessException("O perfil do usuário é obrigatório");
        }
    }

    private static void requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new BusinessException(message);
        }
    }

    public String getName() {
        return name;
    }

    public String getLogin() {
        return login;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public boolean isMustChangePassword() {
        return mustChangePassword;
    }

    public boolean isActive() {
        return active;
    }
}
