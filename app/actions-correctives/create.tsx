import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useActionCorrective } from '@/hooks/useActionCorrective';
import { useIncident } from '@/hooks/useIncident';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import LoadingState from '@/components/loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import { STATUTS } from '@/constants/actionCorrectives';
import ErrorState from "@/components/error";

export default function ActionCorrectiveCreateScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const { createActionCorrective, loading, error } = useActionCorrective();
    const { incidents, loadIncidents } = useIncident();
    const { id } = useLocalSearchParams();
    const incidentId = id ? Number(id) : null;

    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [description, setDescription] = useState('');
    const [statut, setStatut] = useState<'prevue' | 'en_cours' | 'terminee'>('prevue');
    const [dateMiseEnPlace, setDateMiseEnPlace] = useState('');
    const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(incidentId);
    const [showIncidentList, setShowIncidentList] = useState(false);

    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            loadIncidents();
        }, [])
    );

    const selectedIncident = incidents.find(i => i.id_incident === selectedIncidentId);

    const handleCreate = async () => {
        if (!description.trim()) {
            Alert.alert('Erreur', 'La description est obligatoire');
            return;
        }

        if (!selectedIncidentId) {
            Alert.alert('Erreur', 'Veuillez sélectionner un incident');
            return;
        }

        if (!session?.user?.id) {
            Alert.alert('Erreur', 'Session invalide, veuillez vous reconnecter');
            return;
        }

        const result = await createActionCorrective(
            description.trim(),
            session.user.id,
            dateMiseEnPlace || new Date().toISOString(),
            statut,
            selectedIncidentId
        );

        if (result) {
            Alert.alert(
                'Succès',
                'Action corrective créée avec succès',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } else {
            Alert.alert('Erreur', 'Impossible de créer l\'action corrective');
        }
    };

    const handleCancel = () => {
        if (description || selectedIncidentId) {
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
        return <ErrorState error={error || 'Action corrective introuvable'} onRetry={() => router.back()} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={globalStyles.container} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                    <Text style={globalStyles.headerTitle}>Nouvelle action corrective</Text>
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
                        <Ionicons name="build" size={36} color={colors.primary} />
                    </View>
                    <Text style={styles.iconSubtitle}>
                        Définissez une action corrective pour résoudre un incident
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
                            {incidents.filter(i => i.statut !== 'cloture').map(incident => (
                                <TouchableOpacity
                                    key={incident.id_incident}
                                    style={[
                                        styles.dropdownOption,
                                        selectedIncidentId === incident.id_incident && styles.dropdownOptionSelected,
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
                                        ]}>
                                            #{incident.id_incident} — {incident.types_incidents?.libelle ?? 'Sans type'}
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

                            {incidents.filter(i => i.statut !== 'cloture').length === 0 && (
                                <Text style={styles.emptyDropdown}>Aucun incident actif disponible</Text>
                            )}
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
                                placeholder="Décrivez l'action corrective..."
                                placeholderTextColor={colors.textMuted}
                                multiline
                                numberOfLines={4}
                                autoCapitalize="sentences"
                            />
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
                    <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreate}>
                        <Ionicons name="build-outline" size={20} color="#fff" />
                        <Text style={styles.createButtonText}>Créer l&apos;action corrective</Text>
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
    dropdownOptionDesc: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    emptyDropdown: {
        padding: 16,
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
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
