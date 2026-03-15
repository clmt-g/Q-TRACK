import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useActionCorrective } from '@/hooks/useActionCorrective';
import { useIncident } from '@/hooks/useIncident';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import { useState, useEffect, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native';

const STATUTS = [
    { value: 'prevue',   label: 'Prévue',   color: '#60A5FA', icon: 'calendar' },
    { value: 'en_cours', label: 'En cours', color: '#F59E0B', icon: 'time' },
    { value: 'terminee', label: 'Terminée', color: '#10B981', icon: 'checkmark-circle' },
] as const;

export default function ActionCorrectiveUpdateScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { actionCorrective, loadActionCorrective, updateActionCorrective, loading, error } = useActionCorrective();
    const { incidents, loadIncidents } = useIncident();

    const [description, setDescription] = useState('');
    const [statut, setStatut] = useState<'prevue' | 'en_cours' | 'terminee'>('prevue');
    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
    const [showIncidentList, setShowIncidentList] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            loadActionCorrective(Number(id));
            loadIncidents();
        }, [])
    );

    useEffect(() => {
        if (actionCorrective) {
            setDescription(actionCorrective.description);
            setStatut(actionCorrective.statut as 'prevue' | 'en_cours' | 'terminee');
            setSelectedIncidentId(actionCorrective.id_incident);
            if (actionCorrective.date_mise_en_place) {
                setDate(new Date(actionCorrective.date_mise_en_place));
            }
        }
    }, [actionCorrective]);

    const selectedIncident = incidents.find(i => i.id_incident === selectedIncidentId);

    const handleSave = async () => {
        if (!description.trim()) {
            Alert.alert('Erreur', 'La description est obligatoire');
            return;
        }

        if (!selectedIncidentId) {
            Alert.alert('Erreur', 'Veuillez sélectionner un incident');
            return;
        }

        if (!actionCorrective?.id_responsable) {
            Alert.alert('Erreur', 'Responsable introuvable');
            return;
        }

        try {
            setIsSaving(true);
            const result = await updateActionCorrective(
                Number(id),
                description.trim(),
                actionCorrective.id_responsable,
                statut,
                selectedIncidentId
            );

            if (result) {
                Alert.alert(
                    'Succès',
                    'Action corrective mise à jour avec succès',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            } else {
                Alert.alert('Erreur', 'Impossible de mettre à jour l\'action corrective');
            }
        } catch (err) {
            Alert.alert('Erreur', 'Impossible de mettre à jour l\'action corrective');
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

    if (error || !actionCorrective) {
        return <ErrorState error={error || 'Action corrective introuvable'} onRetry={() => loadActionCorrective(Number(id))} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={globalStyles.container} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                    <Text style={globalStyles.headerTitle}>Modifier l&apos;action corrective</Text>
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
                    <View style={[styles.iconWrapper, { backgroundColor: (STATUTS.find(s => s.value === statut)?.color ?? colors.primary) + '15' }]}>
                        <Ionicons
                            name="build"
                            size={36}
                            color={STATUTS.find(s => s.value === statut)?.color ?? colors.primary}
                        />
                    </View>
                    <Text style={styles.iconSubtitle}>
                        Modifiez les informations de cette action corrective
                    </Text>
                </View>

                <View style={globalStyles.section}>
                    <Text style={styles.sectionTitle}>Informations</Text>

                    {/* Incident */}
                    <TouchableOpacity
                        style={styles.inputContainer}
                        onPress={() => setShowIncidentList(!showIncidentList)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.inputIconContainer}>
                            <Ionicons name="warning-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Incident *</Text>
                            <Text style={[styles.selectValue, !selectedIncident && styles.selectPlaceholder]}>
                                {selectedIncident
                                    ? `#${selectedIncident.id_incident} — ${selectedIncident.types_incidents?.libelle ?? 'Sans type'}`
                                    : 'Sélectionner un incident'}
                            </Text>
                        </View>
                        <Ionicons
                            name={showIncidentList ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>

                    {/* Liste des incidents */}
                    {showIncidentList && (
                        <View style={styles.dropdownList}>
                            {incidents.map(incident => (
                                <TouchableOpacity
                                    key={incident.id_incident}
                                    style={[
                                        styles.dropdownOption,
                                        selectedIncidentId === incident.id_incident && styles.dropdownOptionSelected,
                                        incident.statut === 'cloture' && styles.dropdownOptionInactive,
                                    ]}
                                    onPress={() => {
                                        setSelectedIncidentId(incident.id_incident);
                                        setShowIncidentList(false);
                                    }}
                                >
                                    <View style={styles.dropdownOptionContent}>
                                        <Text style={[
                                            styles.dropdownOptionLabel,
                                            selectedIncidentId === incident.id_incident && styles.dropdownOptionLabelSelected,
                                            incident.statut === 'cloture' && styles.dropdownOptionLabelInactive,
                                        ]}>
                                            #{incident.id_incident} — {incident.types_incidents?.libelle ?? 'Sans type'}
                                            {incident.statut === 'cloture' ? ' (clôturé)' : ''}
                                        </Text>
                                        <Text style={styles.dropdownOptionDesc} numberOfLines={1}>
                                            {incident.description}
                                        </Text>
                                    </View>
                                    {selectedIncidentId === incident.id_incident && (
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
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[styles.input, styles.inputMultiline]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Décrivez l'action corrective..."
                                    placeholderTextColor={colors.textMuted}
                                    multiline
                                    numberOfLines={4}
                                    autoCapitalize="sentences"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Date de mise en place */}
                    <TouchableOpacity
                        style={styles.inputContainer}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <View style={styles.inputIconContainer}>
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Date de mise en place</Text>
                            <Text style={[styles.input, { paddingTop: 2 }]}>
                                {date.toLocaleDateString('fr-FR')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}
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
        minHeight: 80,
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
    dropdownList: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    dropdownOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    dropdownOptionSelected: {
        backgroundColor: colors.primary + '08',
    },
    dropdownOptionInactive: {
        opacity: 0.5,
    },
    dropdownOptionContent: {
        flex: 1,
    },
    dropdownOptionLabel: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
    dropdownOptionLabelSelected: {
        color: colors.primary,
        fontWeight: '700',
    },
    dropdownOptionLabelInactive: {
        fontStyle: 'italic',
    },
    dropdownOptionDesc: {
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
