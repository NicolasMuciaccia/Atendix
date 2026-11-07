package com.uvv.atendix.model.entity;

import com.uvv.atendix.util.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "sectors")
public class Sector extends BaseEntity {

    @Column(name = "name", length = ColumnLengths.SECTOR, nullable = false)
    private String name;

    protected Sector() {
        // required by JPA; callers use the create(...) factory
    }

    public static Sector create(String name) {
        Sector sector = new Sector();
        sector.name = requireName(name);
        return sector;
    }

    public void rename(String newName) {
        name = requireName(newName);
    }

    private static String requireName(String name) {
        if (name == null || name.isBlank()) {
            throw new BusinessException("O nome do setor é obrigatório");
        }
        return name.trim();
    }

    public String getName() {
        return name;
    }
}
