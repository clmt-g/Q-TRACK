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