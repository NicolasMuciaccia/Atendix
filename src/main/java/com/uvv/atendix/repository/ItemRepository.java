package com.uvv.atendix.repository;

import com.uvv.atendix.model.entity.Item;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {

    String SECTOR = "sector";
    String ASSET_TAG = "assetTag";

    @Override
    @EntityGraph(attributePaths = {SECTOR, ASSET_TAG})
    Optional<Item> findById(UUID id);

    @EntityGraph(attributePaths = {SECTOR, ASSET_TAG})
    List<Item> findAllByOrderByNameAsc();

    @EntityGraph(attributePaths = {SECTOR, ASSET_TAG})
    List<Item> findBySectorIdOrderByNameAsc(UUID sectorId);

    Optional<Item> findByAssetTagId(UUID assetTagId);

    boolean existsBySectorId(UUID sectorId);

    boolean existsByAssetTagId(UUID assetTagId);

    boolean existsByAssetTagIdAndIdNot(UUID assetTagId, UUID id);
}
