-- ============================================
-- TABLE TYPES_INCIDENTS
-- ============================================
CREATE TABLE types_incidents
(
    id_type_incident BIGSERIAL PRIMARY KEY,
    libelle          TEXT NOT NULL,
    description      TEXT,
    actif            BOOLEAN     DEFAULT true,
    deleted_at       TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_types_incidents_deleted_at ON types_incidents (deleted_at) WHERE deleted_at IS NULL;

ALTER TABLE types_incidents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES
-- ============================================

-- SELECT, UPDATE, INSERT, DELETE : admin and qualite only
CREATE POLICY "mange-types" ON types_incidents
    FOR ALL
    USING (
        EXISTS(
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'qualite')
        )
    );

-- SELECT : anyone can view types
CREATE POLICY "view-types" ON types_incidents
    FOR SELECT
    USING (
    EXISTS(SELECT 1
           FROM profiles
           WHERE profiles.id = auth.uid()
             AND profiles.role IN ('operateur', 'qualite', 'admin', 'direction')
           )
    );