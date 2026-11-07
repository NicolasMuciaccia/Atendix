package com.uvv.atendix.service;

import com.uvv.atendix.model.entity.Sector;
import com.uvv.atendix.model.request.SectorRequest;
import com.uvv.atendix.model.response.SectorResponse;
import com.uvv.atendix.repository.ItemRepository;
import com.uvv.atendix.repository.SectorRepository;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SectorService {

    private static final Logger log = LoggerFactory.getLogger(SectorService.class);

    private static final String SECTOR_NOT_FOUND = "Setor não encontrado: ";
    private static final String NAME_TAKEN = "Já existe um setor com o nome ";
    private static final String SECTOR_IN_USE = "O setor tem itens cadastrados. Mova ou exclua os itens antes de excluir o setor.";

    private final SectorRepository sectorRepository;
    private final ItemRepository itemRepository;
    private final CatalogMapper catalogMapper;

    public SectorService(SectorRepository sectorRepository, ItemRepository itemRepository, CatalogMapper catalogMapper) {
        this.sectorRepository = sectorRepository;
        this.itemRepository = itemRepository;
        this.catalogMapper = catalogMapper;
    }

    @Transactional(readOnly = true)
    public List<SectorResponse> listSectors() {
        return sectorRepository.findAllByOrderByNameAsc().stream().map(catalogMapper::toResponse).toList();
    }

    @Transactional
    public SectorResponse createSector(SectorRequest request) {
        Sector sector = Sector.create(request.name());
        validateNameAvailable(sector.getName());

        Sector savedSector = sectorRepository.save(sector);

        log.info("Sector {} created", savedSector.getId());
        return catalogMapper.toResponse(savedSector);
    }

    @Transactional
    public SectorResponse updateSector(UUID sectorId, SectorRequest request) {
        Sector sector = findSector(sectorId);
        sector.rename(request.name());
        validateNameAvailable(sector.getName(), sectorId);

        Sector savedSector = sectorRepository.save(sector);

        log.info("Sector {} renamed", sectorId);
        return catalogMapper.toResponse(savedSector);
    }

    @Transactional
    public void deleteSector(UUID sectorId) {
        Sector sector = findSector(sectorId);
        validateNotInUse(sectorId);

        sectorRepository.delete(sector);

        log.info("Sector {} deleted", sectorId);
    }

    private void validateNameAvailable(String name) {
        if (sectorRepository.existsByNameIgnoreCase(name)) {
            throw new BusinessConflictException(NAME_TAKEN + "\"" + name + "\"");
        }
    }

    private void validateNameAvailable(String name, UUID sectorId) {
        if (sectorRepository.existsByNameIgnoreCaseAndIdNot(name, sectorId)) {
            throw new BusinessConflictException(NAME_TAKEN + "\"" + name + "\"");
        }
    }

    private void validateNotInUse(UUID sectorId) {
        if (itemRepository.existsBySectorId(sectorId)) {
            throw new BusinessConflictException(SECTOR_IN_USE);
        }
    }

    private Sector findSector(UUID sectorId) {
        return sectorRepository.findById(sectorId)
                .orElseThrow(() -> new ResourceNotFoundException(SECTOR_NOT_FOUND + sectorId));
    }
}
