// app/users/[id]/update.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useProfile } from "@/hooks/useProfile";
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROLES } from '@/constants/users';

export default function ProfileUpdateScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { profile, loadProfile, updateProfile, loading, error } = useProfile(id as string);

    // États locaux pour les champs du formulaire
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [role, setRole] = useState('');

    // desactiver le button enregistrer pendant la sauvegarde
    const [isSaving, setIsSaving] = useState(false);

    const insets = useSafeAreaInsets();

    // Charger les données du profil dans le formulaire
    useEffect(() => {
        if (profile) {
            setNom(profile.nom);
            setPrenom(profile.prenom);
            setRole(profile.role);
        }
    }, [profile]);

    const handleSave = async () => {
        // Validation
        if (!nom.trim() || !prenom.trim()) {
            Alert.alert('Erreur', 'Le nom et le prénom sont obligatoires');
            return;
        }

        try {
            setIsSaving(true);
            await updateProfile({
                nom: nom.trim(),
                prenom: prenom.trim(),
                role: role,
            });

            Alert.alert(
                'Succès',
                'Profil mis à jour avec succès',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (err) {
            Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        Alert.alert(
            'Annuler',
            'Voulez-vous annuler les modifications ?',
            [
                { text: 'Non', style: 'cancel' },
                { text: 'Oui', onPress: () => router.back(), style: 'destructive' }
            ]
        );
    };

    if (loading) {
        return <LoadingState message="Chargement du profil..." />;
    }

    if (error || !profile) {
        return <ErrorState error={error || "Profil introuvable"} onRetry={loadProfile} />;
    }

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header */}
            <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                <Text style={globalStyles.headerTitle}>Modifier le profil</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ padding: 6 }}
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        <Ionicons
                            name="checkmark"
                            size={24}
                            color={isSaving ? colors.textMuted : colors.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 6 }} onPress={handleCancel}>
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Avatar preview */}
            <View style={styles.avatarPreview}>
                <View style={[styles.avatar, { backgroundColor: ROLES.find(r => r.value === role)?.color || colors.primary }]}>
                    <Text style={styles.avatarText}>
                        {prenom[0]?.toUpperCase() || '?'}{nom[0]?.toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={styles.previewText}>Aperçu</Text>
            </View>

            {/* Formulaire */}
            <View style={globalStyles.section}>
                <Text style={styles.sectionTitle}>Informations personnelles</Text>

                {/* Prénom */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Prénom</Text>
                        <TextInput
                            style={styles.input}
                            value={prenom}
                            onChangeText={setPrenom}
                            placeholder="Entrez le prénom"
                            placeholderTextColor={colors.textMuted}
                        />
                    </View>
                </View>

                {/* Nom */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Nom</Text>
                        <TextInput
                            style={styles.input}
                            value={nom}
                            onChangeText={setNom}
                            placeholder="Entrez le nom"
                            placeholderTextColor={colors.textMuted}
                        />
                    </View>
                </View>
            </View>

            {/* Sélection du rôle */}
            <View style={globalStyles.section}>
                <Text style={styles.sectionTitle}>Rôle</Text>

                {ROLES.map((roleOption) => (
                    <TouchableOpacity
                        key={roleOption.value}
                        style={[
                            styles.roleOption,
                            role === roleOption.value && styles.roleOptionSelected
                        ]}
                        onPress={() => setRole(roleOption.value)}
                    >
                        <View style={[styles.roleIconContainer, { backgroundColor: roleOption.color + '15' }]}>
                            <Ionicons name={roleOption.icon as any} size={20} color={roleOption.color} />
                        </View>
                        <Text style={[
                            styles.roleLabel,
                            role === roleOption.value && styles.roleLabelSelected
                        ]}>
                            {roleOption.label}
                        </Text>
                        {role === roleOption.value && (
                            <Ionicons name="checkmark-circle" size={24} color={roleOption.color} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Boutons d'action */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    <Ionicons name="save-outline" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                    disabled={isSaving}
                >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    avatarPreview: {
        alignItems: 'center',
        marginVertical: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    previewText: {
        fontSize: 12,
        color: colors.textMuted,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    inputWrapper: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 4,
    },
    input: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        padding: 0,
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    roleOptionSelected: {
        borderColor: colors.primary + '40',
        backgroundColor: colors.primary + '05',
    },
    roleIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    roleLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    roleLabelSelected: {
        fontWeight: '700',
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
        shadowOffset: { width: 0, height: 4 },
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
