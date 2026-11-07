package com.uvv.atendix.model.dto;

import com.uvv.atendix.model.response.UserResponse;

public record AuthSession(IssuedTokens tokens, UserResponse user) {
}
