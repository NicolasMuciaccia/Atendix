package com.uvv.atendix.service;

import com.uvv.atendix.model.entity.CatalogFixtures;
import com.uvv.atendix.model.entity.Sector;
import com.uvv.atendix.model.request.SectorRequest;
import com.uvv.atendix.repository.ItemRepository;
import com.uvv.atendix.repository.SectorRepository;
import com.uvv.atendix.util.exception.BusinessConflictException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SectorServiceTest {

    @Mock
    private SectorRepository sectorRepository;

    @Mock
    private ItemRepository itemRepository;

    private SectorService sectorService;

    @BeforeEach
    void setUp() {
        sectorService = new SectorService(sectorRepository, itemRepository, new CatalogMapper());
    }

    @Test
    void shouldRejectNameAlreadyUsedIgnoringCase() {
        when(sectorRepository.existsByNameIgnoreCase("financeiro")).thenReturn(true);

        assertThatThrownBy(() -> sectorService.createSector(new SectorRequest("  financeiro ")))
                .isInstanceOf(BusinessConflictException.class);
        verify(sectorRepository, never()).save(any(Sector.class));
    }

    @Test
    void shouldKeepSectorThatHasItems() {
        Sector sector = CatalogFixtures.sector();
        when(sectorRepository.findById(sector.getId())).thenReturn(Optional.of(sector));
        when(itemRepository.existsBySectorId(sector.getId())).thenReturn(true);

        assertThatThrownBy(() -> sectorService.deleteSector(sector.getId()))
                .isInstanceOf(BusinessConflictException.class);
        verify(sectorRepository, never()).delete(any(Sector.class));
    }
}
