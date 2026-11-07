package com.uvv.atendix;

import com.jayway.jsonpath.JsonPath;
import com.uvv.atendix.security.AuthCookies;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "app.security.jwt.secret=integration-test-secret-with-at-least-32-chars")
@AutoConfigureMockMvc
@Testcontainers
class AtendixApiIntegrationTest {

    private static final String INITIAL_PASSWORD = "mudar@123";
    private static final String NEW_PASSWORD = "Atendix#2026";
    private static final String ADMIN_LOGIN = "admin";
    private static final String XSRF_COOKIE = "XSRF-TOKEN";
    private static final String XSRF_HEADER = "X-XSRF-TOKEN";

    private static final String CSRF = "/api/v1/auth/csrf";
    private static final String LOGIN = "/api/v1/auth/login";
    private static final String REFRESH = "/api/v1/auth/refresh";
    private static final String LOGOUT = "/api/v1/auth/logout";
    private static final String PASSWORD = "/api/v1/auth/password";
    private static final String CURRENT_USER = "/api/v1/users/me";
    private static final String USERS = "/api/v1/users";
    private static final String TICKETS = "/api/v1/tickets";
    private static final String SECTORS = "/api/v1/sectors";
    private static final String ASSET_TAGS = "/api/v1/asset-tags";
    private static final String ITEMS = "/api/v1/items";

    @Container
    @ServiceConnection
    static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:17-alpine");

    // The seeded admin changes its initial password once and the session is reused by every test
    private static Session adminSession;
    private static Cookie xsrfCookie;
    // Item registered once by the admin and used by the tickets of most tests
    private static CatalogEntry defaultItem;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void ensureSessions() throws Exception {
        if (xsrfCookie == null) {
            xsrfCookie = mockMvc.perform(get(CSRF)).andReturn().getResponse().getCookie(XSRF_COOKIE);
        }
        if (adminSession == null) {
            adminSession = changePassword(login(ADMIN_LOGIN, INITIAL_PASSWORD), INITIAL_PASSWORD);
        }
        if (defaultItem == null) {
            defaultItem = registerItem();
        }
    }

    @Test
    void shouldFillSectorAndTagFromTheSelectedItem() throws Exception {
        Session requester = commonUserSession();
        CatalogEntry entry = registerItem();

        mockMvc.perform(post(TICKETS).with(xsrf()).cookie(requester.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ticketBody("2026-11-06", entry.itemId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sector").value(entry.sectorName()))
                .andExpect(jsonPath("$.assetTag").value(entry.tagCode()))
                .andExpect(jsonPath("$.itemId").value(entry.itemId()));
    }

    @Test
    void shouldLetCommonUsersReadButNotChangeTheCatalog() throws Exception {
        Session requester = commonUserSession();

        mockMvc.perform(get(ITEMS).cookie(requester.cookies()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id", hasItem(defaultItem.itemId())));
        mockMvc.perform(post(SECTORS).with(xsrf()).cookie(requester.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(nameBody("Setor proibido")))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldNotGiveOneTagToTwoItems() throws Exception {
        String sectorId = createAndRead(SECTORS, nameBody("Patrimônio " + uniqueSuffix()), "$.id");

        mockMvc.perform(post(ITEMS).with(xsrf()).cookie(adminSession.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemBody("Outro equipamento", sectorId, defaultItem.tagId())))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldKeepSectorAndItemThatAreInUse() throws Exception {
        openTicket(commonUserSession(), "2026-11-01", defaultItem.itemId());

        mockMvc.perform(delete(SECTORS + "/" + defaultItem.sectorId()).with(xsrf()).cookie(adminSession.cookies()))
                .andExpect(status().isConflict());
        mockMvc.perform(delete(ITEMS + "/" + defaultItem.itemId()).with(xsrf()).cookie(adminSession.cookies()))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldStoreTagCodesInUpperCase() throws Exception {
        String code = "pat-" + uniqueSuffix();

        mockMvc.perform(post(ASSET_TAGS).with(xsrf()).cookie(adminSession.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(codeBody(code)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(code.toUpperCase()));
    }

    @Test
    void shouldRequirePasswordChangeBeforeUsingTheSystem() throws Exception {
        String login = createUser("COMMON");
        Session firstAccess = login(login, INITIAL_PASSWORD);

        mockMvc.perform(get(TICKETS).cookie(firstAccess.cookies()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Troque a senha inicial antes de continuar."));
        mockMvc.perform(get(CURRENT_USER).cookie(firstAccess.cookies()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mustChangePassword").value(true));

        Session released = changePassword(firstAccess, INITIAL_PASSWORD);

        mockMvc.perform(get(TICKETS).cookie(released.cookies()))
                .andExpect(status().isOk());
        mockMvc.perform(get(CURRENT_USER).cookie(firstAccess.cookies()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldNotAcceptInitialPasswordAsTheNewOne() throws Exception {
        Session firstAccess = login(createUser("COMMON"), INITIAL_PASSWORD);

        mockMvc.perform(put(PASSWORD).with(xsrf()).cookie(firstAccess.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(passwordBody(INITIAL_PASSWORD, INITIAL_PASSWORD)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldStoreOnlyArgon2idHashes() throws Exception {
        String login = createUser("COMMON");

        mockMvc.perform(post(LOGIN).with(xsrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody(login, INITIAL_PASSWORD)))
                .andExpect(status().isOk());

        assertThat(postgresPasswordHashOf(login)).startsWith("$argon2id$");
    }

    @Test
    void shouldRejectBothTokensAfterLogout() throws Exception {
        Session session = commonUserSession();

        mockMvc.perform(post(LOGOUT).with(xsrf()).cookie(session.cookies()))
                .andExpect(status().isNoContent())
                .andExpect(cookie().maxAge(AuthCookies.ACCESS_TOKEN, 0));

        mockMvc.perform(get(CURRENT_USER).cookie(session.cookies()))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post(REFRESH).with(xsrf()).cookie(session.refreshToken()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAcceptEachRefreshTokenOnlyOnce() throws Exception {
        Session session = commonUserSession();

        MvcResult refreshed = mockMvc.perform(post(REFRESH).with(xsrf()).cookie(session.refreshToken()))
                .andExpect(status().isOk())
                .andReturn();

        mockMvc.perform(get(CURRENT_USER).cookie(sessionFrom(refreshed.getResponse()).cookies()))
                .andExpect(status().isOk());
        mockMvc.perform(post(REFRESH).with(xsrf()).cookie(session.refreshToken()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectLoginWithoutCsrfToken() throws Exception {
        mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody(ADMIN_LOGIN, NEW_PASSWORD)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldRejectAuthenticatedChangeWithoutCsrfToken() throws Exception {
        Session session = commonUserSession();

        mockMvc.perform(post(TICKETS).cookie(session.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ticketBody("2026-11-01", defaultItem.itemId())))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldIssueCsrfCookieForTheFrontEnd() throws Exception {
        mockMvc.perform(get(CSRF))
                .andExpect(status().isNoContent())
                .andExpect(cookie().exists(XSRF_COOKIE))
                .andExpect(cookie().httpOnly(XSRF_COOKIE, false));
    }

    @Test
    void shouldRejectWrongPassword() throws Exception {
        mockMvc.perform(post(LOGIN).with(xsrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody(ADMIN_LOGIN, "senha-errada")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Login ou senha inválidos"));
    }

    @Test
    void shouldKeepTicketsPrivateBetweenCommonUsers() throws Exception {
        Session owner = commonUserSession();
        Session stranger = commonUserSession();
        String ticketId = openTicket(owner, "2026-11-02", defaultItem.itemId());

        mockMvc.perform(get(TICKETS + "/" + ticketId).cookie(stranger.cookies()))
                .andExpect(status().isNotFound());
        mockMvc.perform(get(TICKETS).cookie(stranger.cookies()))
                .andExpect(jsonPath("$.content[*].id", not(hasItem(ticketId))));
        mockMvc.perform(get(TICKETS).cookie(owner.cookies()))
                .andExpect(jsonPath("$.content[*].id", hasItem(ticketId)));
    }

    @Test
    void shouldLetOnlyAdminSearchTicketsBySector() throws Exception {
        Session requester = commonUserSession();
        CatalogEntry entry = registerItem();
        String ticketId = openTicket(requester, "2026-11-03", entry.itemId());
        String otherSectorTicket = openTicket(requester, "2026-11-03", defaultItem.itemId());

        mockMvc.perform(get(TICKETS).param("sectorId", entry.sectorId()).cookie(requester.cookies()))
                .andExpect(status().isForbidden());
        mockMvc.perform(get(TICKETS).param("sectorId", entry.sectorId()).cookie(adminSession.cookies()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*].id", hasItem(ticketId)))
                .andExpect(jsonPath("$.content[*].id", not(hasItem(otherSectorTicket))));
        mockMvc.perform(get(TICKETS).param("date", "2026-11-03").cookie(adminSession.cookies()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*].id", hasItem(ticketId)));
    }

    @Test
    void shouldListTicketsFromTheMostRecentDate() throws Exception {
        Session requester = commonUserSession();
        String oldest = openTicket(requester, "2026-10-01", defaultItem.itemId());
        String newest = openTicket(requester, "2026-11-05", defaultItem.itemId());
        String middle = openTicket(requester, "2026-10-20", defaultItem.itemId());

        MvcResult result = mockMvc.perform(get(TICKETS).cookie(requester.cookies()))
                .andExpect(status().isOk())
                .andReturn();

        List<String> ids = JsonPath.read(result.getResponse().getContentAsString(), "$.content[*].id");
        assertThat(ids).containsExactly(newest, middle, oldest);
    }

    @Test
    void shouldLetOnlyAdminChangeTicketStatus() throws Exception {
        Session requester = commonUserSession();
        String ticketId = openTicket(requester, "2026-11-04", defaultItem.itemId());

        mockMvc.perform(patch(TICKETS + "/" + ticketId + "/status").with(xsrf()).cookie(requester.cookies())
                        .contentType(MediaType.APPLICATION_JSON).content(statusBody("IN_PROGRESS")))
                .andExpect(status().isForbidden());
        mockMvc.perform(patch(TICKETS + "/" + ticketId + "/status").with(xsrf()).cookie(adminSession.cookies())
                        .contentType(MediaType.APPLICATION_JSON).content(statusBody("IN_PROGRESS")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
        mockMvc.perform(delete(TICKETS + "/" + ticketId).with(xsrf()).cookie(requester.cookies()))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldDeleteTicketWhenCancelledBeforeHandling() throws Exception {
        Session requester = commonUserSession();
        String ticketId = openTicket(requester, "2026-11-04", defaultItem.itemId());

        mockMvc.perform(delete(TICKETS + "/" + ticketId).with(xsrf()).cookie(requester.cookies()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get(TICKETS + "/" + ticketId).cookie(adminSession.cookies()))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldForbidCommonUserFromManagingUsers() throws Exception {
        Session requester = commonUserSession();

        mockMvc.perform(post(USERS).with(xsrf()).cookie(requester.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userBody("intruso", "ADMIN")))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldRejectFutureTicketDate() throws Exception {
        Session requester = commonUserSession();

        mockMvc.perform(post(TICKETS).with(xsrf()).cookie(requester.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ticketBody("2999-01-01", defaultItem.itemId())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.requestDate").exists());
    }

    private Session commonUserSession() throws Exception {
        return changePassword(login(createUser("COMMON"), INITIAL_PASSWORD), INITIAL_PASSWORD);
    }

    private String createUser(String role) throws Exception {
        String login = "user-" + UUID.randomUUID().toString().substring(0, 8);
        mockMvc.perform(post(USERS).with(xsrf()).cookie(adminSession.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userBody(login, role)))
                .andExpect(status().isCreated());
        return login;
    }

    private Session login(String login, String password) throws Exception {
        MvcResult result = mockMvc.perform(post(LOGIN).with(xsrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody(login, password)))
                .andExpect(status().isOk())
                .andReturn();
        return sessionFrom(result.getResponse());
    }

    private Session changePassword(Session session, String currentPassword) throws Exception {
        MvcResult result = mockMvc.perform(put(PASSWORD).with(xsrf()).cookie(session.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(passwordBody(currentPassword, NEW_PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mustChangePassword").value(false))
                .andReturn();
        return sessionFrom(result.getResponse());
    }

    private CatalogEntry registerItem() throws Exception {
        String suffix = uniqueSuffix();
        String sectorName = "Setor " + suffix;
        String tagCode = "PAT-" + suffix.toUpperCase();
        String sectorId = createAndRead(SECTORS, nameBody(sectorName), "$.id");
        String tagId = createAndRead(ASSET_TAGS, codeBody(tagCode), "$.id");
        String itemId = createAndRead(ITEMS, itemBody("Impressora " + suffix, sectorId, tagId), "$.id");
        return new CatalogEntry(sectorId, sectorName, tagId, tagCode, itemId);
    }

    private String createAndRead(String path, String body, String field) throws Exception {
        MvcResult result = mockMvc.perform(post(path).with(xsrf()).cookie(adminSession.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), field);
    }

    private String uniqueSuffix() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private String openTicket(Session session, String requestDate, String itemId) throws Exception {
        MvcResult result = mockMvc.perform(post(TICKETS).with(xsrf()).cookie(session.cookies())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ticketBody(requestDate, itemId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), "$.id");
    }

    private String postgresPasswordHashOf(String login) throws Exception {
        try (Connection connection = DriverManager.getConnection(
                postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
             PreparedStatement statement = connection.prepareStatement("select password_hash from users where login = ?")) {
            statement.setString(1, login);
            try (ResultSet resultSet = statement.executeQuery()) {
                resultSet.next();
                return resultSet.getString(1);
            }
        }
    }

    // Does what the front-end does: sends the XSRF-TOKEN cookie back and repeats its value in the header
    private RequestPostProcessor xsrf() {
        return request -> {
            Cookie[] currentCookies = request.getCookies() == null ? new Cookie[0] : request.getCookies();
            Cookie[] cookiesWithXsrf = Arrays.copyOf(currentCookies, currentCookies.length + 1);
            cookiesWithXsrf[currentCookies.length] = xsrfCookie;
            request.setCookies(cookiesWithXsrf);
            request.addHeader(XSRF_HEADER, xsrfCookie.getValue());
            return request;
        };
    }

    private Session sessionFrom(MockHttpServletResponse response) {
        return new Session(response.getCookie(AuthCookies.ACCESS_TOKEN), response.getCookie(AuthCookies.REFRESH_TOKEN));
    }

    private String loginBody(String login, String password) {
        return """
                {"login": "%s", "password": "%s"}
                """.formatted(login, password);
    }

    private String passwordBody(String currentPassword, String newPassword) {
        return """
                {"currentPassword": "%s", "newPassword": "%s"}
                """.formatted(currentPassword, newPassword);
    }

    private String userBody(String login, String role) {
        return """
                {"name": "Usuário de Teste", "login": "%s", "role": "%s"}
                """.formatted(login, role);
    }

    private String ticketBody(String requestDate, String itemId) {
        return """
                {"requestDate": "%s", "itemId": "%s", "problemDescription": "A impressora não puxa o papel."}
                """.formatted(requestDate, itemId);
    }

    private String nameBody(String name) {
        return """
                {"name": "%s"}
                """.formatted(name);
    }

    private String codeBody(String code) {
        return """
                {"code": "%s"}
                """.formatted(code);
    }

    private String itemBody(String name, String sectorId, String assetTagId) {
        return """
                {"name": "%s", "sectorId": "%s", "assetTagId": "%s"}
                """.formatted(name, sectorId, assetTagId);
    }

    private String statusBody(String status) {
        return """
                {"status": "%s"}
                """.formatted(status);
    }

    private record CatalogEntry(String sectorId, String sectorName, String tagId, String tagCode, String itemId) {
    }

    private record Session(Cookie accessToken, Cookie refreshToken) {

        Cookie[] cookies() {
            return new Cookie[]{accessToken, refreshToken};
        }
    }
}
