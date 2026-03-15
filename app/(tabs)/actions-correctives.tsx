import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useActionCorrective } from '@/hooks/useActionCorrective';
import { useProfile } from '@/hooks/useProfile';
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import { ActionCorrective } from '@/services/ActionCorrectiveService';

const STATUTS = [
    { value: 'tous', label: 'Tous', color: colors.textMuted },
    { value: 'prevue', label: 'Prévue', color: '#60A5FA' },
    { value: 'en_cours', label: 'En cours', color: '#F59E0B' },
    { value: 'terminee', label: 'Terminée', color: '#10B981' },
];

const PERIODES = [
    { value: 'tous', label: 'Tous' },
    { value: '1j', label: '1 jour' },
    { value: '1s', label: '1 semaine' },
    { value: '1m', label: '1 mois' },
    { value: '1a', label: '1 an' },
];

export default function ActionsCorractivesScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const { actionsCorrectives, loading, error, loadActionsCorrectives, deleteActionCorrective } = useActionCorrective();
    const { profiles, loadProfiles } = useProfile(session?.user?.id);

    const [filtreStatut, setFiltreStatut] = useState('tous');
    const [filtreResponsable, setFiltreResponsable] = useState<string | 'tous'>('tous');
    const [filtreIncidentId, setFiltreIncidentId] = useState('');
    const [filtrePeriode, setFiltrePeriode] = useState('tous');
    const [showFilters, setShowFilters] = useState(false);
    const [showResponsableList, setShowResponsableList] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadActionsCorrectives();
            loadProfiles();
        }, [])
    );

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Non renseignée';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getStatutConfig = (statut: string) => {
        switch (statut) {
            case 'prevue':    return { badge: styles.statutPrevue,   color: '#60A5FA', label: 'Prévue',   icon: 'calendar' };
            case 'en_cours':  return { badge: styles.statutEnCours,  color: '#F59E0B', label: 'En cours', icon: 'time' };
            case 'terminee':  return { badge: styles.statutTerminee, color: '#10B981', label: 'Terminée', icon: 'checkmark-circle' };
            default:          return { badge: styles.statutPrevue,   color: '#60A5FA', label: statut,     icon: 'help-circle' };
        }
    };

    const filterByPeriode = (action: ActionCorrective) => {
        if (filtrePeriode === 'tous' || !action.date_mise_en_place) return true;
        const now = new Date();
        const date = new Date(action.date_mise_en_place);
        const diff = now.getTime() - date.getTime();
        const ms = { '1j': 86400000, '1s': 604800000, '1m': 2592000000, '1a': 31536000000 };
        return diff <= (ms[filtrePeriode as keyof typeof ms] ?? Infinity);
    };

    const actionsFiltrees = actionsCorrectives
        .filter(a => filtreStatut === 'tous' || a.statut === filtreStatut)
        .filter(a => filtreResponsable === 'tous' || a.id_responsable === filtreResponsable)
        .filter(a => filtreIncidentId === '' || a.id_incident === Number(filtreIncidentId))
        .filter(filterByPeriode);

    const hasActiveFilters = filtreStatut !== 'tous' || filtreResponsable !== 'tous' || filtreIncidentId !== '' || filtrePeriode !== 'tous';

    const resetFilters = () => {
        setFiltreStatut('tous');
        setFiltreResponsable('tous');
        setFiltreIncidentId('');
        setFiltrePeriode('tous');
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            'Suppression',
            'Voulez-vous vraiment supprimer cette action corrective ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteActionCorrective(id);
                        } catch (err) {
                            console.error('Erreur lors de la suppression:', err);
                        }
                    },
                },
            ]
        );
    };

    const selectedResponsable = profiles?.find(p => p.id === filtreResponsable);

    if (loading) {
        return <LoadingState message="Chargement des actions correctives..." />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={loadActionsCorrectives} />;
    }

    const prevues   = actionsCorrectives.filter(a => a.statut === 'prevue').length;
    const enCours   = actionsCorrectives.filter(a => a.statut === 'en_cours').length;
    const terminees = actionsCorrectives.filter(a => a.statut === 'terminee').length;

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header */}
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Actions correctives</Text>
                <Text style={globalStyles.subtitle}>
                    {actionsFiltrees.length} action{actionsFiltrees.length > 1 ? 's' : ''}
                    {hasActiveFilters ? ' (filtrées)' : ' enregistrée' + (actionsFiltrees.length > 1 ? 's' : '')}
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="calendar" size={28} color="#60A5FA" />
                    <Text style={styles.statNumber}>{prevues}</Text>
                    <Text style={styles.statLabel}>Prévues</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="time" size={28} color="#F59E0B" />
                    <Text style={styles.statNumber}>{enCours}</Text>
                    <Text style={styles.statLabel}>En cours</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                    <Text style={styles.statNumber}>{terminees}</Text>
                    <Text style={styles.statLabel}>Terminées</Text>
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

                    {/* Filtre responsable */}
                    <Text style={styles.filterLabel}>Responsable</Text>
                    <TouchableOpacity
                        style={styles.filterSelect}
                        onPress={() => setShowResponsableList(!showResponsableList)}
                    >
                        <Text style={[styles.filterSelectText, filtreResponsable === 'tous' && styles.filterSelectPlaceholder]}>
                            {filtreResponsable === 'tous'
                                ? 'Tous les responsables'
                                : `${selectedResponsable?.prenom} ${selectedResponsable?.nom}`}
                        </Text>
                        <Ionicons
                            name={showResponsableList ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>

                    {showResponsableList && (
                        <View style={styles.responsableList}>
                            <TouchableOpacity
                                style={[styles.responsableOption, filtreResponsable === 'tous' && styles.responsableOptionSelected]}
                                onPress={() => { setFiltreResponsable('tous'); setShowResponsableList(false); }}
                            >
                                <Text style={[styles.responsableOptionText, filtreResponsable === 'tous' && styles.responsableOptionTextSelected]}>
                                    Tous
                                </Text>
                            </TouchableOpacity>
                            {profiles?.map(p => (
                                <TouchableOpacity
                                    key={p.id}
                                    style={[styles.responsableOption, filtreResponsable === p.id && styles.responsableOptionSelected]}
                                    onPress={() => { setFiltreResponsable(p.id); setShowResponsableList(false); }}
                                >
                                    <Text style={[styles.responsableOptionText, filtreResponsable === p.id && styles.responsableOptionTextSelected]}>
                                        {p.prenom} {p.nom}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Filtre incident id */}
                    <Text style={styles.filterLabel}>ID Incident</Text>
                    <View style={styles.filterInputContainer}>
                        <Ionicons name="search-outline" size={16} color={colors.textMuted} />
                        <TextInput
                            style={styles.filterInput}
                            value={filtreIncidentId}
                            onChangeText={setFiltreIncidentId}
                            placeholder="Ex: 42"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="numeric"
                        />
                        {filtreIncidentId !== '' && (
                            <TouchableOpacity onPress={() => setFiltreIncidentId('')}>
                                <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Filtre période */}
                    <Text style={styles.filterLabel}>Date de mise en place</Text>
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
                    <Text style={globalStyles.sectionTitle}>Liste des actions</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/actions-correctives/create' as any)}
                    >
                        <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {actionsFiltrees.map((action) => {
                    const statut = getStatutConfig(action.statut);
                    return (
                        <View key={action.id_action} style={[styles.card, { borderLeftColor: statut.color }]}>
                            {/* Header carte */}
                            <View style={globalStyles.spaceBetween}>
                                <View style={[styles.statutBadge, statut.badge]}>
                                    <Ionicons name={statut.icon as any} size={13} color={statut.color} />
                                    <Text style={[styles.statutText, { color: statut.color }]}>{statut.label}</Text>
                                </View>
                                <Text style={styles.dateText}>{formatDate(action.date_mise_en_place)}</Text>
                            </View>

                            {/* Contexte incident */}
                            {action.incidents && (
                                <View style={styles.incidentContext}>
                                    <Ionicons name="warning-outline" size={13} color={colors.textMuted} />
                                    <Text style={styles.incidentContextText}>
                                        Incident #{action.id_incident}
                                        {action.incidents.types_incidents
                                            ? ` — ${action.incidents.types_incidents.libelle}`
                                            : ''}
                                    </Text>
                                </View>
                            )}

                            {/* Description */}
                            <Text style={[globalStyles.cardTitle, globalStyles.mt8]} numberOfLines={2}>
                                {action.description}
                            </Text>

                            {/* Responsable */}
                            {action.profiles && (
                                <View style={styles.responsableContainer}>
                                    <Ionicons name="person-outline" size={14} color={colors.textMuted} />
                                    <Text style={styles.responsableText}>
                                        {action.profiles.prenom} {action.profiles.nom}
                                    </Text>
                                </View>
                            )}

                            {/* Actions */}
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => router.push(`/actions-correctives/${action.id_action}` as any)}
                                >
                                    <Ionicons name="eye-outline" size={18} color="#60A5FA" />
                                    <Text style={styles.actionButtonText}>Voir</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => router.push(`/actions-correctives/${action.id_action}/update` as any)}
                                >
                                    <Ionicons name="create-outline" size={18} color="#F59E0B" />
                                    <Text style={styles.actionButtonText}>Modifier</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleDelete(action.id_action)}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#C32D2D" />
                                    <Text style={styles.actionButtonText}>Supprimer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}

                {actionsFiltrees.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="build-outline" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyText}>
                            {hasActiveFilters ? 'Aucune action ne correspond aux filtres' : 'Aucune action corrective enregistrée'}
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
                    Les actions correctives sont synchronisées avec la base de données Supabase
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
    filterSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterSelectText: {
        fontSize: 13,
        color: colors.text,
    },
    filterSelectPlaceholder: {
        color: colors.textMuted,
    },
    responsableList: {
        backgroundColor: colors.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    responsableOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    responsableOptionSelected: {
        backgroundColor: colors.primary + '15',
    },
    responsableOptionText: {
        fontSize: 13,
        color: colors.text,
    },
    responsableOptionTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    filterInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 8,
    },
    filterInput: {
        flex: 1,
        fontSize: 13,
        color: colors.text,
        padding: 0,
    },
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
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
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
    statutPrevue: {
        backgroundColor: '#1E3A8A',
        borderColor: '#60A5FA',
    },
    statutEnCours: {
        backgroundColor: '#78350F',
        borderColor: '#F59E0B',
    },
    statutTerminee: {
        backgroundColor: '#065F46',
        borderColor: '#10B981',
    },
    statutText: {
        fontSize: 12,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 12,
        color: colors.textMuted,
    },
    incidentContext: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 8,
    },
    incidentContextText: {
        fontSize: 12,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    responsableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
    },
    responsableText: {
        fontSize: 12,
        color: colors.textMuted,
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
    },
    actionButtonText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
    },
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
