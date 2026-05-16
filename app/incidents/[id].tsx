import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useIncident } from '@/hooks/useIncident';
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import { getStatutStyle } from '@/utils/incidents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useAuth} from "@/contexts/AuthContext";
import {usePdf} from "@/hooks/usePdf";

export default function IncidentDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { incident, loadIncident, loading: loadingIncident, error: errorIncident } = useIncident();
    const { role, session, isLoading: loadingAuth, error: errorAuth } = useAuth();
    const { generateReport, error: errorPdf, loading: loadingPdf } = usePdf();

    useFocusEffect(
        useCallback(() => {
            loadIncident(Number(id));
        }, [])
    );

    if (loadingAuth || loadingIncident || loadingPdf) {
        return <LoadingState message="Chargement de l'incident..." />;
    }

    if (!incident) {
        return <LoadingState message="Chargement de l'incident..." />;
    }

    if (errorIncident || errorAuth || errorPdf) {
        const error = errorPdf ?? errorIncident ?? errorAuth ?? "Un incident est survenue";
        return <ErrorState error={error} onRetry={() => router.back()} />;
    }

    const { badge, color, label, icon } = getStatutStyle(incident.statut);

    /**
     * Gère le téléchargement du rapport PDF de l'incident
     */
    const handleDownload = async () => {
        Alert.alert(
            'Télécharger le rapport',
            `Voulez-vous télécharger le rapport de l'incident #${incident.id_incident} ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Télécharger', onPress: () => generateReport(incident.id_incident) },
            ]
        );
    };

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header */}
            <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={globalStyles.headerTitle}>Incident</Text>
                </View>
            </View>

            {/* Card principale */}
            <View style={styles.incidentCard}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <View style={[styles.iconWrapper, { backgroundColor: color }]}>
                        <Ionicons name={icon as any} size={36} color="#fff" />
                    </View>
                </View>

                <Text style={styles.incidentId}>#{incident.id_incident}</Text>

                {/* Badge statut */}
                <View style={[styles.statutBadge, { backgroundColor: color + '15' }]}>
                    <Ionicons name={icon as any} size={16} color={color} />
                    <Text style={[styles.statutText, { color: color }]}>
                        {label}
                    </Text>
                </View>
            </View>

            {/* Informations */}
            <View style={globalStyles.section}>
                <Text style={styles.sectionTitle}>Informations</Text>

                {/* Type d'incident */}
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Type d&apos;incident</Text>
                        <Text style={styles.infoValue}>
                            {incident.types_incidents?.libelle ?? 'Non renseigné'}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Description</Text>
                        <Text style={styles.infoValue}>{incident.description}</Text>
                    </View>
                </View>

                {/* Date de déclaration */}
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Déclaré le</Text>
                        <Text style={styles.infoValue}>
                            {new Date(incident.date_declaration).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                </View>

                {/* User */}
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="finger-print-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Utilisateur</Text>
                        <Text style={styles.infoValue}>{incident.profiles?.nom} {incident.profiles?.prenom}</Text>
                    </View>
                </View>

                {/* ID */}
                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="finger-print-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Identifiant</Text>
                        <Text style={styles.infoValue}>#{incident.id_incident}</Text>
                    </View>
                </View>
            </View>

            {/* Boutons */}
            <View style={styles.actionsContainer}>
                {(
                    (role && ['admin', 'qualite'].includes(role)) ||
                    (incident.id_user === session?.user?.id)
                ) && (
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push(`/incidents/${id}/update` as any)}
                    >
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>
                )}

                {role && ['admin', 'qualite'].includes(role) && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push(`/actions-correctives/create?id=${incident.id_incident}` as any)}
                    >
                        <Ionicons name="build-outline" size={20} color="#10B981" />
                        <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Action corrective</Text>
                    </TouchableOpacity>
                )}

                {role && ['admin', 'qualite'].includes(role) && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleDownload}
                        disabled={loadingPdf}
                    >
                        <Ionicons name="download-outline" size={20} color="#00D9FF" />
                        <Text style={[styles.actionButtonText, { color: '#00D9FF' }]}>
                            {loadingPdf ? 'Génération...' : 'Envoyer le rapport PDF'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    incidentCard: {
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
    incidentId: {
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
    },
    infoLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        lineHeight: 22,
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
    actionButton: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#10B981' + '40',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
