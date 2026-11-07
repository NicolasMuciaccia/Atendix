CREATE TABLE tickets (
    id                  UUID          NOT NULL PRIMARY KEY,
    requester_id        UUID          NOT NULL,
    request_date        DATE          NOT NULL,
    sector              VARCHAR(80)   NOT NULL,
    item_name           VARCHAR(120)  NOT NULL,
    problem_description VARCHAR(2000) NOT NULL,
    asset_tag           VARCHAR(40)   NOT NULL,
    status              VARCHAR(40)   NOT NULL CHECK (status IN ('OPEN', 'IN_PROGRESS', 'FINISHED')),
    -- BaseEntity columns
    version             BIGINT        NOT NULL,
    created_at          TIMESTAMPTZ   NOT NULL,
    updated_at          TIMESTAMPTZ   NOT NULL,
    CONSTRAINT fk_tickets_requester FOREIGN KEY (requester_id) REFERENCES users (id)
);

-- Every listing is ordered from the most recent ticket to the oldest
CREATE INDEX idx_tickets_request_date ON tickets (request_date DESC, created_at DESC);
CREATE INDEX idx_tickets_requester ON tickets (requester_id);
