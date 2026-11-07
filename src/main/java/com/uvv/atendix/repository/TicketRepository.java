package com.uvv.atendix.repository;

import com.uvv.atendix.model.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID>, JpaSpecificationExecutor<Ticket> {

    String REQUESTER = "requester";
    String ITEM_SECTOR = "item.sector";
    String ITEM_ASSET_TAG = "item.assetTag";

    @Override
    @EntityGraph(attributePaths = {REQUESTER, ITEM_SECTOR, ITEM_ASSET_TAG})
    Optional<Ticket> findById(UUID id);

    @Override
    @EntityGraph(attributePaths = {REQUESTER, ITEM_SECTOR, ITEM_ASSET_TAG})
    Page<Ticket> findAll(Specification<Ticket> specification, Pageable pageable);

    boolean existsByItemId(UUID itemId);
}
