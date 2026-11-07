package com.uvv.atendix.service;

import com.uvv.atendix.model.entity.AssetTag;
import com.uvv.atendix.model.entity.Item;
import com.uvv.atendix.model.entity.Sector;
import com.uvv.atendix.model.request.ItemRequest;
import com.uvv.atendix.model.response.ItemResponse;
import com.uvv.atendix.repository.AssetTagRepository;
import com.uvv.atendix.repository.ItemRepository;
import com.uvv.atendix.repository.SectorRepository;
import com.uvv.atendix.repository.TicketRepository;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.BusinessException;
import com.uvv.atendix.util.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ItemService {

    private static final Logger log = LoggerFactory.getLogger(ItemService.class);

    private static final String ITEM_NOT_FOUND = "Item não encontrado: ";
    private static final String SECTOR_NOT_FOUND = "O setor selecionado não existe mais. Atualize a página e escolha outro.";
    private static final String TAG_NOT_FOUND = "A etiqueta selecionada não existe mais. Atualize a página e escolha outra.";
    private static final String TAG_TAKEN = "A etiqueta já pertence a outro item";
    private static final String ITEM_IN_USE = "O item tem chamados registrados e não pode ser excluído.";

    private final ItemRepository itemRepository;
    private final SectorRepository sectorRepository;
    private final AssetTagRepository assetTagRepository;
    private final TicketRepository ticketRepository;
    private final CatalogMapper catalogMapper;

    public ItemService(ItemRepository itemRepository, SectorRepository sectorRepository,
                       AssetTagRepository assetTagRepository, TicketRepository ticketRepository,
                       CatalogMapper catalogMapper) {
        this.itemRepository = itemRepository;
        this.sectorRepository = sectorRepository;
        this.assetTagRepository = assetTagRepository;
        this.ticketRepository = ticketRepository;
        this.catalogMapper = catalogMapper;
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> listItems(UUID sectorId) {
        List<Item> items = sectorId == null
                ? itemRepository.findAllByOrderByNameAsc()
                : itemRepository.findBySectorIdOrderByNameAsc(sectorId);
        return items.stream().map(catalogMapper::toResponse).toList();
    }

    @Transactional
    public ItemResponse createItem(ItemRequest request) {
        validateTagFree(request.assetTagId());

        Item item = Item.register(request.name(), findSector(request.sectorId()), findAssetTag(request.assetTagId()));
        Item savedItem = itemRepository.save(item);

        log.info("Item {} created", savedItem.getId());
        return catalogMapper.toResponse(savedItem);
    }

    @Transactional
    public ItemResponse updateItem(UUID itemId, ItemRequest request) {
        Item item = findItem(itemId);
        validateTagFree(request.assetTagId(), itemId);

        item.update(request.name(), findSector(request.sectorId()), findAssetTag(request.assetTagId()));
        Item savedItem = itemRepository.save(item);

        log.info("Item {} updated", itemId);
        return catalogMapper.toResponse(savedItem);
    }

    @Transactional
    public void deleteItem(UUID itemId) {
        Item item = findItem(itemId);
        validateNoTickets(itemId);

        itemRepository.delete(item);

        log.info("Item {} deleted", itemId);
    }

    private void validateTagFree(UUID assetTagId) {
        if (itemRepository.existsByAssetTagId(assetTagId)) {
            throw new BusinessConflictException(TAG_TAKEN);
        }
    }

    private void validateTagFree(UUID assetTagId, UUID itemId) {
        if (itemRepository.existsByAssetTagIdAndIdNot(assetTagId, itemId)) {
            throw new BusinessConflictException(TAG_TAKEN);
        }
    }

    private void validateNoTickets(UUID itemId) {
        if (ticketRepository.existsByItemId(itemId)) {
            throw new BusinessConflictException(ITEM_IN_USE);
        }
    }

    // A reference sent in the body that does not exist is a rule violation of the request (422), not a missing resource
    private Sector findSector(UUID sectorId) {
        return sectorRepository.findById(sectorId).orElseThrow(() -> new BusinessException(SECTOR_NOT_FOUND));
    }

    private AssetTag findAssetTag(UUID assetTagId) {
        return assetTagRepository.findById(assetTagId).orElseThrow(() -> new BusinessException(TAG_NOT_FOUND));
    }

    private Item findItem(UUID itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ITEM_NOT_FOUND + itemId));
    }
}
