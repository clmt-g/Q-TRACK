import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useIncident, Incident } from '@/hooks/useIncident';
import { useTypeIncident } from '@/hooks/useTypeIncident';
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import { getStatutStyle } from '@/utils/incidents';
import { formatDateTime } from '@/utils/date';
import {useEffectiveAuth} from "@/hooks/useEffectiveAuth";

// === Constants for the filters ===
// Statuts disponibles
const STATUTS = [
    { value: 'tous', label: 'Tous', color: colors.textMuted },
    { value: 'declare', label: 'Déclaré', color: '#60A5FA' },
    { value: 'en_cours', label: 'En cours', color: '#F59E0B' },
    { value: 'cloture', label: 'Clôturé', color: '#10B981' },
];

// Périodes disponibles
const PERIODES = [
    { value: 'tous', label: 'Tous' },
    { value: '1j', label: '1 jour' },
    { value: '1s', label: '1 semaine' },
    { value: '1m', label: '1 mois' },
    { value: '1a', label: '1 an' },
];

export default function IncidentsScreen() {
    const router = useRouter();
    const { incidents, loading: loadingIncident, error: errorIncident, loadIncidents, deleteIncident } = useIncident();
    const { typesIncidents, loadTypesIncidents, loading: loadingTypeIncident, error: errorTypeIncident } = useTypeIncident();
    const { role, session, isLoading: loadingAuth, error: errorAuth } = useEffectiveAuth();

    const [filtreStatut, setFiltreStatut] = useState('tous');
    const [filtreType, setFiltreType] = useState<number | 'tous'>('tous');
    const [filtrePeriode, setFiltrePeriode] = useState('tous');
    const [showFilters, setShowFilters] = useState(false);
    const [autres, setAutres] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadIncidents();
            loadTypesIncidents();
        }, [])
    );

    // === Filter functions ===
    const filterByPeriode = (incident: Incident) => {
        if (filtrePeriode === 'tous') return true;
        const now = new Date();
        const date = new Date(incident.date_declaration);
        const diff = now.getTime() - date.getTime();
        const ms = { '1j': 86400000, '1s': 604800000, '1m': 2592000000, '1a': 31536000000 };
        return diff <= (ms[filtrePeriode as keyof typeof ms] ?? Infinity);
    };

    // Apply the filters to the incidents list
    const typesConnus = new Set(typesIncidents.map(t => t.id_type_incident));

    const incidentsFiltres = incidents
        .filter(i => filtreStatut === 'tous' || i.statut === filtreStatut)
        .filter(i => {
            if (autres) return !typesConnus.has(i.id_type_incident);
            return filtreType === 'tous' || i.id_type_incident === filtreType;
        })
        .filter(filterByPeriode);

    const hasActiveFilters = filtreStatut !== 'tous' || filtreType !== 'tous' || filtrePeriode !== 'tous' || autres;
    const handleDelete = (id: number) => {
        Alert.alert(
            'Suppression',
            'Voulez-vous vraiment supprimer cet incident ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteIncident(id);
                        } catch (err) {
                            console.error('Erreur lors de la suppression:', err);
                        }
                    },
                },
            ]
        );
    };

    const resetFilters = () => {
        setFiltreStatut('tous');
        setFiltreType('tous');
        setFiltrePeriode('tous');
        setAutres(false);
    };

    if (loadingIncident || loadingTypeIncident || loadingAuth) {
        return <LoadingState message="Chargement des incidents..." />;
    }

    if (errorIncident || errorTypeIncident || errorAuth) {
        const error = errorAuth ?? errorIncident ?? errorTypeIncident ?? 'Une erreur inconnue est survenue';
        return <ErrorState error={error} onRetry={loadIncidents} />;
    }

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header */}
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Incidents</Text>
                <Text style={globalStyles.subtitle}>
                    {incidentsFiltres.length} incident{incidentsFiltres.length > 1 ? 's' : ''}
                    {hasActiveFilters ? ' (filtrés)' : ' enregistré' + (incidentsFiltres.length > 1 ? 's' : '')}
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="warning" size={28} color="#60A5FA" />
                    <Text style={styles.statNumber}>{incidents.filter(i => i.statut === 'declare').length}</Text>
                    <Text style={styles.statLabel}>Déclarés</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="time" size={28} color="#F59E0B" />
                    <Text style={styles.statNumber}>{incidents.filter(i => i.statut === 'en_cours').length}</Text>
                    <Text style={styles.statLabel}>En cours</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                    <Text style={styles.statNumber}>{incidents.filter(i => i.statut === 'cloture').length}</Text>
                    <Text style={styles.statLabel}>Clôturés</Text>
                </View>
            </View>

            {/* Barre filtres */}
            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Ionicons name="filter" size={18} color={showFilters ? '#fff' : colors.textSecondary} />
                    <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>
                        Filtres
                    </Text>
                    {hasActiveFilters && <View style={styles.filterDot} />}
                </TouchableOpacity>

                {hasActiveFilters && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                        <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                        <Text style={styles.resetButtonText}>Réinitialiser</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Panneau filtres */}
            {showFilters && (
                <View style={styles.filtersPanel}>
                    {/* Filtre statut */}
                    <Text style={styles.filterLabel}>Statut</Text>
                    <View style={styles.filterRow}>
                        {STATUTS.map(s => (
                            <TouchableOpacity
                                key={s.value}
                                style={[styles.filterChip, filtreStatut === s.value && { backgroundColor: s.color + '25', borderColor: s.color }]}
                                onPress={() => setFiltreStatut(s.value)}
                            >
                                <Text style={[styles.filterChipText, filtreStatut === s.value && { color: s.color }]}>
                                    {s.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Filtre type */}
                    <Text style={styles.filterLabel}>Type d&apos;incident</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.filterRow}>
                            <TouchableOpacity
                                style={[styles.filterChip, filtreType === 'tous' && !autres && styles.filterChipActive]}
                                onPress={() => { setFiltreType('tous'); setAutres(false); }}
                            >
                                <Text style={[styles.filterChipText, filtreType === 'tous' && !autres && styles.filterChipTextActive]}>
                                    Tous
                                </Text>
                            </TouchableOpacity>
                            {typesIncidents.filter(t => t.actif).map(t => (
                                <TouchableOpacity
                                    key={t.id_type_incident}
                                    style={[styles.filterChip, filtreType === t.id_type_incident && !autres && styles.filterChipActive]}
                                    onPress={() => { setFiltreType(t.id_type_incident); setAutres(false); }}
                                >
                                    <Text style={[styles.filterChipText, filtreType === t.id_type_incident && !autres && styles.filterChipTextActive]}>
                                        {t.libelle}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={[styles.filterChip, autres && styles.filterChipActive]}
                                onPress={() => {
                                    setAutres(!autres);
                                    setFiltreType('tous'); // reset le filtre type pour éviter les conflits
                                }}
                            >
                                <Text style={[styles.filterChipText, autres && styles.filterChipTextActive]}>
                                    Autres
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Filtre période */}
                    <Text style={styles.filterLabel}>Période</Text>
                    <View style={styles.filterRow}>
                        {PERIODES.map(p => (
                            <TouchableOpacity
                                key={p.value}
                                style={[styles.filterChip, filtrePeriode === p.value && styles.filterChipActive]}
                                onPress={() => setFiltrePeriode(p.value)}
                            >
                                <Text style={[styles.filterChipText, filtrePeriode === p.value && styles.filterChipTextActive]}>
                                    {p.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Liste */}
            <View style={globalStyles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={globalStyles.sectionTitle}>Liste des incidents</Text>

                    {role && ['admin', 'qualite', 'operateur'].includes(role) && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push('/incidents/create' as any)}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                {incidentsFiltres.map((incident) => {
                    const { badge, color, label, icon } = getStatutStyle(incident.statut);
                    return (
                        <View key={incident.id_incident} style={styles.card}>
                            {/* Header carte */}
                            <View style={globalStyles.spaceBetween}>
                                <View style={[styles.statutBadge, badge]}>
                                    <Ionicons name={icon as any} size={13} color={color} />
                                    <Text style={[styles.statutText, { color }]}>{label}</Text>
                                </View>
                                <Text style={styles.dateText}>{formatDateTime(incident.date_declaration)}</Text>
                            </View>

                            {/* Type d'incident */}
                            {incident.types_incidents && (
                                <View style={styles.typeContainer}>
                                    <Ionicons name="pricetag-outline" size={13} color={colors.textMuted} />
                                    <Text style={styles.typeText}>{incident.types_incidents.libelle}</Text>
                                </View>
                            )}

                            {/* Description */}
                            <Text style={[globalStyles.cardTitle, globalStyles.mt8]} numberOfLines={2}>
                                {incident.description}
                            </Text>

                            {/* ID */}
                            <View style={styles.idContainer}>
                                <Ionicons name="finger-print-outline" size={14} color={colors.textMuted} />
                                <Text style={styles.idText}>#{incident.id_incident}</Text>
                            </View>

                            {/* Actions */}
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => router.push(`/incidents/${incident.id_incident}` as any)}
                                >
                                    <Ionicons name="eye-outline" size={18} color="#60A5FA" />
                                    <Text style={styles.actionButtonText}>Voir</Text>
                                </TouchableOpacity>

                                {(
                                    (role && ['admin', 'qualite'].includes(role)) ||
                                    (incident.id_user === session?.user?.id)
                                ) && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => router.push(`/incidents/${incident.id_incident}/update` as any)}
                                    >
                                        <Ionicons name="create-outline" size={18} color="#F59E0B" />
                                        <Text style={styles.actionButtonText}>Modifier</Text>
                                    </TouchableOpacity>
                                )}

                                {role && ['admin', 'qualite'].includes(role) && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleDelete(incident.id_incident)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#C32D2D" />
                                        <Text style={styles.actionButtonText}>Supprimer</Text>
                                    </TouchableOpacity>
                                )}

                                {role && ['admin', 'qualite'].includes(role) && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => router.push(`/actions-correctives/create?id=${incident.id_incident}` as any)}
                                    >
                                        <Ionicons name="build-outline" size={18} color="#10B981" />
                                        <Text style={styles.actionButtonText}>Action corrective</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                })}

                {incidentsFiltres.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="warning-outline" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyText}>
                            {hasActiveFilters ? 'Aucun incident ne correspond aux filtres' : 'Aucun incident enregistré'}
                        </Text>
                        {hasActiveFilters && (
                            <TouchableOpacity style={styles.resetButtonLarge} onPress={resetFilters}>
                                <Text style={styles.resetButtonLargeText}>Réinitialiser les filtres</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={24} color="#60A5FA" />
                <Text style={styles.infoBannerText}>
                    Les incidents sont synchronisés avec la base de données Supabase
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 6,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 4,
    },

    // Filtres
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
        gap: 12,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterToggleActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterToggleText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    filterToggleTextActive: {
        color: '#fff',
    },
    filterDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#F59E0B',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    resetButtonText: {
        fontSize: 12,
        color: colors.textMuted,
    },
    filtersPanel: {
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 8,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: 4,
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: colors.primary + '25',
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    filterChipTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },

    // Section
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },

    // Card
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    statutBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        gap: 4,
    },
    statutText: {
        fontSize: 12,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 12,
        color: colors.textMuted,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 8,
    },
    typeText: {
        fontSize: 12,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    idText: {
        fontSize: 11,
        color: colors.textMuted,
        fontFamily: 'monospace',
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
        minWidth: '45%',
        flex: 1,
    },
    actionButtonText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
    },

    // Empty
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
    },
    resetButtonLarge: {
        marginTop: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    resetButtonLargeText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },

    // Banner
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#1E3A8A',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    infoBannerText: {
        flex: 1,
        fontSize: 14,
        color: '#BFDBFE',
    },
});
