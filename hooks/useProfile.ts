import { useState, useEffect } from 'react';
import { profileService, Profile } from '@/services/ProfileService';
import {Alert} from "react-native";

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
     * update the profile with the API and return the updated profile
     * @param updates
     */
    const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'updated_at'>>) => {
        // validation
        if (!userId || userId === '') {
            setError('User Id manquant');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await profileService.updateProfile(userId, updates);
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
     * create a profile with the API and return the created profile
     * @param profileData
     */
    const createProfile = async (profileData: {
        email: string;
        password: string;
        nom: string;
        prenom: string;
        role: 'operateur' | 'qualite' | 'admin' | 'direction';
    })=> {
        try {
            setLoading(true);
            setError(null);

            const data = await profileService.createProfile(profileData);
            setProfile(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    /**
     * soft delete a profile with the API and return the deleted profile
     * @param profileId
     */
    const deleteProfile = async (profileId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await profileService.deleteProfile(profileId);

            await loadProfiles();

            Alert.alert('Succès', 'Le compte a été supprimé avec succès');
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            Alert.alert('Erreur', 'Impossible de supprimer le compte');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    /** For admins
     * Update a user password with the API and returns the updated profiles
     * @param userId - the id of the user
     * @param newPassword - the new password typed by the admin
     */
    const updateUserPassword = async (userId: string, newPassword: string) => {
        try {
            setLoading(true);
            setError(null);

            return await profileService.updateUserPassword(userId, newPassword);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    /** For users looking to update their own password
     * update the password of a user in auth and return the updated profile
     * @param userId - the id of the profile
     * @param email - the email address of the user
     * @param oldPassword - the old password of the user
     * @param newPassword - the new password of the user
     */
    const updatePassword = async (userId: string, email: string, oldPassword: string, newPassword: string) => {
        try {
            setLoading(true);
            setError(null);

            return await profileService.updatePassword(userId, email, oldPassword, newPassword);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

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

    return { profile, loadProfile, updateProfile, createProfile, deleteProfile, profiles, loadProfiles, updatePassword, updateUserPassword, loading, error };
}