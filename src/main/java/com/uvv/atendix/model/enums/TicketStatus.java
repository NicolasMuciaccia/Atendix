package com.uvv.atendix.model.enums;

import java.util.Set;

public enum TicketStatus {

    OPEN,
    IN_PROGRESS,
    FINISHED;

    public boolean canTransitionTo(TicketStatus target) {
        return allowedTargets().contains(target);
    }

    // Handling always starts before it finishes: a ticket cannot jump from open to finished
    private Set<TicketStatus> allowedTargets() {
        return switch (this) {
            case OPEN -> Set.of(IN_PROGRESS);
            case IN_PROGRESS -> Set.of(FINISHED);
            case FINISHED -> Set.of();
        };
    }
}
