package com.uvv.atendix.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.Expiry;
import com.uvv.atendix.AppProperties;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Revoked tokens, kept in memory until they would expire on their own. Two granularities: one token
 * (logout, refresh rotation) or every token of a user issued before a moment (password reset, role
 * change, deactivation). The application runs as a single instance, so a local cache is enough;
 * a restart clears it.
 */
@Component
public class TokenDenylist {

    private final Clock clock;
    private final Cache<String, Instant> revokedTokens;
    private final Cache<UUID, Instant> userCutoffs;

    public TokenDenylist(Clock clock, AppProperties appProperties) {
        this.clock = clock;
        // No maximum size on purpose: evicting an entry early would make a revoked token valid again
        this.revokedTokens = Caffeine.newBuilder()
                .expireAfter(Expiry.<String, Instant>creating((tokenId, expiresAt) -> remainingLifetime(expiresAt)))
                .build();
        // After the longest token lifetime every token issued before the cutoff has expired anyway
        this.userCutoffs = Caffeine.newBuilder()
                .expireAfterWrite(appProperties.security().jwt().refreshTokenTtl())
                .build();
    }

    public void revoke(String tokenId, Instant expiresAt) {
        if (tokenId == null || expiresAt == null) {
            throw new IllegalArgumentException("Token id and expiration are required to revoke a token");
        }
        if (remainingLifetime(expiresAt).isPositive()) {
            revokedTokens.put(tokenId, expiresAt);
        }
    }

    /** Invalidates every token of the user issued before now; tokens issued from now on stay valid. */
    public void revokeAllOf(UUID userId) {
        userCutoffs.put(userId, clock.instant().truncatedTo(ChronoUnit.MILLIS));
    }

    public boolean isRevoked(String tokenId, UUID userId, Instant issuedAt) {
        if (tokenId != null && revokedTokens.getIfPresent(tokenId) != null) {
            return true;
        }
        Instant cutoff = userId == null ? null : userCutoffs.getIfPresent(userId);
        return cutoff != null && issuedAt != null && issuedAt.isBefore(cutoff);
    }

    private Duration remainingLifetime(Instant expiresAt) {
        return Duration.between(clock.instant(), expiresAt);
    }
}
