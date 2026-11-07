package com.uvv.atendix.model.enums;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RoleTest {

    @Test
    void shouldUseZeroForCommonAndOneForAdmin() {
        assertThat(Role.COMMON.code()).isZero();
        assertThat(Role.ADMIN.code()).isEqualTo(1);
    }

    @Test
    void shouldResolveRoleFromStoredCode() {
        assertThat(Role.fromCode(1)).isEqualTo(Role.ADMIN);
    }

    @Test
    void shouldFailOnUnknownStoredCode() {
        assertThatThrownBy(() -> Role.fromCode(7))
                .isInstanceOf(IllegalStateException.class);
    }
}
