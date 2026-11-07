package com.uvv.atendix.security;

import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

class TokenDenylistTest {

    private static final Instant NOW = Instant.parse("2026-11-07T12:00:00Z");
    private static final String TOKEN_ID = "a6c0f6b2-0c8e-4d3e-9e43-1d7a2a1f0c11";

    private final TokenDenylist tokenDenylist = new TokenDenylist(Clock.fixed(NOW, ZoneOffset.UTC));

    @Test
    void shouldRejectRevokedTokenUntilItExpires() {
        tokenDenylist.revoke(TOKEN_ID, NOW.plus(Duration.ofMinutes(15)));

        assertThat(tokenDenylist.isRevoked(TOKEN_ID)).isTrue();
    }

    @Test
    void shouldNotKeepTokenThatAlreadyExpired() {
        tokenDenylist.revoke(TOKEN_ID, NOW.minusSeconds(1));

        assertThat(tokenDenylist.isRevoked(TOKEN_ID)).isFalse();
    }

    @Test
    void shouldTreatUnknownTokenAsActive() {
        assertThat(tokenDenylist.isRevoked(TOKEN_ID)).isFalse();
    }
}
