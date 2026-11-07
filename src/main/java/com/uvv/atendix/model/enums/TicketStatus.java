package com.uvv.atendix.model.enums;

import java.util.Set;

public enum TicketStatus {

    OPEN,
    IN_PROGRESS,
    FINISHED;

    public boolean canTransitionTo(TicketStatus target) {
        return allowedTargets().contains(target);
    }

    private Set<TicketStatus> allowedTargets() {
        return switch (this) {
            case OPEN -> Set.of(IN_PROGRESS, FINISHED);
            case IN_PROGRESS -> Set.of(FINISHED);
            case FINISHED -> Set.of();
        };
    }
}
