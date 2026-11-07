package com.uvv.atendix.service;

import com.uvv.atendix.model.dto.AssetTagView;
import com.uvv.atendix.model.entity.AssetTag;
import com.uvv.atendix.model.entity.Item;
import com.uvv.atendix.model.entity.Sector;
import com.uvv.atendix.model.response.AssetTagResponse;
import com.uvv.atendix.model.response.ItemResponse;
import com.uvv.atendix.model.response.SectorResponse;
import org.springframework.stereotype.Component;

/** Entity to response conversion for the registered data (sectors, asset tags and items). */
@Component
public class CatalogMapper {

    public SectorResponse toResponse(Sector sector) {
        return new SectorResponse(sector.getId(), sector.getName(), sector.getCreatedAt());
    }

    public AssetTagResponse toResponse(AssetTagView view) {
        return new AssetTagResponse(view.id(), view.code(), view.itemId(), view.itemName(), view.createdAt());
    }

    /** A tag that was just created or edited; its item, if any, is not looked up. */
    public AssetTagResponse toResponse(AssetTag assetTag, Item item) {
        return new AssetTagResponse(assetTag.getId(), assetTag.getCode(),
                item == null ? null : item.getId(), item == null ? null : item.getName(), assetTag.getCreatedAt());
    }

    public ItemResponse toResponse(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getName(),
                item.getSector().getId(),
                item.getSector().getName(),
                item.getAssetTag().getId(),
                item.getAssetTag().getCode(),
                item.getCreatedAt());
    }
}
