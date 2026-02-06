import {List} from "postcss/lib/list";
import { supabase, supabaseUrl, supabaseAnonKey } from '@/utils/supabase';

export interface Profile {
    id: string;
    nom: string;
    prenom: string;
    role: string;
    created_at: string;
    deleted_at: string;
}

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