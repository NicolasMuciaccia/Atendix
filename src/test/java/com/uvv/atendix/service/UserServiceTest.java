package com.uvv.atendix.service;

import com.uvv.atendix.TestProperties;
import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.entity.UserFixtures;
import com.uvv.atendix.model.enums.Role;
import com.uvv.atendix.model.request.ChangeRoleRequest;
import com.uvv.atendix.model.request.ChangeUserActiveRequest;
import com.uvv.atendix.model.request.CreateUserRequest;
import com.uvv.atendix.model.response.UserResponse;
import com.uvv.atendix.repository.UserRepository;
import com.uvv.atendix.security.TokenService;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
class UserServiceTest {

    private static final Instant TOKEN_EXPIRES_AT = Instant.parse("2026-11-07T12:15:00Z");

    private final PasswordEncoder passwordEncoder = new Argon2PasswordEncoder(16, 32, 1, 1024, 1);

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder, new UserMapper(), tokenService,
                TestProperties.appProperties());
    }

    @Test
    void shouldEndSessionsOfDeactivatedUser() {
        User user = UserFixtures.common();
        User admin = UserFixtures.admin();
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        UserResponse response = userService.changeActive(user.getId(), new ChangeUserActiveRequest(false),
                new AuthenticatedUser(admin.getId(), Role.ADMIN, "token-id", TOKEN_EXPIRES_AT));

        assertThat(response.active()).isFalse();
        verify(tokenService).revokeAllSessionsOf(user.getId());
    }

    @Test
    void shouldNotLetAdminDeactivateOwnAccount() {
        User admin = UserFixtures.admin();
        AuthenticatedUser currentAdmin = new AuthenticatedUser(admin.getId(), Role.ADMIN, "token-id", TOKEN_EXPIRES_AT);

        assertThatThrownBy(() -> userService.changeActive(admin.getId(), new ChangeUserActiveRequest(false), currentAdmin))
                .isInstanceOf(BusinessException.class);
        verify(tokenService, never()).revokeAllSessionsOf(any());
    }

    @Test
    void shouldEndSessionsWhenRoleChanges() {
        User user = UserFixtures.common();
        User admin = UserFixtures.admin();
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.changeRole(user.getId(), new ChangeRoleRequest(Role.ADMIN),
                new AuthenticatedUser(admin.getId(), Role.ADMIN, "token-id", TOKEN_EXPIRES_AT));

        verify(tokenService).revokeAllSessionsOf(user.getId());
    }

    @Test
    void shouldCreateUserWithInitialPasswordAndPendingChange() {
        when(userRepository.existsByLogin("maria.souza")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.createUser(new CreateUserRequest("Maria Souza", "Maria.Souza", Role.COMMON));

        ArgumentCaptor<User> savedUser = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUser.capture());
        assertThat(response.mustChangePassword()).isTrue();
        assertThat(passwordEncoder.matches(TestProperties.INITIAL_PASSWORD, savedUser.getValue().getPasswordHash()))
                .isTrue();
    }

    @Test
    void shouldRejectLoginAlreadyTaken() {
        when(userRepository.existsByLogin("usuario")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(new CreateUserRequest("Outro", "usuario", Role.COMMON)))
                .isInstanceOf(BusinessConflictException.class);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldNotLetAdminChangeOwnRole() {
        User admin = UserFixtures.admin();
        AuthenticatedUser currentAdmin = new AuthenticatedUser(admin.getId(), Role.ADMIN, "token-id", TOKEN_EXPIRES_AT);

        assertThatThrownBy(() -> userService.changeRole(admin.getId(), new ChangeRoleRequest(Role.COMMON), currentAdmin))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void shouldRequirePasswordChangeAfterReset() {
        User user = UserFixtures.common();
        user.changePassword(passwordEncoder.encode("Atendix#2026"));
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        userService.resetPassword(user.getId());

        assertThat(user.isMustChangePassword()).isTrue();
        assertThat(passwordEncoder.matches(TestProperties.INITIAL_PASSWORD, user.getPasswordHash())).isTrue();
        verify(tokenService).revokeAllSessionsOf(user.getId());
    }
}
