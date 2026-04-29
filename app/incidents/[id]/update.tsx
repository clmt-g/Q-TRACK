import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useIncident } from '@/hooks/useIncident';
import { useTypeIncident } from '@/hooks/useTypeIncident';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import { useState, useEffect, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { STATUTS } from '@/constants/incidents';

export default function IncidentUpdateScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { incidents, loadIncidents, updateIncident, loading, error } = useIncident();
    const { typesIncidents, loadTypesIncidents } = useTypeIncident();

    const [description, setDescription] = useState('');
    const [statut, setStatut] = useState<'declare' | 'en_cours' | 'cloture'>('declare');
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [showTypeList, setShowTypeList] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const insets = useSafeAreaInsets();

    const incident = incidents.find(i => i.id_incident === Number(id));
    const selectedType = typesIncidents.find(t => t.id_type_incident === selectedTypeId);

    useFocusEffect(
        useCallback(() => {
            loadTypesIncidents();
        }, [])
    );

    useEffect(() => {
        if (incident) {
            setDescription(incident.description);
            setStatut(incident.statut as 'declare' | 'en_cours' | 'cloture');
            setSelectedTypeId(incident.id_type_incident);
        }
    }, [incident]);

    const handleSave = async () => {
        if (!description.trim()) {
            Alert.alert('Erreur', 'La description est obligatoire');
            return;
        }

        if (!selectedTypeId) {
            Alert.alert('Erreur', 'Veuillez sélectionner un type d\'incident');
            return;
        }

        try {
            setIsSaving(true);
            const result = await updateIncident(Number(id), description.trim(), statut, selectedTypeId);

            if (result) {
                Alert.alert(
                    'Succès',
                    'Incident mis à jour avec succès',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            } else {
                Alert.alert('Erreur', 'Impossible de mettre à jour l\'incident');
            }
        } catch (err) {
            Alert.alert('Erreur', 'Impossible de mettre à jour l\'incident');
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

    if (error || !incident) {
        return <ErrorState error={error || 'Incident introuvable'} onRetry={loadIncidents} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={globalStyles.container} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                    <Text style={globalStyles.headerTitle}>Modifier l&apos;incident</Text>
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
                    <View style={[styles.iconWrapper, { backgroundColor: (STATUTS.find(s => s.value === statut)?.color ?? '#F59E0B') + '15' }]}>
                        <Ionicons
                            name="warning"
                            size={36}
                            color={STATUTS.find(s => s.value === statut)?.color ?? '#F59E0B'}
                        />
                    </View>
                    <Text style={styles.iconSubtitle}>
                        Modifiez les informations de cet incident
                    </Text>
                </View>

                <View style={globalStyles.section}>
                    <Text style={styles.sectionTitle}>Informations</Text>

                    {/* Type d'incident */}
                    <TouchableOpacity
                        style={styles.inputContainer}
                        onPress={() => setShowTypeList(!showTypeList)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.inputIconContainer}>
                            <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Type d&apos;incident *</Text>
                            <Text style={[styles.selectValue, !selectedType && styles.selectPlaceholder]}>
                                {selectedType ? selectedType.libelle : 'Sélectionner un type'}
                            </Text>
                        </View>
                        <Ionicons
                            name={showTypeList ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>

                    {/* Liste des types */}
                    {showTypeList && (
                        <View style={styles.typeList}>
                            {typesIncidents.map(type => (
                                <TouchableOpacity
                                    key={type.id_type_incident}
                                    style={[
                                        styles.typeOption,
                                        selectedTypeId === type.id_type_incident && styles.typeOptionSelected,
                                        !type.actif && styles.typeOptionInactive,
                                    ]}
                                    onPress={() => {
                                        setSelectedTypeId(type.id_type_incident);
                                        setShowTypeList(false);
                                    }}
                                >
                                    <Ionicons
                                        name="pricetag"
                                        size={16}
                                        color={selectedTypeId === type.id_type_incident ? colors.primary : colors.textMuted}
                                    />
                                    <View style={styles.typeOptionContent}>
                                        <Text style={[
                                            styles.typeOptionLabel,
                                            selectedTypeId === type.id_type_incident && styles.typeOptionLabelSelected,
                                            !type.actif && styles.typeOptionLabelInactive,
                                        ]}>
                                            {type.libelle}{!type.actif ? ' (inactif)' : ''}
                                        </Text>
                                        {type.description && (
                                            <Text style={styles.typeOptionDesc} numberOfLines={1}>
                                                {type.description}
                                            </Text>
                                        )}
                                    </View>
                                    {selectedTypeId === type.id_type_incident && (
                                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Description */}
                    <View style={[styles.inputContainer, styles.inputContainerMultiline]}>
                        <View style={styles.inputIconContainer}>
                            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Description *</Text>
                            <TextInput
                                style={[styles.input, styles.inputMultiline]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Décrivez l'incident..."
                                placeholderTextColor={colors.textMuted}
                                multiline
                                numberOfLines={5}
                                autoCapitalize="sentences"
                            />
                        </View>
                    </View>
                </View>

                {/* Statut */}
                <View style={globalStyles.section}>
                    <Text style={styles.sectionTitle}>Statut</Text>
                    {STATUTS.map(s => (
                        <TouchableOpacity
                            key={s.value}
                            style={[
                                styles.statutOption,
                                statut === s.value && { borderColor: s.color + '60', backgroundColor: s.color + '08' },
                            ]}
                            onPress={() => setStatut(s.value)}
                        >
                            <View style={[styles.statutIconContainer, { backgroundColor: s.color + '15' }]}>
                                <Ionicons name={s.icon as any} size={20} color={s.color} />
                            </View>
                            <Text style={[
                                styles.statutLabel,
                                statut === s.value && { color: s.color, fontWeight: '700' },
                            ]}>
                                {s.label}
                            </Text>
                            {statut === s.value && (
                                <Ionicons name="checkmark-circle" size={24} color={s.color} />
                            )}
                        </TouchableOpacity>
                    ))}
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
        minHeight: 100,
        textAlignVertical: 'top',
    },
    selectValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    selectPlaceholder: {
        color: colors.textMuted,
        fontWeight: '400',
    },
    typeList: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    typeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    typeOptionSelected: {
        backgroundColor: colors.primary + '08',
    },
    typeOptionInactive: {
        opacity: 0.5,
    },
    typeOptionContent: {
        flex: 1,
    },
    typeOptionLabel: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
    typeOptionLabelSelected: {
        color: colors.primary,
        fontWeight: '700',
    },
    typeOptionLabelInactive: {
        fontStyle: 'italic',
    },
    typeOptionDesc: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    statutOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    statutIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    statutLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
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
