package com.uvv.atendix.service;

import com.uvv.atendix.AppProperties;
import com.uvv.atendix.model.dto.AuthSession;
import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.request.ChangePasswordRequest;
import com.uvv.atendix.model.request.LoginRequest;
import com.uvv.atendix.repository.UserRepository;
import com.uvv.atendix.security.LoginAttemptLimiter;
import com.uvv.atendix.security.TokenService;
import com.uvv.atendix.util.exception.AuthenticationFailedException;
import com.uvv.atendix.util.exception.BusinessException;
import com.uvv.atendix.util.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private static final String INVALID_CREDENTIALS = "Login ou senha inválidos";
    private static final String INVALID_SESSION = "Sessão inválida ou expirada. Faça login novamente.";
    private static final String USER_NOT_FOUND = "Usuário não encontrado: ";
    private static final String WRONG_CURRENT_PASSWORD = "A senha atual está incorreta";
    private static final String NEW_PASSWORD_IS_INITIAL = "A nova senha não pode ser igual à senha inicial";
    private static final String NEW_PASSWORD_IS_CURRENT = "A nova senha deve ser diferente da senha atual";
    private static final String USER_DEACTIVATED = "Esta conta está desativada. Procure o administrador.";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final UserMapper userMapper;
    private final LoginAttemptLimiter loginAttemptLimiter;
    private final String initialPassword;
    // Compared against when the login does not exist, so both failures take the same time
    private final String unknownUserPasswordHash;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService,
                       UserMapper userMapper, LoginAttemptLimiter loginAttemptLimiter, AppProperties appProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.userMapper = userMapper;
        this.loginAttemptLimiter = loginAttemptLimiter;
        this.initialPassword = appProperties.users().initialPassword();
        this.unknownUserPasswordHash = passwordEncoder.encode(UUID.randomUUID().toString());
    }

    @Transactional(readOnly = true)
    public AuthSession login(LoginRequest request) {
        String login = User.normalizeLogin(request.login());
        loginAttemptLimiter.ensureNotBlocked(login);

        User user = authenticate(login, request.password());
        validateActive(user);
        loginAttemptLimiter.reset(login);

        log.info("User {} logged in", user.getId());
        return openSession(user);
    }

    @Transactional(readOnly = true)
    public AuthSession refresh(String refreshToken) {
        UUID userId = tokenService.consumeRefreshToken(refreshToken);
        User user = userRepository.findById(userId)
                .filter(User::isActive)
                .orElseThrow(() -> new AuthenticationFailedException(INVALID_SESSION));

        return openSession(user);
    }

    public void logout(String accessToken, String refreshToken) {
        tokenService.revokeAccessTokenIfActive(accessToken);
        tokenService.revokeRefreshTokenIfActive(refreshToken);
    }

    @Transactional
    public AuthSession changePassword(AuthenticatedUser currentUser, ChangePasswordRequest request,
                                      String refreshToken) {
        User user = findUser(currentUser.id());
        validateCurrentPassword(request.currentPassword(), user);
        validateNewPassword(request.newPassword(), request.currentPassword());

        user.changePassword(passwordEncoder.encode(request.newPassword()));
        User savedUser = userRepository.save(user);

        revokeSessions(currentUser, refreshToken);

        log.info("User {} changed the password", savedUser.getId());
        return openSession(savedUser);
    }

    private User authenticate(String login, String password) {
        Optional<User> user = userRepository.findByLogin(login);
        String passwordHash = user.map(User::getPasswordHash).orElse(unknownUserPasswordHash);
        boolean passwordMatches = passwordEncoder.matches(password, passwordHash);

        if (user.isEmpty() || !passwordMatches) {
            loginAttemptLimiter.recordFailure(login);
            throw new AuthenticationFailedException(INVALID_CREDENTIALS);
        }
        return user.get();
    }

    // Checked only after the password matches, so it does not reveal which logins exist
    private void validateActive(User user) {
        if (!user.isActive()) {
            throw new AuthenticationFailedException(USER_DEACTIVATED);
        }
    }

    private void validateCurrentPassword(String currentPassword, User user) {
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BusinessException(WRONG_CURRENT_PASSWORD);
        }
    }

    private void validateNewPassword(String newPassword, String currentPassword) {
        if (newPassword.equals(initialPassword)) {
            throw new BusinessException(NEW_PASSWORD_IS_INITIAL);
        }
        if (newPassword.equals(currentPassword)) {
            throw new BusinessException(NEW_PASSWORD_IS_CURRENT);
        }
    }

    // Sessions on other devices end too. The current pair is also revoked by id: the per-user cutoff
    // spares a token issued in the very same millisecond
    private void revokeSessions(AuthenticatedUser currentUser, String refreshToken) {
        tokenService.revokeAllSessionsOf(currentUser.id());
        tokenService.revoke(currentUser.accessTokenId(), currentUser.accessTokenExpiresAt());
        tokenService.revokeRefreshTokenIfActive(refreshToken);
    }

    private AuthSession openSession(User user) {
        return new AuthSession(tokenService.issueFor(user), userMapper.toResponse(user));
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND + userId));
    }
}
