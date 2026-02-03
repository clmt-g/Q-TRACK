import { supabase } from "@/utils/supabase";
import {List} from "postcss/lib/list";

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
        // recup la session pour s'authentifié
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('Vous devez être connecté pour créer un utilisateur');
        }

        // Utiliser l'Edge Function au lieu de signUp
        // on utilise fetch car supabase.functions.invoke ne fonctionne pas en native
        const response = await fetch(
            'https://nrqkknpovbmnlwnbfgdi.supabase.co/functions/v1/create-user',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycWtrbnBvdmJtbmx3bmJmZ2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTg4NzcsImV4cCI6MjA4NTI3NDg3N30.ATKkki8K7167hVAP261W9ha0uU3b959yXe8LS9jbh0w',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    email: profileData.email,
                    password: profileData.password,
                    nom: profileData.nom,
                    prenom: profileData.prenom,
                    role: profileData.role,
                    userToken: session.access_token,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Erreur ${response.status}`);
        }

        if (!result.user) {
            throw new Error('Aucun utilisateur retourné');
        }

        // Récupérer le profil créé par le trigger
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', result.user.id)
            .single();

        if (profileError) {
            throw new Error('Erreur lors de la récupération du profil');
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
            .select('*');

        if (error) {
            console.error('Error fetching profiles:', error);
            return [];
        }

        return data || [];
    }

    // TODO : add updateProfile, deleteProfile, createProfile and countProfiles methods
}

export const profileService = new ProfileService();