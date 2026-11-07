package com.uvv.atendix.service;

import com.uvv.atendix.AppProperties;
import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.request.ChangeRoleRequest;
import com.uvv.atendix.model.request.CreateUserRequest;
import com.uvv.atendix.model.request.ListUsersRequest;
import com.uvv.atendix.model.response.PageResponse;
import com.uvv.atendix.model.response.UserResponse;
import com.uvv.atendix.repository.UserRepository;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.BusinessException;
import com.uvv.atendix.util.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private static final Sort BY_NAME = Sort.by("name");
    private static final String USER_NOT_FOUND = "Usuário não encontrado: ";
    private static final String LOGIN_TAKEN = "Já existe um usuário com este login";
    private static final String OWN_ROLE_CHANGE = "Não é permitido alterar o próprio perfil";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final String initialPassword;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper,
                       AppProperties appProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.initialPassword = appProperties.users().initialPassword();
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(UUID userId) {
        return userMapper.toResponse(findUser(userId));
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> listUsers(ListUsersRequest request) {
        PageRequest pageRequest = PageRequest.of(request.page(), request.size(), BY_NAME);
        return PageResponse.from(userRepository.findAll(pageRequest).map(userMapper::toResponse));
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        validateLoginAvailable(request.login());

        User user = User.register(request.name(), request.login(), request.role(), initialPasswordHash());
        User savedUser = userRepository.save(user);

        log.info("User {} created with role {}", savedUser.getId(), savedUser.getRole());
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public UserResponse changeRole(UUID userId, ChangeRoleRequest request, AuthenticatedUser admin) {
        validateNotOwnAccount(userId, admin);

        User user = findUser(userId);
        user.assignRole(request.role());
        User savedUser = userRepository.save(user);

        log.info("User {} had the role changed to {} by {}", savedUser.getId(), savedUser.getRole(), admin.id());
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public void resetPassword(UUID userId) {
        User user = findUser(userId);
        user.resetPassword(initialPasswordHash());
        userRepository.save(user);

        log.info("User {} had the password reset to the initial one", userId);
    }

    private void validateLoginAvailable(String login) {
        if (userRepository.existsByLogin(User.normalizeLogin(login))) {
            throw new BusinessConflictException(LOGIN_TAKEN);
        }
    }

    // Keeps an administrator from demoting the account in use and locking everyone out
    private void validateNotOwnAccount(UUID userId, AuthenticatedUser admin) {
        if (userId.equals(admin.id())) {
            throw new BusinessException(OWN_ROLE_CHANGE);
        }
    }

    private String initialPasswordHash() {
        return passwordEncoder.encode(initialPassword);
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND + userId));
    }
}
