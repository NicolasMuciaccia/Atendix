package com.uvv.atendix.repository;

import com.uvv.atendix.model.dto.AssetTagView;
import com.uvv.atendix.model.entity.AssetTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface AssetTagRepository extends JpaRepository<AssetTag, UUID> {

    @Query("""
            select new com.uvv.atendix.model.dto.AssetTagView(t.id, t.code, i.id, i.name, t.createdAt)
              from AssetTag t
              left join Item i on i.assetTag = t
             order by t.code
            """)
    List<AssetTagView> findAllWithItem();

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, UUID id);
}
