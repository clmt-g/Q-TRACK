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

-- SELECT : admin, qualite can see all actions correctives + operator can see actions correctives related to their incidents
CREATE POLICY "select-actions_correctives" ON actions_correctives
    FOR SELECT
    USING (
    EXISTS(SELECT 1
           FROM profiles
           WHERE profiles.id = auth.uid()
             AND profiles.role IN ('admin', 'qualite'))
        OR EXISTS(SELECT 1
                   FROM incidents
                   WHERE incidents.id_incident = actions_correctives.id_incident
                     AND incidents.id_user = auth.uid())
    );

-- INSERT : admin and qualite can create an action corrective
CREATE POLICY "insert-actions_correctives" ON actions_correctives
    FOR INSERT
    WITH CHECK (
    EXISTS(SELECT 1
           FROM profiles
           WHERE profiles.id = auth.uid()
             AND profiles.role IN ('admin', 'qualite'))
    );

-- UPDATE (and delete) : admin and qualite can update any actions correctives
CREATE POLICY "update-actions_correctives" ON actions_correctives
    FOR UPDATE
    USING (
    EXISTS(SELECT 1
           FROM profiles
           WHERE profiles.id = auth.uid()
             AND profiles.role IN ('admin', 'qualite'))
    );
