-- ============================================
-- TRIGGER
-- ============================================

/*
 le but :
 - Créer le profil automatiquement quand un utilisateur s'inscrit dans auth
 Pourquoi :
 - La clé primaire de profiles fait référence à celle de auth
 */

-- Fonction qui crée un profil quand un user est créé dans auth
CREATE OR REPLACE FUNCTION public.create_new_user()
    RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nom, prenom, role)
    VALUES (
               new.id,
               COALESCE(new.raw_user_meta_data->>'nom', ''),
               COALESCE(new.raw_user_meta_data->>'prenom', ''),
               COALESCE(new.raw_user_meta_data->>'role', 'operateur')
           );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui appelle la fonction create_new_user() quand un user est créé
CREATE TRIGGER when_user_created_in_auth
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_new_user();