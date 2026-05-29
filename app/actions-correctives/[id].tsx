import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useActionCorrective } from '@/hooks/useActionCorrective';
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import { getStatutConfig } from '@/utils/actionsCorrectives';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatutStyle } from '@/utils/incidents';
import {useEffectiveAuth} from "@/hooks/useEffectiveAuth";

export default function ActionCorrectiveDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { actionCorrective, loadActionCorrective, loading: loadingAction, error: errorAction } = useActionCorrective();
    const { role, isLoading: loadingAuth, error: errorAuth } = useEffectiveAuth();

    useFocusEffect(
        useCallback(() => {
            loadActionCorrective(Number(id));
        }, [])
    );

    if (loadingAction || loadingAuth) {
        return <LoadingState message="Chargement de l'action corrective..." />;
    }

    if (errorAuth || errorAuth || !actionCorrective) {
        const error = errorAuth ?? errorAction ?? 'Une erreur est survenue';
        return <ErrorState error={error} onRetry={() => loadActionCorrective(Number(id))} />;
    }

    const { badge, color, label, icon } = getStatutConfig(actionCorrective.statut);
    const incidentStatut = actionCorrective.incidents
        ? getStatutStyle(actionCorrective.incidents.statut)
        : null;

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header */}
            <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={globalStyles.headerTitle}>Action Corrective</Text>
                </View>
            </View>

            {/* Card principale */}
            <View style={styles.mainCard}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <View style={[styles.iconWrapper, { backgroundColor: color }]}>
                        <Ionicons name={icon as any} size={36} color="#fff" />
                    </View>
                </View>

                <Text style={styles.actionId}>#{actionCorrective.id_action}</Text>

                {/* Badge statut */}
                <View style={[styles.statutBadge, { backgroundColor: color + '15' }]}>
                    <Ionicons name={icon as any} size={16} color={color} />
                    <Text style={[styles.statutText, { color: color }]}>
                        {label}
                    </Text>
                </View>
            </View>

            {/* Informations action corrective */}
            <View style={globalStyles.section}>
                <Text style={styles.sectionTitle}>Action corrective</Text>

                {/* Description */}
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Description</Text>
                        <Text style={styles.infoValue}>{actionCorrective.description}</Text>
                    </View>
                </View>

                {/* Responsable */}
                {actionCorrective.profiles && (
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="person-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Responsable</Text>
                            <Text style={styles.infoValue}>
                                {actionCorrective.profiles.prenom} {actionCorrective.profiles.nom}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Date de mise en place */}
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Date de mise en place</Text>
                        <Text style={styles.infoValue}>
                            {actionCorrective.date_mise_en_place
                                ? new Date(actionCorrective.date_mise_en_place).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })
                                : 'Non renseignée'}
                        </Text>
                    </View>
                </View>

                {/* Créé le */}
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="time-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Créée le</Text>
                        <Text style={styles.infoValue}>
                            {new Date(actionCorrective.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Contexte incident */}
            {actionCorrective.incidents && (
                <View style={globalStyles.section}>
                    <Text style={styles.sectionTitle}>Incident associé</Text>

                    {/* ID incident */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="finger-print-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Identifiant</Text>
                            <Text style={styles.infoValue}>#{actionCorrective.id_incident}</Text>
                        </View>
                    </View>

                    {/* Type d'incident */}
                    {actionCorrective.incidents.types_incidents && (
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Type d&apos;incident</Text>
                                <Text style={styles.infoValue}>
                                    {actionCorrective.incidents.types_incidents.libelle}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Description incident */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Description de l&apos;incident</Text>
                            <Text style={styles.infoValue}>{actionCorrective.incidents.description}</Text>
                        </View>
                    </View>

                    {/* Statut incident */}
                    {incidentStatut && (
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <Ionicons name="alert-circle-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Statut de l&apos;incident</Text>
                                <View style={[styles.incidentStatutBadge, { backgroundColor: incidentStatut.color + '15' }]}>
                                    <Text style={[styles.incidentStatutText, { color: incidentStatut.color }]}>
                                        {incidentStatut.label}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Boutons */}
            {role && ['admin', 'qualite'].includes(role) && (
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push(`/actions-correctives/${id}/update` as any)}
                    >
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.incidentButton}
                        onPress={() => router.push(`/incidents/${actionCorrective.id_incident}` as any)}
                    >
                        <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                        <Text style={[styles.incidentButtonText, { color: '#F59E0B' }]}>Voir l&apos;incident</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainCard: {
        backgroundColor: colors.surface,
        margin: 16,
        marginTop: 8,
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        padding: 4,
        borderRadius: 60,
        marginBottom: 16,
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionId: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    statutBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    statutText: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '30',
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        lineHeight: 22,
    },
    incidentStatutBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 2,
    },
    incidentStatutText: {
        fontSize: 13,
        fontWeight: '600',
    },
    actionsContainer: {
        padding: 16,
        gap: 12,
        marginBottom: 24,
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    incidentButton: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#F59E0B' + '40',
    },
    incidentButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
