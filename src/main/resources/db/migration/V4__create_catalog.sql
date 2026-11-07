-- Sectors, asset tags and items become registered data. Tickets stop storing them as free text
-- and point to the item, which knows its sector and its asset tag.

CREATE TABLE sectors (
    id         UUID        NOT NULL PRIMARY KEY,
    name       VARCHAR(80) NOT NULL,
    -- BaseEntity columns
    version    BIGINT      NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE UNIQUE INDEX uk_sectors_name ON sectors (LOWER(name));

CREATE TABLE asset_tags (
    id         UUID        NOT NULL PRIMARY KEY,
    -- always stored in upper case by the application
    code       VARCHAR(40) NOT NULL,
    -- BaseEntity columns
    version    BIGINT      NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uk_asset_tags_code UNIQUE (code)
);

CREATE TABLE items (
    id           UUID         NOT NULL PRIMARY KEY,
    name         VARCHAR(120) NOT NULL,
    sector_id    UUID         NOT NULL,
    asset_tag_id UUID         NOT NULL,
    -- BaseEntity columns
    version      BIGINT       NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL,
    updated_at   TIMESTAMPTZ  NOT NULL,
    CONSTRAINT fk_items_sector FOREIGN KEY (sector_id) REFERENCES sectors (id),
    CONSTRAINT fk_items_asset_tag FOREIGN KEY (asset_tag_id) REFERENCES asset_tags (id),
    -- one asset tag identifies exactly one item
    CONSTRAINT uk_items_asset_tag UNIQUE (asset_tag_id)
);
CREATE INDEX idx_items_sector ON items (sector_id);

-- Existing tickets: register what they typed, so no ticket loses its data
INSERT INTO sectors (id, name, version, created_at, updated_at)
SELECT gen_random_uuid(), source.name, 0, NOW(), NOW()
FROM (SELECT DISTINCT ON (LOWER(TRIM(sector))) TRIM(sector) AS name
      FROM tickets
      ORDER BY LOWER(TRIM(sector)), created_at DESC) source;

INSERT INTO asset_tags (id, code, version, created_at, updated_at)
SELECT gen_random_uuid(), source.code, 0, NOW(), NOW()
FROM (SELECT DISTINCT UPPER(TRIM(asset_tag)) AS code FROM tickets) source;

-- When the same tag appears with different names or sectors, the most recent ticket wins
INSERT INTO items (id, name, sector_id, asset_tag_id, version, created_at, updated_at)
SELECT gen_random_uuid(), latest.item_name, sector.id, tag.id, 0, NOW(), NOW()
FROM (SELECT DISTINCT ON (UPPER(TRIM(asset_tag))) UPPER(TRIM(asset_tag)) AS code,
                                                    TRIM(item_name)       AS item_name,
                                                    TRIM(sector)          AS sector
      FROM tickets
      ORDER BY UPPER(TRIM(asset_tag)), created_at DESC) latest
JOIN sectors sector ON LOWER(sector.name) = LOWER(latest.sector)
JOIN asset_tags tag ON tag.code = latest.code;

ALTER TABLE tickets ADD COLUMN item_id UUID;

UPDATE tickets ticket
SET item_id = item.id
FROM items item
JOIN asset_tags tag ON tag.id = item.asset_tag_id
WHERE tag.code = UPPER(TRIM(ticket.asset_tag));

ALTER TABLE tickets ALTER COLUMN item_id SET NOT NULL;
ALTER TABLE tickets ADD CONSTRAINT fk_tickets_item FOREIGN KEY (item_id) REFERENCES items (id);
CREATE INDEX idx_tickets_item ON tickets (item_id);

ALTER TABLE tickets DROP COLUMN sector;
ALTER TABLE tickets DROP COLUMN item_name;
ALTER TABLE tickets DROP COLUMN asset_tag;
