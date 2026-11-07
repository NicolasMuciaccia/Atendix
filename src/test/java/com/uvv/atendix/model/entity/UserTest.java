package com.uvv.atendix.model.entity;

import com.uvv.atendix.model.enums.Role;
import com.uvv.atendix.util.exception.BusinessException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserTest {

    private static final String NEW_HASH = "$argon2id$v=19$m=1024,t=1,p=1$new$hash";

    @Test
    void shouldRequirePasswordChangeWhenRegistered() {
        User user = User.register("Maria Souza", "maria.souza", Role.COMMON, UserFixtures.PASSWORD_HASH);

        assertThat(user.isMustChangePassword()).isTrue();
    }

    @Test
    void shouldStoreLoginInLowerCaseWithoutSpaces() {
        User user = User.register("Maria Souza", "  Maria.Souza ", Role.COMMON, UserFixtures.PASSWORD_HASH);

        assertThat(user.getLogin()).isEqualTo("maria.souza");
    }

    @Test
    void shouldRejectUserWithoutRole() {
        assertThatThrownBy(() -> User.register("Maria Souza", "maria.souza", null, UserFixtures.PASSWORD_HASH))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void shouldReleaseUserAfterPasswordChange() {
        User user = UserFixtures.common();

        user.changePassword(NEW_HASH);

        assertThat(user.isMustChangePassword()).isFalse();
        assertThat(user.getPasswordHash()).isEqualTo(NEW_HASH);
    }

    @Test
    void shouldRequirePasswordChangeAgainAfterReset() {
        User user = UserFixtures.common();
        user.changePassword(NEW_HASH);

        user.resetPassword(UserFixtures.PASSWORD_HASH);

        assertThat(user.isMustChangePassword()).isTrue();
    }

    @Test
    void shouldPromoteCommonUserToAdmin() {
        User user = UserFixtures.common();

        user.assignRole(Role.ADMIN);

        assertThat(user.isAdmin()).isTrue();
    }
}
