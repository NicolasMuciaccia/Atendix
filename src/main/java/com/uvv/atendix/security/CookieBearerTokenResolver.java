package com.uvv.atendix.security;

import com.uvv.atendix.util.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.util.matcher.RequestMatcher;

/**
 * Reads the access token from the HttpOnly cookie of the request's session slot instead of the
 * Authorization header.
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
        try {
            SessionSlot slot = SessionSlot.fromHeader(request.getHeader(SessionSlot.HEADER));
            return AuthCookies.accessToken(request, slot);
        } catch (BusinessException exception) {
            throw new InvalidBearerTokenException(exception.getMessage(), exception);
        }
    }
}
