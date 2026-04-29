import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useIncident } from '@/hooks/useIncident';
import { useTypeIncident } from '@/hooks/useTypeIncident';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import LoadingState from '@/components/loading';
import { STATUTS } from '@/constants/incidents';

export default function IncidentCreateScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const { createIncident, loading } = useIncident();
    const { typesIncidents, loadTypesIncidents } = useTypeIncident();

    const [description, setDescription] = useState('');
    const [statut, setStatut] = useState<'declare' | 'en_cours' | 'cloture'>('declare');
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [showTypeList, setShowTypeList] = useState(false);

    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            loadTypesIncidents();
        }, [])
    );

    const selectedType = typesIncidents.find(t => t.id_type_incident === selectedTypeId);

    const handleCreate = async () => {
        if (!description.trim()) {
            Alert.alert('Erreur', 'La description est obligatoire');
            return;
        }

        if (!selectedTypeId) {
            Alert.alert('Erreur', 'Veuillez sélectionner un type d\'incident');
            return;
        }

        if (!session?.user?.id) {
            Alert.alert('Erreur', 'Session invalide, veuillez vous reconnecter');
            return;
        }

        const result = await createIncident(description.trim(), statut, session.user.id, selectedTypeId);

        if (result) {
            Alert.alert(
                'Succès',
                'Incident déclaré avec succès',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } else {
            Alert.alert('Erreur', 'Impossible de créer l\'incident');
        }
    };

    const handleCancel = () => {
        if (description || selectedTypeId) {
            Alert.alert(
                'Annuler',
                'Voulez-vous annuler la déclaration ?',
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={globalStyles.container} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                    <Text style={globalStyles.headerTitle}>Déclarer un incident</Text>
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
                        <Ionicons name="warning" size={36} color="#F59E0B" />
                    </View>
                    <Text style={styles.iconSubtitle}>
                        Renseignez les informations de l&apos;incident qualité
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
                            {typesIncidents.filter(t => t.actif).map(type => (
                                <TouchableOpacity
                                    key={type.id_type_incident}
                                    style={[
                                        styles.typeOption,
                                        selectedTypeId === type.id_type_incident && styles.typeOptionSelected,
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
                                        ]}>
                                            {type.libelle}
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

                            {typesIncidents.filter(t => t.actif).length === 0 && (
                                <Text style={styles.emptyTypes}>Aucun type d&apos;incident disponible</Text>
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
                    <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreate}>
                        <Ionicons name="warning-outline" size={20} color="#fff" />
                        <Text style={styles.createButtonText}>Déclarer l&apos;incident</Text>
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
        backgroundColor: '#F59E0B' + '15',
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

    // Liste types
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
    typeOptionDesc: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    emptyTypes: {
        padding: 16,
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
    },

    // Statut
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

    // Boutons
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
        backgroundColor: '#F59E0B',
        shadowColor: '#F59E0B',
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
