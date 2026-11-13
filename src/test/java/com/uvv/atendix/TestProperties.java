package com.uvv.atendix;

import java.time.Duration;

public final class TestProperties {

    public static final String INITIAL_PASSWORD = "mudar@123";
    public static final int MAX_LOGIN_FAILURES = 5;
    public static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(7);

    private TestProperties() {
    }

    public static AppProperties appProperties() {
        return new AppProperties(
                new AppProperties.Security(
                        new AppProperties.Jwt("test-secret-with-at-least-32-characters!", "atendix-test",
                                Duration.ofMinutes(15), REFRESH_TOKEN_TTL),
                        new AppProperties.Cookie(true, "Strict"),
                        new AppProperties.Argon2(16, 32, 1, 1024, 1),
                        new AppProperties.Login(MAX_LOGIN_FAILURES, Duration.ofMinutes(15))),
                new AppProperties.Users(INITIAL_PASSWORD));
    }
}
