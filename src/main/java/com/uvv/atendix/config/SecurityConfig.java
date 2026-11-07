package com.uvv.atendix.config;

import com.uvv.atendix.AppProperties;
import com.uvv.atendix.controller.ApiRoutes;
import com.uvv.atendix.security.AccessTokenAuthenticationConverter;
import com.uvv.atendix.security.ApiAccessDeniedHandler;
import com.uvv.atendix.security.ApiAuthenticationEntryPoint;
import com.uvv.atendix.security.CookieBearerTokenResolver;
import com.uvv.atendix.security.SecurityAuthorities;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
public class SecurityConfig {

    private static final String[] PUBLIC_DOCS = {"/api-docs/**", "/swagger-ui/**", "/swagger-ui.html"};

    private static final String LOGIN = ApiRoutes.AUTH + ApiRoutes.LOGIN;
    private static final String REFRESH = ApiRoutes.AUTH + ApiRoutes.REFRESH;
    private static final String LOGOUT = ApiRoutes.AUTH + ApiRoutes.LOGOUT;
    private static final String PASSWORD = ApiRoutes.AUTH + ApiRoutes.PASSWORD;
    private static final String CSRF = ApiRoutes.AUTH + ApiRoutes.CSRF;
    private static final String CURRENT_USER = ApiRoutes.USERS + ApiRoutes.CURRENT_USER;
    private static final String ALL_USERS = ApiRoutes.USERS + "/**";
    private static final String ALL_TICKETS = ApiRoutes.TICKETS + "/**";
    private static final String TICKET_STATUS = ApiRoutes.TICKETS + "/*/status";
    private static final String[] CATALOG = {
            ApiRoutes.SECTORS + "/**", ApiRoutes.ASSET_TAGS + "/**", ApiRoutes.ITEMS + "/**"};

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtDecoder accessTokenDecoder,
                                                   AccessTokenAuthenticationConverter authenticationConverter,
                                                   ApiAuthenticationEntryPoint authenticationEntryPoint,
                                                   ApiAccessDeniedHandler accessDeniedHandler) {
        http
                .csrf(csrf -> csrf.spa())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable)
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .addFilterBefore(
                        accessTokenFilter(accessTokenDecoder, authenticationConverter, authenticationEntryPoint),
                        BasicAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(sessionEndpoints()).permitAll()
                        .requestMatchers(PUBLIC_DOCS).permitAll()
                        .requestMatchers(HttpMethod.PUT, PASSWORD).authenticated()
                        .requestMatchers(HttpMethod.GET, CURRENT_USER).authenticated()
                        .requestMatchers(ALL_USERS).hasRole(SecurityAuthorities.ADMIN)
                        // Everyone reads the catalog to open tickets; only administrators change it
                        .requestMatchers(HttpMethod.GET, CATALOG).hasRole(SecurityAuthorities.COMMON)
                        .requestMatchers(CATALOG).hasRole(SecurityAuthorities.ADMIN)
                        .requestMatchers(HttpMethod.PATCH, TICKET_STATUS).hasRole(SecurityAuthorities.ADMIN)
                        .requestMatchers(ALL_TICKETS).hasRole(SecurityAuthorities.COMMON)
                        .anyRequest().denyAll());
        return http.build();
    }

    @Bean
    public RoleHierarchy roleHierarchy() {
        // An administrator can do everything a common user can
        return RoleHierarchyImpl.withDefaultRolePrefix()
                .role(SecurityAuthorities.ADMIN).implies(SecurityAuthorities.COMMON)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(AppProperties appProperties) {
        // Spring Security's Argon2PasswordEncoder always produces Argon2id hashes
        AppProperties.Argon2 argon2 = appProperties.security().argon2();
        return new Argon2PasswordEncoder(argon2.saltLength(), argon2.hashLength(), argon2.parallelism(),
                argon2.memoryKib(), argon2.iterations());
    }

    /*
     * Registered by hand instead of through oauth2ResourceServer(): that DSL disables CSRF for every
     * request carrying a bearer token, which here travels in a cookie the browser sends on its own.
     * Built inside the chain, not as a @Bean, so the servlet container does not register it twice.
     */
    private BearerTokenAuthenticationFilter accessTokenFilter(JwtDecoder accessTokenDecoder,
                                                              AccessTokenAuthenticationConverter authenticationConverter,
                                                              ApiAuthenticationEntryPoint authenticationEntryPoint) {
        JwtAuthenticationProvider provider = new JwtAuthenticationProvider(accessTokenDecoder);
        provider.setJwtAuthenticationConverter(authenticationConverter);

        BearerTokenAuthenticationConverter cookieTokenConverter = new BearerTokenAuthenticationConverter();
        cookieTokenConverter.setBearerTokenResolver(new CookieBearerTokenResolver(sessionEndpoints()));

        BearerTokenAuthenticationFilter filter =
                new BearerTokenAuthenticationFilter(new ProviderManager(provider), cookieTokenConverter);
        filter.setAuthenticationEntryPoint(authenticationEntryPoint);
        return filter;
    }

    private RequestMatcher sessionEndpoints() {
        PathPatternRequestMatcher.Builder paths = PathPatternRequestMatcher.withDefaults();
        return new OrRequestMatcher(
                paths.matcher(HttpMethod.GET, CSRF),
                paths.matcher(HttpMethod.POST, LOGIN),
                paths.matcher(HttpMethod.POST, REFRESH),
                paths.matcher(HttpMethod.POST, LOGOUT));
    }
}
