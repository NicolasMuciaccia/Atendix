package com.uvv.atendix.model.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class RoleConverter implements AttributeConverter<Role, Short> {

    @Override
    public Short convertToDatabaseColumn(Role role) {
        return role == null ? null : (short) role.code();
    }

    @Override
    public Role convertToEntityAttribute(Short code) {
        return code == null ? null : Role.fromCode(code);
    }
}
