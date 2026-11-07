package com.uvv.atendix.model.dto;

import java.time.Instant;
import java.util.UUID;

/** Asset tag with the item it identifies, if any; read in a single query. */
public record AssetTagView(UUID id, String code, UUID itemId, String itemName, Instant createdAt) {
}
