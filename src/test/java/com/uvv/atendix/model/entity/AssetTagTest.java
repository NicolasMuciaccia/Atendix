package com.uvv.atendix.model.entity;

import com.uvv.atendix.util.exception.BusinessException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AssetTagTest {

    @Test
    void shouldStoreCodeInUpperCaseWithoutSpaces() {
        AssetTag assetTag = AssetTag.create("  pat-004512 ");

        assertThat(assetTag.getCode()).isEqualTo("PAT-004512");
    }

    @Test
    void shouldRejectBlankCode() {
        assertThatThrownBy(() -> AssetTag.create("   "))
                .isInstanceOf(BusinessException.class);
    }
}
