-- Sign-in now compares the login exactly as typed, but "Admin" and "admin" still cannot both exist
ALTER TABLE users DROP CONSTRAINT uk_users_login;
CREATE UNIQUE INDEX uk_users_login ON users (LOWER(login));
