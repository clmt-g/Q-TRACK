import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {globalStyles, colors} from '@/styles/theme';
import {useProfile} from '@/hooks/useProfile';
import {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import PasswordInput, {isPasswordValid} from '@/components/passwordInput';
import {useEffectiveAuth} from "@/hooks/useEffectiveAuth";

// Détermine si on est en mode admin (update d'un autre user) ou self (update de son propre mdp)
// En passant ?self=true dans les params on force le mode self
export default function UpdatePasswordScreen() {
    const router = useRouter();
    const {session} = useEffectiveAuth();
    const {id} = useLocalSearchParams<{ id: string }>();
    const isSelf = session?.user?.id === id;

    const {updatePassword, updateUserPassword, loading, error} = useProfile(id);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const insets = useSafeAreaInsets();

    const handleSave = async () => {
        if (isSelf && !currentPassword.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir votre mot de passe actuel');
            return;
        }

        if (!isPasswordValid(newPassword)) {
            Alert.alert('Erreur', 'Le nouveau mot de passe ne respecte pas les critères de sécurité');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        if (isSelf && currentPassword === newPassword) {
            Alert.alert('Erreur', 'Le nouveau mot de passe doit être différent de l\'ancien');
            return;
        }

        if (!session?.user?.email) {
            Alert.alert('Erreur', 'Session invalide, veuillez vous reconnecter');
            return;
        }

        try {
            if (isSelf) {
                await updatePassword(id, session?.user?.email, currentPassword, newPassword);
            } else {
                await updateUserPassword(id, newPassword);
            }

            Alert.alert(
                'Succès',
                'Mot de passe mis à jour avec succès',
                [{text: 'OK', onPress: () => router.back()}]
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            Alert.alert('Erreur', message);
        }
    };

    const handleCancel = () => {
        if (currentPassword || newPassword || confirmPassword) {
            Alert.alert(
                'Annuler',
                'Voulez-vous annuler les modifications ?',
                [
                    {text: 'Non', style: 'cancel'},
                    {text: 'Oui', onPress: () => router.back(), style: 'destructive'},
                ]
            );
        } else {
            router.back();
        }
    };

    if (loading) {
        return <LoadingState message="Mise à jour du mot de passe..."/>;
    }

    if (error) {
        return <ErrorState error={error || "Erreur lors de l'enregistrement des données"} onRetry={router.back}/>;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
        >
            <ScrollView
                style={globalStyles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={[globalStyles.header, {paddingTop: insets.top + 8}]}>
                    <Text style={globalStyles.headerTitle}>
                        {isSelf ? 'Mon mot de passe' : 'Modifier le mot de passe'}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={{padding: 6}} onPress={handleSave}>
                            <Ionicons name="checkmark" size={24} color={colors.primary}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding: 6}} onPress={handleCancel}>
                            <Ionicons name="close" size={24} color={colors.text}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Icône centrale */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="lock-closed" size={36} color={colors.primary}/>
                    </View>
                    <Text style={styles.iconSubtitle}>
                        {isSelf
                            ? 'Saisissez votre mot de passe actuel puis choisissez un nouveau mot de passe sécurisé'
                            : 'Définissez un nouveau mot de passe sécurisé pour cet utilisateur'}
                    </Text>
                </View>

                <View style={globalStyles.section}>
                    {/* Ancien mot de passe — seulement en mode self */}
                    {isSelf && (
                        <>
                            <Text style={styles.sectionTitle}>Vérification</Text>
                            <PasswordInput
                                label="Mot de passe actuel"
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                required
                            />
                        </>
                    )}

                    {/* Nouveau mot de passe */}
                    <Text style={[styles.sectionTitle, isSelf && {marginTop: 8}]}>
                        Nouveau mot de passe
                    </Text>
                    <PasswordInput
                        label="Nouveau mot de passe"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        showStrengthIndicator
                        required
                    />

                    {/* Confirmation */}
                    <PasswordInput
                        label="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        required
                    />

                    {/* Indicateur de correspondance */}
                    {confirmPassword.length > 0 && (
                        <View style={styles.matchRow}>
                            <Ionicons
                                name={newPassword === confirmPassword ? 'checkmark-circle' : 'close-circle'}
                                size={16}
                                color={newPassword === confirmPassword ? '#10b981' : '#ef4444'}
                            />
                            <Text style={[
                                styles.matchText,
                                {color: newPassword === confirmPassword ? '#10b981' : '#ef4444'}
                            ]}>
                                {newPassword === confirmPassword
                                    ? 'Les mots de passe correspondent'
                                    : 'Les mots de passe ne correspondent pas'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Boutons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSave}
                    >
                        <Ionicons name="lock-closed-outline" size={20} color="#fff"/>
                        <Text style={styles.saveButtonText}>Mettre à jour</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        marginVertical: 24,
        paddingHorizontal: 32,
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    iconSubtitle: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: -4,
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    matchText: {
        fontSize: 12,
        fontWeight: '500',
    },
    buttonContainer: {
        padding: 16,
        gap: 12,
        marginBottom: 24,
    },
    button: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    saveButton: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
});
