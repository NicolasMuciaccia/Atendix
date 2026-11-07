package com.uvv.atendix.controller;

/**
 * Route constants shared by the controllers and the security rules, so both always point
 * to the same paths.
 */
public final class ApiRoutes {

    public static final String API_V1 = "/api/v1";

    public static final String AUTH = API_V1 + "/auth";
    public static final String LOGIN = "/login";
    public static final String REFRESH = "/refresh";
    public static final String LOGOUT = "/logout";
    public static final String PASSWORD = "/password";
    public static final String CSRF = "/csrf";

    public static final String USERS = API_V1 + "/users";
    public static final String CURRENT_USER = "/me";

    public static final String SECTORS = API_V1 + "/sectors";
    public static final String ASSET_TAGS = API_V1 + "/asset-tags";
    public static final String ITEMS = API_V1 + "/items";

    public static final String TICKETS = API_V1 + "/tickets";
    public static final String TICKET_STATUS = "/{ticketId}/status";

    private ApiRoutes() {
    }
}
