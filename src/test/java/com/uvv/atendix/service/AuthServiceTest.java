package com.uvv.atendix.service;

import com.uvv.atendix.TestProperties;
import com.uvv.atendix.model.dto.AuthSession;
import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.dto.IssuedToken;
import com.uvv.atendix.model.dto.IssuedTokens;
import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.entity.UserFixtures;
import com.uvv.atendix.model.request.ChangePasswordRequest;
import com.uvv.atendix.model.request.LoginRequest;
import com.uvv.atendix.repository.UserRepository;
import com.uvv.atendix.security.TokenService;
import com.uvv.atendix.util.exception.AuthenticationFailedException;
import com.uvv.atendix.util.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String NEW_PASSWORD = "Atendix#2026";
    private static final String ACCESS_TOKEN_ID = "access-token-id";
    private static final String REFRESH_TOKEN = "refresh-token";
    private static final Instant ACCESS_TOKEN_EXPIRES_AT = Instant.parse("2026-11-07T12:15:00Z");

    private final PasswordEncoder passwordEncoder = new Argon2PasswordEncoder(16, 32, 1, 1024, 1);

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    private AuthService authService;
    private User user;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, tokenService, new UserMapper(),
                TestProperties.appProperties());
        user = UserFixtures.withPasswordHash(passwordEncoder.encode(TestProperties.INITIAL_PASSWORD));
    }

    @Test
    void shouldFlagPasswordChangeWhenLoggingInWithInitialPassword() {
        givenUserIsRegistered();
        givenTokensAreIssued();

        AuthSession session = authService.login(new LoginRequest("USUARIO", TestProperties.INITIAL_PASSWORD));

        assertThat(session.user().id()).isEqualTo(user.getId());
        assertThat(session.user().mustChangePassword()).isTrue();
    }

    @Test
    void shouldRejectWrongPassword() {
        givenUserIsRegistered();

        assertThatThrownBy(() -> authService.login(new LoginRequest("usuario", "senha-errada")))
                .isInstanceOf(AuthenticationFailedException.class);
    }

    @Test
    void shouldRejectUnknownLogin() {
        when(userRepository.findByLogin("ninguem")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("ninguem", TestProperties.INITIAL_PASSWORD)))
                .isInstanceOf(AuthenticationFailedException.class);
    }

    @Test
    void shouldReleaseUserAndRevokeOldSessionWhenPasswordChanges() {
        givenUserIsFoundById();
        givenTokensAreIssued();
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthSession session = authService.changePassword(currentUser(),
                new ChangePasswordRequest(TestProperties.INITIAL_PASSWORD, NEW_PASSWORD), REFRESH_TOKEN);

        assertThat(session.user().mustChangePassword()).isFalse();
        assertThat(passwordEncoder.matches(NEW_PASSWORD, user.getPasswordHash())).isTrue();
        verify(tokenService).revoke(ACCESS_TOKEN_ID, ACCESS_TOKEN_EXPIRES_AT);
        verify(tokenService).revokeRefreshTokenIfActive(REFRESH_TOKEN);
    }

    @Test
    void shouldRejectInitialPasswordAsNewPassword() {
        givenUserIsFoundById();
        user.changePassword(passwordEncoder.encode(NEW_PASSWORD));

        assertThatThrownBy(() -> authService.changePassword(currentUser(),
                new ChangePasswordRequest(NEW_PASSWORD, TestProperties.INITIAL_PASSWORD), REFRESH_TOKEN))
                .isInstanceOf(BusinessException.class);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldRejectPasswordChangeWhenCurrentPasswordIsWrong() {
        givenUserIsFoundById();

        assertThatThrownBy(() -> authService.changePassword(currentUser(),
                new ChangePasswordRequest("senha-errada", NEW_PASSWORD), REFRESH_TOKEN))
                .isInstanceOf(BusinessException.class);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldRevokeBothTokensOnLogout() {
        authService.logout("access-token", REFRESH_TOKEN);

        verify(tokenService).revokeAccessTokenIfActive("access-token");
        verify(tokenService).revokeRefreshTokenIfActive(REFRESH_TOKEN);
    }

    private void givenUserIsRegistered() {
        when(userRepository.findByLogin("usuario")).thenReturn(Optional.of(user));
    }

    private void givenUserIsFoundById() {
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
    }

    private void givenTokensAreIssued() {
        IssuedToken token = new IssuedToken("token", "token-id", ACCESS_TOKEN_EXPIRES_AT);
        when(tokenService.issueFor(user)).thenReturn(new IssuedTokens(token, token));
    }

    private AuthenticatedUser currentUser() {
        return new AuthenticatedUser(user.getId(), user.getRole(), ACCESS_TOKEN_ID, ACCESS_TOKEN_EXPIRES_AT);
    }
}
