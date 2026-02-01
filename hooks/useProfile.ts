import { useState, useEffect } from 'react';
import { profileService, Profile } from '@/services/ProfileService';

/**
 *
 * @param userId
 * @return Profil, etat de chargement et fonctions de gestion
 */
export function useProfile(userId: string) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    /**
     * charge le profile depuis l'API
     */
    const loadProfile = async () => {
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

    return { profile, loading, error };
}