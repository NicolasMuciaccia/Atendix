CREATE TABLE users (
    id                   UUID         NOT NULL PRIMARY KEY,
    name                 VARCHAR(120) NOT NULL,
    login                VARCHAR(40)  NOT NULL,
    password_hash        VARCHAR(255) NOT NULL,
    -- 0 = common user, 1 = administrator
    role                 SMALLINT     NOT NULL CHECK (role IN (0, 1)),
    must_change_password BOOLEAN      NOT NULL,
    -- BaseEntity columns
    version              BIGINT       NOT NULL,
    created_at           TIMESTAMPTZ  NOT NULL,
    updated_at           TIMESTAMPTZ  NOT NULL,
    CONSTRAINT uk_users_login UNIQUE (login)
);
