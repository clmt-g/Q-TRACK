-- ============================================
-- TABLE INCIDENTS
-- ============================================
CREATE TABLE incidents
(
    id_incident      BIGSERIAL PRIMARY KEY,
    date_declaration TIMESTAMPTZ                                                          DEFAULT now(),
    description      TEXT   NOT NULL,
    statut           TEXT   NOT NULL CHECK (statut IN ('declare', 'en_cours', 'cloture')) DEFAULT 'declare',
    id_user          UUID   NOT NULL REFERENCES auth.users (id),
    id_type_incident BIGINT NOT NULL REFERENCES types_incidents (id_type_incident),
    deleted_at       TIMESTAMPTZ,
    created_at       TIMESTAMPTZ                                                          DEFAULT now()
);

CREATE INDEX idx_incidents_deleted_at ON incidents (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_incidents_user ON incidents (id_user);
CREATE INDEX idx_incidents_statut ON incidents (statut);

ALTER TABLE incidents
    ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES
-- ============================================

-- SELECT : admin, qualité see all incidents + operator see their incidents
CREATE POLICY "select-incidents" ON incidents
    FOR SELECT
    USING (
    EXISTS(SELECT 1
           FROM profiles
           WHERE profiles.id = auth.uid()
             AND profiles.role IN ('admin', 'qualite'))
        OR auth.uid() = id_user
    );

-- INSERT : operateur, admin and qualite can create an incident
CREATE POLICY "insert-incidents" ON incidents
    FOR INSERT
    WITH CHECK (
    auth.uid() = id_user
        AND EXISTS(SELECT 1
                   FROM profiles
                   WHERE profiles.id = auth.uid()
                     AND profiles.role IN ('operateur', 'qualite', 'admin'))
    );

-- UPDATE : admin and qualite can update any incidents
CREATE POLICY "update-incidents" ON incidents
    FOR UPDATE
    USING (
    EXISTS(SELECT 1
           FROM profiles
           WHERE profiles.id = auth.uid()
             AND profiles.role IN ('admin', 'qualite'))
    );

-- UPDATE : can only update your incidents (and no delete)
CREATE POLICY "update-your-incidents" ON incidents
    FOR UPDATE
    USING (auth.uid() = id_user)
    WITH CHECK (
    auth.uid() = id_user
        AND deleted_at IS NULL -- security so that operateur cannot delete an incident
    );

-- DELETE : for admin and qualite
CREATE POLICY "delete-incidents" ON incidents
    FOR UPDATE
    USING (
    EXISTS(SELECT 1
           FROM profiles
           WHERE profiles.id = auth.uid()
             AND profiles.role IN ('admin', 'qualite'))
    )
