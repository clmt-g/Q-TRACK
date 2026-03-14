import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useTypeIncident } from '@/hooks/useTypeIncident';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingState from '@/components/loading';
import ErrorState from "@/components/error";

export default function TypeIncidentCreateScreen() {
    const router = useRouter();
    const { createTypeIncident, loading, error } = useTypeIncident();

    const [libelle, setLibelle] = useState('');
    const [description, setDescription] = useState('');
    const [actif, setActif] = useState(true);

    const insets = useSafeAreaInsets();

    const handleCreate = async () => {
        if (!libelle.trim()) {
            Alert.alert('Erreur', 'Le libellé est obligatoire');
            return;
        }

        const result = await createTypeIncident(libelle.trim(), description.trim(), actif);

        if (result) {
            Alert.alert(
                'Succès',
                'Type d\'incident créé avec succès',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } else {
            Alert.alert('Erreur', 'Impossible de créer le type d\'incident');
        }
    };

    const handleCancel = () => {
        if (libelle || description) {
            Alert.alert(
                'Annuler',
                'Voulez-vous annuler la création ?',
                [
                    { text: 'Non', style: 'cancel' },
                    { text: 'Oui', onPress: () => router.back(), style: 'destructive' },
                ]
            );
        } else {
            router.back();
        }
    };

    if (loading) {
        return <LoadingState message="Enregistrement..." />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={() => router.back()} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={globalStyles.container} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                    <Text style={globalStyles.headerTitle}>Nouveau type</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ padding: 6 }} onPress={handleCreate}>
                            <Ionicons name="checkmark" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 6 }} onPress={handleCancel}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Icône centrale */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="pricetag" size={36} color={colors.primary} />
                    </View>
                    <Text style={styles.iconSubtitle}>
                        Définissez un nouveau type d&apos;incident qualité
                    </Text>
                </View>

                <View style={globalStyles.section}>
                    <Text style={styles.sectionTitle}>Informations</Text>

                    {/* Libellé */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIconContainer}>
                            <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Libellé *</Text>
                            <TextInput
                                style={styles.input}
                                value={libelle}
                                onChangeText={setLibelle}
                                placeholder="Ex: Non-conformité produit"
                                placeholderTextColor={colors.textMuted}
                                autoCapitalize="sentences"
                            />
                        </View>
                    </View>

                    {/* Description */}
                    <View style={[styles.inputContainer, styles.inputContainerMultiline]}>
                        <View style={styles.inputIconContainer}>
                            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.inputMultiline]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Décrivez ce type d'incident..."
                                placeholderTextColor={colors.textMuted}
                                multiline
                                numberOfLines={4}
                                autoCapitalize="sentences"
                            />
                        </View>
                    </View>

                    {/* Actif */}
                    <View style={styles.switchContainer}>
                        <View style={styles.switchLeft}>
                            <View style={styles.inputIconContainer}>
                                <Ionicons
                                    name={actif ? 'checkmark-circle-outline' : 'pause-circle-outline'}
                                    size={20}
                                    color={actif ? '#10B981' : '#F59E0B'}
                                />
                            </View>
                            <View>
                                <Text style={styles.switchLabel}>Actif</Text>
                                <Text style={styles.switchSubLabel}>
                                    {actif
                                        ? 'Disponible à la déclaration'
                                        : 'Non disponible à la déclaration'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={actif}
                            onValueChange={setActif}
                            trackColor={{ false: colors.border, true: '#10B981' + '80' }}
                            thumbColor={actif ? '#10B981' : colors.textMuted}
                        />
                    </View>
                </View>

                {/* Boutons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreate}>
                        <Ionicons name="add-circle-outline" size={20} color="#fff" />
                        <Text style={styles.createButtonText}>Créer le type</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
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
    inputContainerMultiline: {
        alignItems: 'flex-start',
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
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    switchLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    switchLabel: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    switchSubLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
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
