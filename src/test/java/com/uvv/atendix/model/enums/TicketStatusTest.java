package com.uvv.atendix.model.enums;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class TicketStatusTest {

    @ParameterizedTest(name = "{0} -> {1} allowed: {2}")
    @CsvSource({
            "OPEN, OPEN, false",
            "OPEN, IN_PROGRESS, true",
            "OPEN, FINISHED, true",
            "IN_PROGRESS, OPEN, false",
            "IN_PROGRESS, IN_PROGRESS, false",
            "IN_PROGRESS, FINISHED, true",
            "FINISHED, OPEN, false",
            "FINISHED, IN_PROGRESS, false",
            "FINISHED, FINISHED, false"
    })
    void shouldOnlyMoveForward(TicketStatus current, TicketStatus target, boolean allowed) {
        assertThat(current.canTransitionTo(target)).isEqualTo(allowed);
    }
}
