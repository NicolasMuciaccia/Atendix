package com.uvv.atendix.config;

import com.uvv.atendix.model.dto.AuthenticatedUser;
import com.uvv.atendix.security.AuthCookies;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String COOKIE_AUTH = "cookieAuth";

    static {
        // Resolved from the access token, never sent by the client
        SpringDocUtils.getConfig().addRequestWrapperToIgnore(AuthenticatedUser.class);
    }

    @Bean
    public OpenAPI atendixOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Atendix API")
                        .version("v1")
                        .description("Help desk para abertura e acompanhamento de chamados. "
                                + "A autenticação usa cookies HttpOnly emitidos no login; "
                                + "requisições que alteram dados exigem o header X-XSRF-TOKEN."))
                .components(new Components().addSecuritySchemes(COOKIE_AUTH, new SecurityScheme()
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.COOKIE)
                        .name(AuthCookies.ACCESS_TOKEN)))
                .addSecurityItem(new SecurityRequirement().addList(COOKIE_AUTH));
    }
}
