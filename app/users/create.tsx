// app/users/create.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useProfile } from "@/hooks/useProfile";
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingState from "@/components/loading";
import ErrorState from "@/components/error";

// Config pour les rôles disponibles
const ROLES = [
    { value: 'operateur', label: 'Opérateur', icon: 'construct', color: '#3b82f6' },
    { value: 'qualite', label: 'Qualité', icon: 'checkmark-circle', color: '#10b981' },
    { value: 'admin', label: 'Admin', icon: 'settings', color: '#8b5cf6' },
    { value: 'direction', label: 'Direction', icon: 'briefcase', color: '#f59e0b' },
] as const;

export default function ProfileCreateScreen() {
    const router = useRouter();
    const { createProfile, loading, error } = useProfile(undefined);

    // États locaux pour les champs du formulaire
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [role, setRole] = useState<'operateur' | 'qualite' | 'admin' | 'direction'>('operateur');
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const insets = useSafeAreaInsets();

    const handleCreate = async () => {
        // Validation
        if (!email.trim() || !password.trim() || !nom.trim() || !prenom.trim()) {
            Alert.alert('Erreur', 'Tous les champs sont obligatoires');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Erreur', 'Email invalide');
            return;
        }

        if (
            password.length < 12 ||
            !/[0-9]/.test(password) ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        ) {
            Alert.alert('Erreur', 'Le mot de passe doit être plus robuste ');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        const newProfile = await createProfile({
            email: email.trim().toLowerCase(),
            password: password,
            nom: nom.trim(),
            prenom: prenom.trim(),
            role: role,
        });

        if (newProfile) {
            Alert.alert(
                'Succès',
                'Utilisateur créé avec succès',
                [{
                    text: 'OK',
                    onPress: () => router.push('/profiles')
                }]
            );
        }
    };

    const handleCancel = () => {
        if (email || password || nom || prenom) {
            Alert.alert(
                'Annuler',
                'Voulez-vous annuler la création ?',
                [
                    { text: 'Non', style: 'cancel' },
                    { text: 'Oui', onPress: () => router.back(), style: 'destructive' }
                ]
            );
        } else {
            router.back();
        }
    };

    if (loading) {
        return <LoadingState message="Enregistrement des données" />;
    }

    if (error) {
        return <ErrorState error={error || "Erreur lors de l'enregistrement des données"} onRetry={router.back} />;
    }

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header */}
            <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                <Text style={globalStyles.headerTitle}>Nouvel utilisateur</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ padding: 6 }}
                        onPress={handleCreate}
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

            {/* Formulaire - Informations personnelles */}
            <View style={globalStyles.section}>
                <Text style={styles.sectionTitle}>Informations personnelles</Text>

                {/* Prénom */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Prénom *</Text>
                        <TextInput
                            style={styles.input}
                            value={prenom}
                            onChangeText={setPrenom}
                            placeholder="Ex: Jean"
                            placeholderTextColor={colors.textMuted}
                            autoCapitalize="words"
                        />
                    </View>
                </View>

                {/* Nom */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Nom *</Text>
                        <TextInput
                            style={styles.input}
                            value={nom}
                            onChangeText={setNom}
                            placeholder="Ex: Dupont"
                            placeholderTextColor={colors.textMuted}
                            autoCapitalize="words"
                        />
                    </View>
                </View>
            </View>

            {/* Formulaire - Informations de connexion */}
            <View style={globalStyles.section}>
                <Text style={styles.sectionTitle}>Informations de connexion</Text>

                {/* Email */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="mail-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Ex: jean.dupont@example.com"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                </View>

                {/* Mot de passe */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Mot de passe * (min. 6 caractères)</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor={colors.textMuted}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={colors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Confirmation mot de passe */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Confirmer le mot de passe *</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="••••••••"
                                placeholderTextColor={colors.textMuted}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={colors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Indicateur de correspondance */}
                {confirmPassword.length > 0 && (
                    <View style={styles.passwordMatch}>
                        <Ionicons
                            name={password === confirmPassword ? "checkmark-circle" : "close-circle"}
                            size={16}
                            color={password === confirmPassword ? '#10b981' : '#ef4444'}
                        />
                        <Text style={[
                            styles.passwordMatchText,
                            { color: password === confirmPassword ? '#10b981' : '#ef4444' }
                        ]}>
                            {password === confirmPassword
                                ? 'Les mots de passe correspondent'
                                : 'Les mots de passe ne correspondent pas'}
                        </Text>
                    </View>
                )}
            </View>

            {/* Sélection du rôle */}
            <View style={globalStyles.section}>
                <Text style={styles.sectionTitle}>Rôle *</Text>

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
                    style={[styles.button, styles.createButton]}
                    onPress={handleCreate}
                    disabled={isSaving}
                >
                    <Ionicons name="person-add-outline" size={20} color="#fff" />
                    <Text style={styles.createButtonText}>
                        {isSaving ? 'Création en cours...' : 'Créer l\'utilisateur'}
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
    },
    eyeIcon: {
        padding: 4,
    },
    passwordMatch: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: -8,
        marginBottom: 8,
        paddingHorizontal: 12,
    },
    passwordMatchText: {
        fontSize: 12,
        fontWeight: '500',
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
    createButton: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    createButtonText: {
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
