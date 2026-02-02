import { useState, useEffect } from 'react';
import { profileService, Profile } from '@/services/ProfileService';

/**
 *
 * @param userId
 * @return Profil, etat de chargement et fonctions de gestion
 */
export function useProfile(userId: string | undefined) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profiles, setProfiles] = useState<Profile[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    /**
     * load the profile from the API
     */
    const loadProfile = async () => {
        // make sure userId is defined
        if (!userId || userId === '') {
            setProfile(null);
            setLoading(false);
            setError(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await profileService.getProfile(userId);
            setProfile(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * load all profiles from the API
     */
    const loadProfiles = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await profileService.getAllProfiles();
            setProfiles(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            console.error('Error loading profiles:', err);
        } finally {
            setLoading(false);
        }
    };

    // TODO : complete as you do the ProfileService

    return { profile, loadProfile, profiles, loadProfiles, loading, error };
}