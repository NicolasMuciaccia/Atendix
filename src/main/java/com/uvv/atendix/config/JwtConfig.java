package com.uvv.atendix.config;

import com.uvv.atendix.AppProperties;
import com.uvv.atendix.model.enums.TokenType;
import com.uvv.atendix.security.NotRevokedTokenValidator;
import com.uvv.atendix.security.RefreshTokenDecoder;
import com.uvv.atendix.security.TokenDenylist;
import com.uvv.atendix.security.TokenTypeValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class JwtConfig {

    private static final String HMAC_SHA256 = "HmacSHA256";

    @Bean
    public JwtEncoder jwtEncoder(AppProperties appProperties) {
        return NimbusJwtEncoder.withSecretKey(signingKey(appProperties))
                .algorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public JwtDecoder accessTokenDecoder(AppProperties appProperties, TokenDenylist tokenDenylist) {
        return decoderFor(TokenType.ACCESS, appProperties, tokenDenylist);
    }

    @Bean
    public RefreshTokenDecoder refreshTokenDecoder(AppProperties appProperties, TokenDenylist tokenDenylist) {
        return new RefreshTokenDecoder(decoderFor(TokenType.REFRESH, appProperties, tokenDenylist));
    }

    private JwtDecoder decoderFor(TokenType tokenType, AppProperties appProperties, TokenDenylist tokenDenylist) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(signingKey(appProperties))
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(appProperties.security().jwt().issuer()),
                new TokenTypeValidator(tokenType),
                new NotRevokedTokenValidator(tokenDenylist)));
        return decoder;
    }

    private SecretKey signingKey(AppProperties appProperties) {
        byte[] secret = appProperties.security().jwt().secret().getBytes(StandardCharsets.UTF_8);
        return new SecretKeySpec(secret, HMAC_SHA256);
    }
}
