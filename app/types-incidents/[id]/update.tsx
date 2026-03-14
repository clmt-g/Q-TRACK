import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useTypeIncident } from '@/hooks/useTypeIncident';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TypeIncidentUpdateScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { typesIncidents, loadTypesIncidents, updateTypeIncident, loading, error } = useTypeIncident();

    const [libelle, setLibelle] = useState('');
    const [description, setDescription] = useState('');
    const [actif, setActif] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const insets = useSafeAreaInsets();

    const typeIncident = typesIncidents.find(t => t.id_type_incident === Number(id));

    useEffect(() => {
        if (typeIncident) {
            setLibelle(typeIncident.libelle);
            setDescription(typeIncident.description || '');
            setActif(typeIncident.actif);
        }
    }, [typeIncident]);

    const handleSave = async () => {
        if (!libelle.trim()) {
            Alert.alert('Erreur', 'Le libellé est obligatoire');
            return;
        }

        try {
            setIsSaving(true);
            const result = await updateTypeIncident(Number(id), libelle.trim(), description.trim(), actif);

            if (result) {
                Alert.alert(
                    'Succès',
                    'Type d\'incident mis à jour avec succès',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            } else {
                Alert.alert('Erreur', 'Impossible de mettre à jour le type d\'incident');
            }
        } catch (err) {
            Alert.alert('Erreur', 'Impossible de mettre à jour le type d\'incident');
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
                { text: 'Oui', onPress: () => router.back(), style: 'destructive' },
            ]
        );
    };

    if (loading) {
        return <LoadingState message="Chargement..." />;
    }

    if (error || !typeIncident) {
        return <ErrorState error={error || 'Type d\'incident introuvable'} onRetry={loadTypesIncidents} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={globalStyles.container} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                    <Text style={globalStyles.headerTitle}>Modifier le type</Text>
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

                {/* Icône centrale */}
                <View style={styles.iconContainer}>
                    <View style={[styles.iconWrapper, { backgroundColor: actif ? '#10B981' + '15' : '#F59E0B' + '15' }]}>
                        <Ionicons
                            name="pricetag"
                            size={36}
                            color={actif ? '#10B981' : '#F59E0B'}
                        />
                    </View>
                    <Text style={styles.iconSubtitle}>
                        Modifiez les informations de ce type d&apos;incident
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
