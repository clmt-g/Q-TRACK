// app/forgot-password.tsx
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useForgotPassword } from "@/hooks/usePasswordreset";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const router = useRouter();
    const { sendResetEmail, loading, sent } = useForgotPassword();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={globalStyles.container}
        >
            <View style={styles.container}>
                {/* Logo / Header */}
                <View style={styles.headerSection}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="medkit" size={60} color={colors.primary} />
                    </View>
                    <Text style={styles.title}>PharmaSanté</Text>
                    <Text style={styles.tagline}>Gestion Qualité</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={globalStyles.sectionTitle}>Mot de passe oublié</Text>

                    {!sent ? (
                        <>
                            <View style={styles.infoContainer}>
                                <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
                                <Text style={styles.infoText}>
                                    Entrez votre email. Si un compte existe, vous recevrez un lien valable 1 heure.
                                </Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor={colors.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    editable={!loading}
                                />
                            </View>

                            <TouchableOpacity
                                style={[globalStyles.button, (!email || loading) && { opacity: 0.5 }]}
                                onPress={() => sendResetEmail(email)}
                                disabled={!email || loading}
                            >
                                <Text style={globalStyles.buttonText}>
                                    {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.stateContainer}>
                            <View style={[styles.stateIconContainer, { borderColor: colors.success }]}>
                                <Ionicons name="mail" size={36} color={colors.success} />
                            </View>
                            <Text style={styles.stateTitle}>Email envoyé !</Text>
                            <Text style={styles.stateText}>
                                Si un compte est associé à cette adresse, vous recevrez un lien de réinitialisation dans quelques instants.
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" size={16} color={colors.primary} />
                        <Text style={styles.backButtonText}>Retour à la connexion</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBanner}>
                    <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                    <Text style={styles.infoBannerText}>Connexion sécurisée avec Supabase</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.primary + '44',
    },
    infoText: {
        color: colors.textSecondary,
        fontSize: 13,
        flex: 1,
        lineHeight: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 20,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
    },
    stateContainer: {
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 8,
    },
    stateIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
    },
    stateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    stateText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 8,
    },
    backButtonText: {
        color: colors.primary,
        fontSize: 14,
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
