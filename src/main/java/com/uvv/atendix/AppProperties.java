package com.uvv.atendix;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        @Valid @NotNull Security security,
        @Valid @NotNull Users users) {

    public record Security(
            @Valid @NotNull Jwt jwt,
            @Valid @NotNull Cookie cookie,
            @Valid @NotNull Argon2 argon2,
            @Valid @NotNull Login login) {
    }

    /** Guessing protection: after maxFailures wrong passwords the login waits blockDuration. */
    public record Login(
            @Positive int maxFailures,
            @NotNull Duration blockDuration) {
    }

    public record Jwt(
            // HS256 requires a key of at least 256 bits
            @NotBlank @Size(min = 32) String secret,
            @NotBlank String issuer,
            @NotNull Duration accessTokenTtl,
            @NotNull Duration refreshTokenTtl) {
    }

    public record Cookie(
            boolean secure,
            @NotBlank String sameSite) {
    }

    public record Argon2(
            @Positive int saltLength,
            @Positive int hashLength,
            @Positive int parallelism,
            @Positive int memoryKib,
            @Positive int iterations) {
    }

    public record Users(
            @NotBlank String initialPassword) {
    }
}
