// hooks/usePasswordReset.ts
import { useState, useEffect } from 'react';
import * as Linking from 'expo-linking';
import { passwordResetService } from '@/services/PasswordResetService';

// ---------------------------------------------------------------------------
// Hook pour la page ForgotPassword — envoi de l'email
// ---------------------------------------------------------------------------
export function useForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const sendResetEmail = async (email: string) => {
        try {
            setLoading(true);
            await passwordResetService.sendResetEmail(email);
        } catch (err) {
            console.error('sendResetEmail error:', err instanceof Error ? err.message : err);
        } finally {
            setLoading(false);
            setSent(true);
        }
    };

    return { sendResetEmail, loading, sent };
}

// ---------------------------------------------------------------------------
// Hook pour la page ResetPassword — session deep link + mise à jour mdp
// ---------------------------------------------------------------------------
export function useResetPassword() {
    const [sessionReady, setSessionReady] = useState(false);
    const [sessionError, setSessionError] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    // Supabase recommande Linking.useLinkingURL() — gère cold start et warm start
    const url = Linking.useLinkingURL();

    useEffect(() => {
        // Bypass pour le dev
        if (process.env.EXPO_PUBLIC_DEV_SKIP_SESSION === 'true') {
            setSessionReady(true);
            setSessionLoading(false);
            return;
        }

        if (!url) return;

        // On traite uniquement les URLs de reset password
        if (!url.includes('reset-password')) return;

        const handleUrl = async () => {
            const ok = await passwordResetService.createSessionFromUrl(url);
            if (ok) {
                setSessionReady(true);
            } else {
                setSessionError(true);
            }
            setSessionLoading(false);
        };

        handleUrl();
    }, [url]);

    // Timeout de sécurité — si aucune URL reçue après 10s
    useEffect(() => {
        if (process.env.EXPO_PUBLIC_DEV_SKIP_SESSION === 'true') return;

        const timeout = setTimeout(() => {
            if (!sessionReady && !sessionError) {
                setSessionLoading(false);
                setSessionError(true);
            }
        }, 10000);

        return () => clearTimeout(timeout);
    }, [sessionReady, sessionError]);

    const updatePassword = async (newPassword: string) => {
        try {
            setLoading(true);
            setError(null);

            if (process.env.EXPO_PUBLIC_DEV_SKIP_SESSION === 'true') {
                await new Promise(resolve => setTimeout(resolve, 800));
                setDone(true);
                return;
            }

            await passwordResetService.updatePassword(newPassword);
            setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return { sessionReady, sessionError, sessionLoading, loading, error, done, updatePassword };
}
