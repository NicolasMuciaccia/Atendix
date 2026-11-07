package com.uvv.atendix.security;

import com.uvv.atendix.AppProperties;
import com.uvv.atendix.model.dto.IssuedToken;
import com.uvv.atendix.model.dto.IssuedTokens;
import com.uvv.atendix.model.entity.User;
import com.uvv.atendix.model.enums.TokenType;
import com.uvv.atendix.util.exception.AuthenticationFailedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

@Component
public class TokenService {

    private static final Logger log = LoggerFactory.getLogger(TokenService.class);

    private static final String JWT_TYPE_HEADER = "JWT";
    private static final String INVALID_SESSION = "Sessão inválida ou expirada. Faça login novamente.";

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder accessTokenDecoder;
    private final RefreshTokenDecoder refreshTokenDecoder;
    private final TokenDenylist tokenDenylist;
    private final Clock clock;
    private final String issuer;
    private final Duration accessTokenTtl;
    private final Duration refreshTokenTtl;

    public TokenService(JwtEncoder jwtEncoder, JwtDecoder accessTokenDecoder,
                        RefreshTokenDecoder refreshTokenDecoder, TokenDenylist tokenDenylist,
                        Clock clock, AppProperties appProperties) {
        this.jwtEncoder = jwtEncoder;
        this.accessTokenDecoder = accessTokenDecoder;
        this.refreshTokenDecoder = refreshTokenDecoder;
        this.tokenDenylist = tokenDenylist;
        this.clock = clock;
        AppProperties.Jwt jwtProperties = appProperties.security().jwt();
        this.issuer = jwtProperties.issuer();
        this.accessTokenTtl = jwtProperties.accessTokenTtl();
        this.refreshTokenTtl = jwtProperties.refreshTokenTtl();
    }

    public IssuedTokens issueFor(User user) {
        Instant now = clock.instant();

        JwtClaimsSet accessClaims = baseClaims(user, now, accessTokenTtl, TokenType.ACCESS)
                .claim(TokenClaims.ROLE, user.getRole().name())
                .claim(TokenClaims.PASSWORD_CHANGE_REQUIRED, user.isMustChangePassword())
                .build();
        JwtClaimsSet refreshClaims = baseClaims(user, now, refreshTokenTtl, TokenType.REFRESH).build();

        return new IssuedTokens(encode(accessClaims), encode(refreshClaims));
    }

    /**
     * Validates the refresh token and revokes it, so each one can be exchanged only once.
     *
     * @return the id of the user the token belongs to
     */
    public UUID consumeRefreshToken(String refreshToken) {
        Jwt refreshJwt = decodeRefreshToken(refreshToken);
        revoke(refreshJwt);
        return UUID.fromString(refreshJwt.getSubject());
    }

    public void revoke(String tokenId, Instant expiresAt) {
        tokenDenylist.revoke(tokenId, expiresAt);
    }

    public void revokeAccessTokenIfActive(String accessToken) {
        decodeIfActive(accessTokenDecoder::decode, accessToken).ifPresent(this::revoke);
    }

    public void revokeRefreshTokenIfActive(String refreshToken) {
        decodeIfActive(refreshTokenDecoder::decode, refreshToken).ifPresent(this::revoke);
    }

    private Jwt decodeRefreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthenticationFailedException(INVALID_SESSION);
        }

        try {
            return refreshTokenDecoder.decode(refreshToken);
        } catch (JwtException e) {
            throw new AuthenticationFailedException(INVALID_SESSION, e);
        }
    }

    private void revoke(Jwt token) {
        tokenDenylist.revoke(token.getId(), token.getExpiresAt());
    }

    private JwtClaimsSet.Builder baseClaims(User user, Instant issuedAt, Duration ttl, TokenType type) {
        return JwtClaimsSet.builder()
                .id(UUID.randomUUID().toString())
                .issuer(issuer)
                .subject(user.getId().toString())
                .issuedAt(issuedAt)
                .expiresAt(issuedAt.plus(ttl))
                .claim(TokenClaims.TOKEN_TYPE, type.name());
    }

    private IssuedToken encode(JwtClaimsSet claims) {
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).type(JWT_TYPE_HEADER).build();
        Jwt jwt = jwtEncoder.encode(JwtEncoderParameters.from(header, claims));
        return new IssuedToken(jwt.getTokenValue(), jwt.getId(), jwt.getExpiresAt());
    }

    private Optional<Jwt> decodeIfActive(Function<String, Jwt> decoder, String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        try {
            return Optional.of(decoder.apply(token));
        } catch (JwtException e) {
            // An expired, revoked or forged token grants no access, so there is nothing left to revoke
            log.debug("Skipping revocation of inactive token: {}", e.getClass().getSimpleName());
            return Optional.empty();
        }
    }
}
