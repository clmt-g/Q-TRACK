import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useTypeIncident } from '@/hooks/useTypeIncident';
import { useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';

export default function TypeIncidentsScreen() {
    const router = useRouter();
    const { typesIncidents, loading, error, loadIncidents } = useTypeIncident();

    useFocusEffect(
        useCallback(() => {
            loadIncidents();
        }, [])
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleDelete = (id: number, libelle: string) => {
        Alert.alert(
            'Suppression',
            `Voulez-vous vraiment supprimer le type "${libelle}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            Alert.alert("TODO")
                        } catch (err) {
                            console.error('Erreur lors de la suppression:', err);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return <LoadingState message="Chargement des types d'incidents..." />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={loadIncidents} />;
    }

    const actifs = typesIncidents.filter(t => t.actif).length;
    const inactifs = typesIncidents.filter(t => !t.actif).length;

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header */}
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Types d&apos;incidents</Text>
                <Text style={globalStyles.subtitle}>
                    {typesIncidents.length} type{typesIncidents.length > 1 ? 's' : ''} enregistré{typesIncidents.length > 1 ? 's' : ''}
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="pricetags" size={28} color="#60A5FA" />
                    <Text style={styles.statNumber}>{typesIncidents.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                    <Text style={styles.statNumber}>{actifs}</Text>
                    <Text style={styles.statLabel}>Actifs</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="pause-circle" size={28} color="#F59E0B" />
                    <Text style={styles.statNumber}>{inactifs}</Text>
                    <Text style={styles.statLabel}>Inactifs</Text>
                </View>
            </View>

            {/* Liste */}
            <View style={globalStyles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={globalStyles.sectionTitle}>Liste des types</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/type-incidents/create' as any)}
                    >
                        <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {typesIncidents.map((type) => (
                    <View key={type.id_type_incident} style={styles.card}>
                        {/* Header carte */}
                        <View style={globalStyles.spaceBetween}>
                            <View style={[styles.statusBadge, type.actif ? styles.statusActif : styles.statusInactif]}>
                                <Ionicons
                                    name={type.actif ? 'checkmark-circle' : 'pause-circle'}
                                    size={13}
                                    color={type.actif ? '#10B981' : '#F59E0B'}
                                />
                                <Text style={[styles.statusText, { color: type.actif ? '#10B981' : '#F59E0B' }]}>
                                    {type.actif ? 'Actif' : 'Inactif'}
                                </Text>
                            </View>
                            <Text style={styles.dateText}>{formatDate(type.created_at)}</Text>
                        </View>

                        {/* Libellé */}
                        <Text style={[globalStyles.cardTitle, globalStyles.mt8]}>{type.libelle}</Text>

                        {/* Description */}
                        {type.description && (
                            <Text style={styles.description} numberOfLines={2}>
                                {type.description}
                            </Text>
                        )}

                        {/* ID */}
                        <View style={styles.idContainer}>
                            <Ionicons name="finger-print-outline" size={14} color={colors.textMuted} />
                            <Text style={styles.idText}>#{type.id_type_incident}</Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => router.push(`/type-incidents/${type.id_type_incident}/update` as any)}
                            >
                                <Ionicons name="create-outline" size={18} color="#F59E0B" />
                                <Text style={styles.actionButtonText}>Modifier</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleDelete(type.id_type_incident, type.libelle)}
                            >
                                <Ionicons name="trash-outline" size={18} color="#C32D2D" />
                                <Text style={styles.actionButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {typesIncidents.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="pricetags-outline" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyText}>Aucun type d&apos;incident trouvé</Text>
                    </View>
                )}
            </View>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={24} color="#60A5FA" />
                <Text style={styles.infoBannerText}>
                    Les types inactifs ne sont plus proposés lors de la déclaration d&apos;un incident
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
        borderLeftColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        gap: 4,
    },
    statusActif: {
        backgroundColor: '#065F46',
        borderColor: '#10B981',
    },
    statusInactif: {
        backgroundColor: '#78350F',
        borderColor: '#F59E0B',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 12,
        color: colors.textMuted,
    },
    description: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 6,
        lineHeight: 18,
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
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.textMuted,
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
