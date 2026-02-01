-- ============================================
-- TABLE PROFILES (complète auth.users)
-- ============================================
CREATE TABLE profiles
(
    id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    nom        TEXT NOT NULL,
    prenom     TEXT NOT NULL,
    role       TEXT NOT NULL CHECK (role IN ('operateur', 'qualite', 'admin', 'direction')),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_deleted_at ON profiles (deleted_at) WHERE deleted_at IS NULL;

ALTER TABLE profiles
    ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES
-- ============================================

-- SELECT, INSERT, UPDATE, DELETE profiles by admin only
CREATE POLICY "manage-profiles" ON profiles
    FOR ALL
    USING (
    EXISTS (SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin')
    );

-- SELECT, UPDATE your own profile (+ make sure a user can't delete his profile)
CREATE POLICY "manage-your-profile" ON profiles
    FOR ALL
    USING (auth.uid() = id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = id AND deleted_at IS NULL);
