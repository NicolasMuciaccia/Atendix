package com.uvv.atendix.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.Expiry;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

/**
 * Revoked token ids kept in memory until the token would expire on its own.
 * The application runs as a single instance, so a local cache is enough; a restart clears it.
 */
@Component
public class TokenDenylist {

    private final Clock clock;
    private final Cache<String, Instant> revokedTokens;

    public TokenDenylist(Clock clock) {
        this.clock = clock;
        // No maximum size on purpose: evicting an entry early would make a revoked token valid again
        this.revokedTokens = Caffeine.newBuilder()
                .expireAfter(Expiry.<String, Instant>creating((tokenId, expiresAt) -> remainingLifetime(expiresAt)))
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

    public boolean isRevoked(String tokenId) {
        return tokenId != null && revokedTokens.getIfPresent(tokenId) != null;
    }

    private Duration remainingLifetime(Instant expiresAt) {
        return Duration.between(clock.instant(), expiresAt);
    }
}
