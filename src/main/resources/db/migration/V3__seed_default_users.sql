-- Default accounts required by the assignment. Both start with the initial password
-- (app.users.initial-password) hashed with Argon2id and must change it on first access.
INSERT INTO users (id, name, login, password_hash, role, must_change_password, version, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'Administrador', 'admin',
     '$argon2id$v=19$m=19456,t=2,p=1$/EU0W2cHv7y6vem5geKRAQ$OpYPjKhNNOUdUJFuJiEODOSrcQiyeVM74E3Km0xbVHs',
     1, TRUE, 0, NOW(), NOW()),
    (gen_random_uuid(), 'Usuário Comum', 'usuario',
     '$argon2id$v=19$m=19456,t=2,p=1$Mw113iubLqLBKmCtxK+5VA$Kpl5XcwB4zmqk9xzl/Zb62xhlp6LXKheLKLnhl2E8XI',
     0, TRUE, 0, NOW(), NOW());
