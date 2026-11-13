-- Who started and who finished the handling of each ticket, and when
ALTER TABLE tickets ADD COLUMN started_by_id UUID;
ALTER TABLE tickets ADD COLUMN started_at TIMESTAMPTZ;
ALTER TABLE tickets ADD COLUMN finished_by_id UUID;
ALTER TABLE tickets ADD COLUMN finished_at TIMESTAMPTZ;
ALTER TABLE tickets ADD CONSTRAINT fk_tickets_started_by FOREIGN KEY (started_by_id) REFERENCES users (id);
ALTER TABLE tickets ADD CONSTRAINT fk_tickets_finished_by FOREIGN KEY (finished_by_id) REFERENCES users (id);

-- An item has at most one ticket being worked on; the application checks first,
-- the index protects against two requests opening tickets at the same moment
CREATE UNIQUE INDEX uk_tickets_active_item ON tickets (item_id) WHERE status IN ('OPEN', 'IN_PROGRESS');

-- Deactivated accounts cannot sign in; their tickets stay in the history
ALTER TABLE users ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;
