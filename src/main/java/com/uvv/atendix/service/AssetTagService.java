package com.uvv.atendix.service;

import com.uvv.atendix.model.entity.AssetTag;
import com.uvv.atendix.model.request.AssetTagRequest;
import com.uvv.atendix.model.response.AssetTagResponse;
import com.uvv.atendix.repository.AssetTagRepository;
import com.uvv.atendix.repository.ItemRepository;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AssetTagService {

    private static final Logger log = LoggerFactory.getLogger(AssetTagService.class);

    private static final String TAG_NOT_FOUND = "Etiqueta não encontrada: ";
    private static final String CODE_TAKEN = "Já existe uma etiqueta com o código ";
    private static final String TAG_IN_USE = "A etiqueta está vinculada a um item. Troque a etiqueta do item ou exclua o item antes.";

    private final AssetTagRepository assetTagRepository;
    private final ItemRepository itemRepository;
    private final CatalogMapper catalogMapper;

    public AssetTagService(AssetTagRepository assetTagRepository, ItemRepository itemRepository,
                           CatalogMapper catalogMapper) {
        this.assetTagRepository = assetTagRepository;
        this.itemRepository = itemRepository;
        this.catalogMapper = catalogMapper;
    }

    @Transactional(readOnly = true)
    public List<AssetTagResponse> listAssetTags() {
        return assetTagRepository.findAllWithItem().stream().map(catalogMapper::toResponse).toList();
    }

    @Transactional
    public AssetTagResponse createAssetTag(AssetTagRequest request) {
        AssetTag assetTag = AssetTag.create(request.code());
        validateCodeAvailable(assetTag.getCode());

        AssetTag savedTag = assetTagRepository.save(assetTag);

        log.info("Asset tag {} created", savedTag.getId());
        return catalogMapper.toResponse(savedTag, null);
    }

    @Transactional
    public AssetTagResponse updateAssetTag(UUID assetTagId, AssetTagRequest request) {
        AssetTag assetTag = findAssetTag(assetTagId);
        assetTag.changeCode(request.code());
        validateCodeAvailable(assetTag.getCode(), assetTagId);

        AssetTag savedTag = assetTagRepository.save(assetTag);

        log.info("Asset tag {} changed", assetTagId);
        return catalogMapper.toResponse(savedTag, itemRepository.findByAssetTagId(assetTagId).orElse(null));
    }

    @Transactional
    public void deleteAssetTag(UUID assetTagId) {
        AssetTag assetTag = findAssetTag(assetTagId);
        validateNotInUse(assetTagId);

        assetTagRepository.delete(assetTag);

        log.info("Asset tag {} deleted", assetTagId);
    }

    private void validateCodeAvailable(String code) {
        if (assetTagRepository.existsByCode(code)) {
            throw new BusinessConflictException(CODE_TAKEN + code);
        }
    }

    private void validateCodeAvailable(String code, UUID assetTagId) {
        if (assetTagRepository.existsByCodeAndIdNot(code, assetTagId)) {
            throw new BusinessConflictException(CODE_TAKEN + code);
        }
    }

    private void validateNotInUse(UUID assetTagId) {
        if (itemRepository.existsByAssetTagId(assetTagId)) {
            throw new BusinessConflictException(TAG_IN_USE);
        }
    }

    private AssetTag findAssetTag(UUID assetTagId) {
        return assetTagRepository.findById(assetTagId)
                .orElseThrow(() -> new ResourceNotFoundException(TAG_NOT_FOUND + assetTagId));
    }
}
