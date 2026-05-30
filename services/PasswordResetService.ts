// services/PasswordResetService.ts
import { supabase } from '@/utils/supabase';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

class PasswordResetService {

    /**
     * Envoie un email de réinitialisation de mot de passe.
     */
    async sendResetEmail(email: string): Promise<void> {
        const redirectTo = Linking.createURL('/reset-password');
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw new Error(error.message);
    }

    /**
     * Crée une session Supabase à partir de l'URL du deep link.
     */
    async createSessionFromUrl(url: string): Promise<boolean> {
        const { params, errorCode } = QueryParams.getQueryParams(url);
        if (errorCode) return false;

        const { access_token, refresh_token } = params;
        if (!access_token) return false;

        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        return !error;
    }

    /**
     * Met à jour le mot de passe de l'utilisateur connecté.
     */
    async updatePassword(newPassword: string): Promise<void> {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw new Error(error.message);
    }
}

export const passwordResetService = new PasswordResetService();
