// app/reset-password.tsx
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import PasswordInput, { isPasswordValid } from '@/components/passwordInput';
import { useResetPassword } from "@/hooks/usePasswordreset";
import LoadingState from "@/components/loading";
import ErrorState from "@/components/error";

export default function ResetPasswordScreen() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const router = useRouter();

    const { sessionReady, sessionError, sessionLoading, loading, error, done, updatePassword } = useResetPassword();

    useEffect(() => {
        if (done) {
            const timer = setTimeout(() => router.replace('/login'), 2500);
            return () => clearTimeout(timer);
        }
    }, [done]);

    const passwordsMatch = password === confirm && confirm.length > 0;
    const canSubmit = isPasswordValid(password) && passwordsMatch && sessionReady && !loading;

    // État : chargement de la session
    if (sessionLoading) {
        return <LoadingState message="Vérification du lien..." />;
    }

    // État : lien expiré ou invalide
    if (sessionError) {
        return (
            <ErrorState
                error="Lien invalide ou expiré. Ce lien n'est valable que 1 heure."
                onRetry={() => router.replace('/forgot-password')}
                retryButtonText="Nouvelle demande"
            />
        );
    }

    // État : mot de passe modifié avec succès
    if (done) {
        return <LoadingState message="Mot de passe modifié ! Redirection..." />;
    }

    // État principal : formulaire
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={globalStyles.container}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerSection}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="medkit" size={60} color={colors.primary} />
                    </View>
                    <Text style={styles.title}>PharmaSanté</Text>
                    <Text style={styles.tagline}>Gestion Qualité</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={globalStyles.sectionTitle}>Nouveau mot de passe</Text>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <PasswordInput
                        label="Nouveau mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        showStrengthIndicator
                        required
                    />

                    <PasswordInput
                        label="Confirmer le mot de passe"
                        value={confirm}
                        onChangeText={setConfirm}
                        required
                    />

                    {confirm.length > 0 && (
                        <View style={styles.passwordMatch}>
                            <Ionicons
                                name={passwordsMatch ? 'checkmark-circle' : 'close-circle'}
                                size={16}
                                color={passwordsMatch ? colors.success : colors.error}
                            />
                            <Text style={[styles.passwordMatchText, { color: passwordsMatch ? colors.success : colors.error }]}>
                                {passwordsMatch
                                    ? 'Les mots de passe correspondent'
                                    : 'Les mots de passe ne correspondent pas'}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[globalStyles.button, { marginTop: 16 }, !canSubmit && { opacity: 0.5 }]}
                        onPress={() => updatePassword(password)}
                        disabled={!canSubmit}
                    >
                        <Text style={globalStyles.buttonText}>
                            {loading ? 'Enregistrement...' : 'Modifier le mot de passe'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBanner}>
                    <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                    <Text style={styles.infoBannerText}>Connexion sécurisée avec Supabase</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    tagline: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    formContainer: {
        marginBottom: 24,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: 13,
        flex: 1,
    },
    passwordMatch: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: -8,
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    passwordMatchText: {
        fontSize: 12,
        fontWeight: '500',
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
        padding: 12,
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    infoBannerText: {
        color: colors.textSecondary,
        fontSize: 13,
    },
});
