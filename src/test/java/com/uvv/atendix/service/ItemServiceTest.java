package com.uvv.atendix.service;

import com.uvv.atendix.model.entity.AssetTag;
import com.uvv.atendix.model.entity.CatalogFixtures;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    private static final String NEW_NAME = "Impressora Brother";

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private SectorRepository sectorRepository;

    @Mock
    private AssetTagRepository assetTagRepository;

    @Mock
    private TicketRepository ticketRepository;

    private ItemService itemService;
    private final Sector sector = CatalogFixtures.sector();
    private final AssetTag assetTag = CatalogFixtures.assetTag();

    @BeforeEach
    void setUp() {
        itemService = new ItemService(itemRepository, sectorRepository, assetTagRepository, ticketRepository,
                new CatalogMapper());
    }

    @Test
    void shouldRegisterItemWithItsSectorAndTag() {
        when(itemRepository.existsByAssetTagId(assetTag.getId())).thenReturn(false);
        when(sectorRepository.findById(sector.getId())).thenReturn(Optional.of(sector));
        when(assetTagRepository.findById(assetTag.getId())).thenReturn(Optional.of(assetTag));
        when(itemRepository.save(any(Item.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ItemResponse response = itemService.createItem(new ItemRequest(NEW_NAME, sector.getId(), assetTag.getId()));

        assertThat(response.sectorName()).isEqualTo(CatalogFixtures.SECTOR_NAME);
        assertThat(response.assetTagCode()).isEqualTo(CatalogFixtures.TAG_CODE);
    }

    @Test
    void shouldRejectTagThatAlreadyBelongsToAnotherItem() {
        when(itemRepository.existsByAssetTagId(assetTag.getId())).thenReturn(true);

        assertThatThrownBy(() -> itemService.createItem(new ItemRequest(NEW_NAME, sector.getId(), assetTag.getId())))
                .isInstanceOf(BusinessConflictException.class);
        verify(itemRepository, never()).save(any(Item.class));
    }

    @Test
    void shouldRejectSectorThatDoesNotExist() {
        UUID missingSectorId = UUID.randomUUID();
        when(itemRepository.existsByAssetTagId(assetTag.getId())).thenReturn(false);
        when(sectorRepository.findById(missingSectorId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.createItem(new ItemRequest(NEW_NAME, missingSectorId, assetTag.getId())))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void shouldKeepItemThatHasTickets() {
        Item item = CatalogFixtures.item();
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));
        when(ticketRepository.existsByItemId(item.getId())).thenReturn(true);

        assertThatThrownBy(() -> itemService.deleteItem(item.getId()))
                .isInstanceOf(BusinessConflictException.class);
        verify(itemRepository, never()).delete(any(Item.class));
    }
}
