package com.uvv.atendix.service;

import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.response.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getLogin(),
                user.getRole(),
                user.isMustChangePassword(),
                user.isActive(),
                user.getCreatedAt());
    }
}
