package com.uvv.atendix.security;

import com.uvv.atendix.AppProperties;
import com.uvv.atendix.model.dto.IssuedToken;
import com.uvv.atendix.model.dto.IssuedTokens;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.time.Clock;
import java.time.Duration;

@Component
public class AuthCookies {

    public static final String ACCESS_TOKEN = "atendix_access_token";
    public static final String REFRESH_TOKEN = "atendix_refresh_token";

    private static final String ACCESS_TOKEN_PATH = "/api";
    // Only the auth endpoints (refresh, logout, password change) ever receive the refresh token
    private static final String REFRESH_TOKEN_PATH = "/api/v1/auth";
    private static final String CLEARED_VALUE = "";

    private final Clock clock;
    private final boolean secure;
    private final String sameSite;

    public AuthCookies(Clock clock, AppProperties appProperties) {
        this.clock = clock;
        AppProperties.Cookie cookieProperties = appProperties.security().cookie();
        this.secure = cookieProperties.secure();
        this.sameSite = cookieProperties.sameSite();
    }

    public HttpHeaders sessionCookies(SessionSlot slot, IssuedTokens tokens) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE,
                tokenCookie(slot.cookieName(ACCESS_TOKEN), ACCESS_TOKEN_PATH, tokens.accessToken()));
        headers.add(HttpHeaders.SET_COOKIE,
                tokenCookie(slot.cookieName(REFRESH_TOKEN), REFRESH_TOKEN_PATH, tokens.refreshToken()));
        return headers;
    }

    public HttpHeaders clearedCookies(SessionSlot slot) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE,
                cookie(slot.cookieName(ACCESS_TOKEN), ACCESS_TOKEN_PATH, CLEARED_VALUE, Duration.ZERO));
        headers.add(HttpHeaders.SET_COOKIE,
                cookie(slot.cookieName(REFRESH_TOKEN), REFRESH_TOKEN_PATH, CLEARED_VALUE, Duration.ZERO));
        return headers;
    }

    /** @return the access token of the slot, or null when the browser sent none */
    public static String accessToken(HttpServletRequest request, SessionSlot slot) {
        return read(request, slot.cookieName(ACCESS_TOKEN));
    }

    /** @return the refresh token of the slot, or null when the browser sent none */
    public static String refreshToken(HttpServletRequest request, SessionSlot slot) {
        return read(request, slot.cookieName(REFRESH_TOKEN));
    }

    private static String read(HttpServletRequest request, String cookieName) {
        Cookie cookie = WebUtils.getCookie(request, cookieName);
        if (cookie == null || cookie.getValue().isBlank()) {
            return null;
        }
        return cookie.getValue();
    }

    private String tokenCookie(String name, String path, IssuedToken token) {
        Duration maxAge = Duration.between(clock.instant(), token.expiresAt());
        return cookie(name, path, token.value(), maxAge);
    }

    private String cookie(String name, String path, String value, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path(path)
                .maxAge(maxAge)
                .build()
                .toString();
    }
}
