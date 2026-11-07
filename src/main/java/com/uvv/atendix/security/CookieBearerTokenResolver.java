package com.uvv.atendix.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.util.WebUtils;

/**
 * Reads the access token from its HttpOnly cookie instead of the Authorization header.
 */
public class CookieBearerTokenResolver implements BearerTokenResolver {

    private final RequestMatcher ignoredRequests;

    /**
     * @param ignoredRequests requests that must not be authenticated by the cookie, such as login
     *                        and refresh: an expired access token there would turn into a 401
     *                        before the endpoint gets the chance to issue a new one
     */
    public CookieBearerTokenResolver(RequestMatcher ignoredRequests) {
        this.ignoredRequests = ignoredRequests;
    }

    @Override
    public String resolve(HttpServletRequest request) {
        if (ignoredRequests.matches(request)) {
            return null;
        }
        Cookie accessTokenCookie = WebUtils.getCookie(request, AuthCookies.ACCESS_TOKEN);
        if (accessTokenCookie == null || accessTokenCookie.getValue().isBlank()) {
            return null;
        }
        return accessTokenCookie.getValue();
    }
}
