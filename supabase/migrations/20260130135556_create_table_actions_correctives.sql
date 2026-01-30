-- ============================================
-- TABLE ACTIONS_CORRECTIVES
-- ============================================
CREATE TABLE actions_correctives
(
    id_action          BIGSERIAL PRIMARY KEY,
    description        TEXT   NOT NULL,
    responsable        TEXT   NOT NULL,
    date_mise_en_place DATE,
    statut             TEXT   NOT NULL CHECK (statut IN ('prevue', 'en_cours', 'terminee')) DEFAULT 'prevue',
    id_incident        BIGINT NOT NULL REFERENCES incidents (id_incident) ON DELETE CASCADE,
    deleted_at         TIMESTAMPTZ,
    created_at         TIMESTAMPTZ                                                          DEFAULT now()
);

CREATE INDEX idx_actions_correctives_deleted_at ON actions_correctives (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_actions_correctives_incident ON actions_correctives (id_incident);

ALTER TABLE actions_correctives ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES
-- ============================================

