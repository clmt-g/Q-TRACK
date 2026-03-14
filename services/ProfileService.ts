import { supabase, supabaseUrl, supabaseAnonKey } from '@/utils/supabase';

export interface Profile {
    id: string;
    nom: string;
    prenom: string;
    role: string;
    created_at: string;
    deleted_at: string | null;
}

/**
 * The service which interact with the API for the profiles (and auth.users) table
 */
class ProfileService {
    /**
     * get a profile by its Id
     * @param userId
     * @return Profile
     */
    async getProfile(userId: string | undefined): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .is('deleted_at', null)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    }

    /**
     * update a profile by its Id and return the updated profile
     * @param userId
     * @param updates
     */
    async updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at'>>): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .is('deleted_at', null)
            .select()
            .single();

        if(error) {
            console.error('Error updating profile:', error);
            return null;
        }

        return data;
    }

    /**
     * create a user in auth, and the trigger 'when_user_created_in_auth' create the profile
     * @param profileData
     */
    async createProfile(
        profileData: {
            email: string;
            password: string;
            nom: string;
            prenom: string;
            role: 'operateur' | 'qualite' | 'admin' | 'direction';
        }
    ): Promise<Profile | null> {
        // FIXME : auth.SignUp authenticate the user as the one newly created
        // Créer l'utilisateur Auth (avec trigger qui crée le profil)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: profileData.email,
            password: profileData.password,
            options: {
                data: {
                    nom: profileData.nom,
                    prenom: profileData.prenom,
                    role: profileData.role
                }
            }
        });

        if (authError || !authData.user) {
            console.error('Error creating user:', authError);
            return null;
        }

        // Récupérer le profil qui vient d'être créé par le trigger
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            console.error('Error fetching created profile:', profileError);
            return null;
        }

        return profile;
    }

    /**
     * Soft delete a profile according to the key userId
     * @param userId
     */
    async deleteProfile(userId: string | undefined): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if(error) {
            console.error('Error deleting profile:', error);
        }

        return data;
    }

    /** For admins looking a user password
     * Update the password of a user in auth and return the updated profile
     * @param userId - the id of the user (works because the field id of profile is a foreign key of auth.user uid)
     * @param newPassword - the new password setted by the admin
     */
    async updateUserPassword(userId: string, newPassword: string): Promise<Profile | null> {
        // FIXME : doesn't work because auth.admin necessitate the service_role key
        // Utiliser l'Admin API
        const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
            userId,
            { password: newPassword }
        );

        if (authError || !authData.user) {
            console.error('Error updating password:', authError);
            throw new Error(authError?.message || 'Impossible de mettre à jour le mot de passe');
        }

        // Récupérer le profil mis à jour
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .is('deleted_at', null)
            .single();

        if (profileError) {
            console.error('Error fetching updated profile:', profileError);
            throw new Error('Profil introuvable');
        }

        return profile;
    }

    /** For users looking to update their own password
     * update the password of a user in auth and return the updated profile
     * @param userId - the id of the profile
     * @param email - the email address of the user
     * @param oldPassword - the old password of the user
     * @param newPassword - the new password of the user
     */
    async updatePassword(userId: string, email: string, oldPassword: string, newPassword: string): Promise<Profile | null> {
        // On vérifie que le mot de passe communiqué par l'utilisateur est le bon
        // si signInWithPassword return une erreur alors c'est pas les cas
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: oldPassword
        })

        if (error) {
            console.error('The current password provided is invalid:', error);
            return null;
        }

        // Si on arrive ici l'utilisateur connait son mot de passe
        // Mettre à jour le mot de passe de l'utilisateur Auth
        const { data: authData, error: authError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (authError || !authData.user) {
            console.error('Error updating password:', authError);
            return null;
        }

        // Récupérer le profil mis à jour
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError) {
            console.error('Error fetching updated profile:', profileError);
            return null;
        }

        return profile;
    }

    /**
     * get all profiles
     * @return Profile[]
     */
    async getAllProfiles(): Promise<Profile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching profiles:', error);
            return [];
        }

        return data || [];
    }

}

export const profileService = new ProfileService();
