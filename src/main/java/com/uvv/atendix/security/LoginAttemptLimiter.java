package com.uvv.atendix.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.uvv.atendix.AppProperties;
import com.uvv.atendix.util.exception.TooManyAttemptsException;
import org.springframework.stereotype.Component;

/**
 * Counts wrong passwords per login. After too many, the login is blocked for a while, which keeps
 * someone from guessing passwords; the count expires on its own after the block duration.
 */
@Component
public class LoginAttemptLimiter {

    private static final String BLOCKED = "Muitas tentativas de login sem sucesso. Aguarde %d minutos e tente novamente.";

    private final int maxFailures;
    private final long blockMinutes;
    private final Cache<String, Integer> failures;

    public LoginAttemptLimiter(AppProperties appProperties) {
        AppProperties.Login login = appProperties.security().login();
        this.maxFailures = login.maxFailures();
        this.blockMinutes = login.blockDuration().toMinutes();
        this.failures = Caffeine.newBuilder().expireAfterWrite(login.blockDuration()).build();
    }

    public void ensureNotBlocked(String login) {
        Integer count = failures.getIfPresent(login);
        if (count != null && count >= maxFailures) {
            throw new TooManyAttemptsException(BLOCKED.formatted(blockMinutes));
        }
    }

    public void recordFailure(String login) {
        failures.asMap().merge(login, 1, Integer::sum);
    }

    public void reset(String login) {
        failures.invalidate(login);
    }
}
