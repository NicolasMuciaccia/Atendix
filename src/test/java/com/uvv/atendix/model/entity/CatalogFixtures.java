package com.uvv.atendix.model.entity;

import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

public final class CatalogFixtures {

    public static final String SECTOR_NAME = "Financeiro";
    public static final String TAG_CODE = "PAT-004512";
    public static final String ITEM_NAME = "Impressora HP LaserJet";

    private CatalogFixtures() {
    }

    public static Sector sector() {
        return withId(Sector.create(SECTOR_NAME));
    }

    public static AssetTag assetTag() {
        return withId(AssetTag.create(TAG_CODE));
    }

    public static Item item() {
        return withId(Item.register(ITEM_NAME, sector(), assetTag()));
    }

    // Simulates the id the Hibernate generator assigns on persist
    private static <T extends BaseEntity> T withId(T entity) {
        ReflectionTestUtils.setField(entity, "id", UUID.randomUUID());
        return entity;
    }
}
