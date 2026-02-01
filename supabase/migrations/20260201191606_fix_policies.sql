-- ============================================
-- FONCTIONS UTILITAIRE
-- ============================================

CREATE OR REPLACE FUNCTION public.current_user_role()
    RETURNS TEXT
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
BEGIN
    RETURN (
        SELECT role FROM profiles
        WHERE id = auth.uid()
          AND deleted_at IS NULL
    );
END;
$$;

-- ============================================
-- DROP TOUTES LES POLICIES
-- ============================================
-- profiles
DROP POLICY IF EXISTS "manage-profiles" ON profiles;

-- types incidents
DROP POLICY IF EXISTS "mange-types" ON types_incidents;
DROP POLICY IF EXISTS "view-types" ON types_incidents;

-- incidents
DROP POLICY IF EXISTS "select-incidents" ON incidents;
DROP POLICY IF EXISTS "insert-incidents" ON incidents;
DROP POLICY IF EXISTS "update-incidents" ON incidents;
DROP POLICY IF EXISTS "update-your-incidents" ON incidents;
DROP POLICY IF EXISTS "delete-incidents" ON incidents;

-- actions correctives
DROP POLICY IF EXISTS "select-actions_correctives" ON actions_correctives;
DROP POLICY IF EXISTS "insert-actions_correctives" ON actions_correctives;
DROP POLICY IF EXISTS "update-actions_correctives" ON actions_correctives;

-- ============================================
-- POLICIES QUI MARCHENT
-- ============================================

-- profiles
CREATE POLICY "manage-profiles" ON profiles
    FOR ALL
    USING ( current_user_role() = 'admin' );

-- types incidents
CREATE POLICY "mange-types" ON types_incidents
    FOR ALL
    USING ( current_user_role() IN ('admin', 'qualite') );

CREATE POLICY "view-types" ON types_incidents
    FOR SELECT
    USING ( current_user_role() IN ('operateur', 'qualite', 'admin', 'direction') );

-- incidents
CREATE POLICY "select-incidents" ON incidents
    FOR SELECT
    USING ( current_user_role() IN ('admin', 'qualite', 'direction')
            OR auth.uid() = id_user );

CREATE POLICY "insert-incidents" ON incidents
    FOR INSERT
    WITH CHECK ( auth.uid() = id_user
                 AND current_user_role() IN ('operateur', 'qualite', 'admin') );

CREATE POLICY "update-incidents" ON incidents
    FOR UPDATE
    USING ( current_user_role() IN ('admin', 'qualite') );

-- changed my mind, operateur cannot update their incidents

CREATE POLICY "delete-incidents" ON incidents
    FOR UPDATE
    USING ( current_user_role() IN ('admin', 'qualite') );

-- actions correctives
CREATE POLICY "select-actions_correctives" ON actions_correctives
    FOR SELECT
    USING ( current_user_role() IN ('admin', 'qualite', 'direction')
            OR EXISTS(SELECT 1
                      FROM incidents
                      WHERE incidents.id_incident = actions_correctives.id_incident
                        AND incidents.id_user = auth.uid())
    );

CREATE POLICY "insert-actions_correctives" ON actions_correctives
    FOR INSERT
    WITH CHECK ( current_user_role() IN ('admin', 'qualite') );

CREATE POLICY "update-actions_correctives" ON actions_correctives
    FOR UPDATE
    USING ( current_user_role() IN ('admin', 'qualite') );

