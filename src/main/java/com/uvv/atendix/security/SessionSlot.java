package com.uvv.atendix.security;

import com.uvv.atendix.util.exception.BusinessException;

/**
 * Which of the accounts signed in on the same browser a request belongs to.
 * Each browser tab sends its slot in a header, and every slot keeps its own pair of session cookies,
 * so different accounts can stay signed in side by side.
 */
public record SessionSlot(int index) {

    public static final String HEADER = "X-Atendix-Session";
    public static final int MAX_SLOTS = 5;
    public static final SessionSlot DEFAULT = new SessionSlot(0);

    private static final String INVALID_SLOT = "Sessão do navegador inválida: use um número de 0 a " + (MAX_SLOTS - 1);
    private static final String COOKIE_SUFFIX_SEPARATOR = "_";

    public SessionSlot {
        if (index < 0 || index >= MAX_SLOTS) {
            throw new BusinessException(INVALID_SLOT);
        }
    }

    /** A request without the header, such as from curl or Swagger, uses the default slot. */
    public static SessionSlot fromHeader(String headerValue) {
        if (headerValue == null || headerValue.isBlank()) {
            return DEFAULT;
        }
        try {
            return new SessionSlot(Integer.parseInt(headerValue.trim()));
        } catch (NumberFormatException exception) {
            throw new BusinessException(INVALID_SLOT, exception);
        }
    }

    /** The default slot keeps the original cookie names, so existing clients keep working. */
    String cookieName(String baseName) {
        return equals(DEFAULT) ? baseName : baseName + COOKIE_SUFFIX_SEPARATOR + index;
    }
}
