package com.uvv.atendix.security;

import com.uvv.atendix.TestProperties;
import com.uvv.atendix.util.exception.TooManyAttemptsException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LoginAttemptLimiterTest {

    private static final String LOGIN = "maria.souza";

    private final LoginAttemptLimiter limiter = new LoginAttemptLimiter(TestProperties.appProperties());

    @Test
    void shouldBlockLoginAfterTooManyWrongPasswords() {
        failTimes(TestProperties.MAX_LOGIN_FAILURES);

        assertThatThrownBy(() -> limiter.ensureNotBlocked(LOGIN))
                .isInstanceOf(TooManyAttemptsException.class);
    }

    @Test
    void shouldStillAllowLoginBelowTheLimit() {
        failTimes(TestProperties.MAX_LOGIN_FAILURES - 1);

        assertThatCode(() -> limiter.ensureNotBlocked(LOGIN)).doesNotThrowAnyException();
    }

    @Test
    void shouldForgetFailuresAfterSuccessfulLogin() {
        failTimes(TestProperties.MAX_LOGIN_FAILURES);

        limiter.reset(LOGIN);

        assertThatCode(() -> limiter.ensureNotBlocked(LOGIN)).doesNotThrowAnyException();
    }

    @Test
    void shouldCountEachLoginSeparately() {
        failTimes(TestProperties.MAX_LOGIN_FAILURES);

        assertThatCode(() -> limiter.ensureNotBlocked("outro.login")).doesNotThrowAnyException();
    }

    private void failTimes(int times) {
        for (int attempt = 0; attempt < times; attempt++) {
            limiter.recordFailure(LOGIN);
        }
    }
}
