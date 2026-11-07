package com.uvv.atendix.model.entity;

import com.uvv.atendix.util.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * A piece of equipment that can receive tickets: it sits in one sector and carries one asset tag,
 * so picking the tag is enough to know the item and where it is.
 */
@Entity
@Table(name = "items")
public class Item extends BaseEntity {

    @Column(name = "name", length = ColumnLengths.ITEM_NAME, nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_tag_id", nullable = false, unique = true)
    private AssetTag assetTag;

    protected Item() {
        // required by JPA; callers use the register(...) factory
    }

    public static Item register(String name, Sector sector, AssetTag assetTag) {
        Item item = new Item();
        item.update(name, sector, assetTag);
        return item;
    }

    public void update(String newName, Sector newSector, AssetTag newAssetTag) {
        if (newName == null || newName.isBlank()) {
            throw new BusinessException("O nome do item é obrigatório");
        }
        if (newSector == null) {
            throw new BusinessException("O setor do item é obrigatório");
        }
        if (newAssetTag == null) {
            throw new BusinessException("A etiqueta do item é obrigatória");
        }
        name = newName.trim();
        sector = newSector;
        assetTag = newAssetTag;
    }

    public String getName() {
        return name;
    }

    public Sector getSector() {
        return sector;
    }

    public AssetTag getAssetTag() {
        return assetTag;
    }
}
