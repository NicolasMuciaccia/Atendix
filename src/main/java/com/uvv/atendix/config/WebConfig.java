package com.uvv.atendix.config;

import com.uvv.atendix.security.AuthenticatedUserArgumentResolver;
import com.uvv.atendix.security.SessionSlotArgumentResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AuthenticatedUserArgumentResolver authenticatedUserArgumentResolver;
    private final SessionSlotArgumentResolver sessionSlotArgumentResolver;

    public WebConfig(AuthenticatedUserArgumentResolver authenticatedUserArgumentResolver,
                     SessionSlotArgumentResolver sessionSlotArgumentResolver) {
        this.authenticatedUserArgumentResolver = authenticatedUserArgumentResolver;
        this.sessionSlotArgumentResolver = sessionSlotArgumentResolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authenticatedUserArgumentResolver);
        resolvers.add(sessionSlotArgumentResolver);
    }
}
