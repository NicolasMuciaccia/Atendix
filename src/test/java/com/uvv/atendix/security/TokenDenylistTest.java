package com.uvv.atendix.security;

import com.uvv.atendix.TestProperties;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class TokenDenylistTest {

    private static final Instant NOW = Instant.parse("2026-11-07T12:00:00.750Z");
    private static final String TOKEN_ID = "a6c0f6b2-0c8e-4d3e-9e43-1d7a2a1f0c11";
    private static final UUID USER_ID = UUID.fromString("0b7c4e2a-31d5-4f6a-8e9b-2c3d4e5f6a7b");
    private static final Instant ISSUED_EARLIER = Instant.parse("2026-11-07T11:50:00Z");

    private final TokenDenylist tokenDenylist =
            new TokenDenylist(Clock.fixed(NOW, ZoneOffset.UTC), TestProperties.appProperties());

    @Test
    void shouldRejectRevokedTokenUntilItExpires() {
        tokenDenylist.revoke(TOKEN_ID, NOW.plus(Duration.ofMinutes(15)));

        assertThat(tokenDenylist.isRevoked(TOKEN_ID, USER_ID, ISSUED_EARLIER)).isTrue();
    }

    @Test
    void shouldNotKeepTokenThatAlreadyExpired() {
        tokenDenylist.revoke(TOKEN_ID, NOW.minusSeconds(1));

        assertThat(tokenDenylist.isRevoked(TOKEN_ID, USER_ID, ISSUED_EARLIER)).isFalse();
    }

    @Test
    void shouldTreatUnknownTokenAsActive() {
        assertThat(tokenDenylist.isRevoked(TOKEN_ID, USER_ID, ISSUED_EARLIER)).isFalse();
    }

    @Test
    void shouldRejectEveryTokenOfTheUserIssuedBeforeTheCutoff() {
        tokenDenylist.revokeAllOf(USER_ID);

        assertThat(tokenDenylist.isRevoked(TOKEN_ID, USER_ID, ISSUED_EARLIER)).isTrue();
        assertThat(tokenDenylist.isRevoked(TOKEN_ID, UUID.randomUUID(), ISSUED_EARLIER)).isFalse();
    }

    @Test
    void shouldCutTokensIssuedEarlierInTheSameSecond() {
        tokenDenylist.revokeAllOf(USER_ID);

        assertThat(tokenDenylist.isRevoked(TOKEN_ID, USER_ID, NOW.minusMillis(200))).isTrue();
        assertThat(tokenDenylist.isRevoked(TOKEN_ID, USER_ID, NOW)).isFalse();
    }
}
