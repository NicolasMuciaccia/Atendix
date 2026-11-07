package com.uvv.atendix.model.entity;

import com.uvv.atendix.util.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.Locale;

/** Asset tag stuck on a piece of equipment (patrimônio). Stored in upper case, so "pat-1" and "PAT-1" are the same tag. */
@Entity
@Table(name = "asset_tags")
public class AssetTag extends BaseEntity {

    @Column(name = "code", length = ColumnLengths.ASSET_TAG, nullable = false)
    private String code;

    protected AssetTag() {
        // required by JPA; callers use the create(...) factory
    }

    public static AssetTag create(String code) {
        AssetTag assetTag = new AssetTag();
        assetTag.code = normalizeCode(code);
        return assetTag;
    }

    public static String normalizeCode(String code) {
        if (code == null || code.isBlank()) {
            throw new BusinessException("O código da etiqueta é obrigatório");
        }
        return code.trim().toUpperCase(Locale.ROOT);
    }

    public void changeCode(String newCode) {
        code = normalizeCode(newCode);
    }

    public String getCode() {
        return code;
    }
}
