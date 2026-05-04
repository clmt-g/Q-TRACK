import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useStats } from '@/hooks/useStats';
import { useCallback } from 'react';
import {router, useFocusEffect} from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STATUT_INCIDENT_COLORS, STATUT_ACTION_COLORS, STATUT_LABELS } from '@/constants/stats';
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';

function StatCard({ title, value, subtitle, icon, color }: {
    title: string;
    value: string;
    subtitle?: string;
    icon: string;
    color: string;
}) {
    return (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon as any} size={20} color={color} />
            </View>
            <View style={styles.statContent}>
                <Text style={styles.statTitle}>{title}</Text>
                <Text style={[styles.statValue, { color }]}>{value}</Text>
                {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    );
}

function SectionTitle({ title }: { title: string }) {
    return <Text style={styles.sectionTitle}>{title}</Text>;
}

function RateBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>{label}</Text>
            <View style={styles.rateBarContainer}>
                <View style={[styles.rateBar, { width: `${Math.min(value, 100)}%`, backgroundColor: color }]} />
            </View>
            <Text style={[styles.rateValue, { color }]}>{value.toFixed(1)}%</Text>
        </View>
    );
}

export default function StatsScreen() {
    const { stats, loading, error, loadStats } = useStats();
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [loadStats])
    );

    if (loading) return <LoadingState message="Chargement des statistiques..." />;
    if (error) return <ErrorState error={error} onRetry={loadStats} />;
    if (!stats) return null;

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header */}
            <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={globalStyles.headerTitle}>Statistiques</Text>
                        <Text style={globalStyles.subtitle}>Vue d&apos;ensemble de votre activité</Text>
                    </View>
                </View>
            </View>

            {/* Couverture incidents */}
            <View style={globalStyles.section}>
                <SectionTitle title="Couverture des incidents" />
                <View style={styles.coverageCard}>
                    <View style={styles.coverageCircle}>
                        <Text style={styles.coveragePercent}>{stats.incidentCoverage.toFixed(0)}%</Text>
                        <Text style={styles.coverageLabel}>couverts</Text>
                    </View>
                    <View style={styles.coverageInfo}>
                        <Text style={styles.coverageDesc}>
                            des incidents ont au moins une action corrective associée.
                        </Text>
                        <View style={styles.coverageBar}>
                            <View style={[styles.coverageFill, { width: `${Math.min(stats.incidentCoverage, 100)}%` }]} />
                        </View>
                    </View>
                </View>
            </View>

            {/* Moyennes incidents */}
            <View style={globalStyles.section}>
                <SectionTitle title="Incidents — Moyennes" />
                <StatCard
                    title="Par mois"
                    value={stats.averageIncidentsPerMonth.toFixed(1)}
                    subtitle="incidents en moyenne / mois"
                    icon="calendar-outline"
                    color={colors.primary}
                />
                <StatCard
                    title="Par an"
                    value={stats.averageIncidentsPerYear.toFixed(1)}
                    subtitle="incidents en moyenne / an"
                    icon="trending-up-outline"
                    color={colors.warning}
                />
                <StatCard
                    title="Par utilisateur"
                    value={stats.averageIncidentsPerUser.toFixed(1)}
                    subtitle="incidents en moyenne / utilisateur"
                    icon="person-outline"
                    color={colors.error}
                />
            </View>

            {/* Moyennes actions correctives */}
            <View style={globalStyles.section}>
                <SectionTitle title="Actions correctives — Moyennes" />
                <StatCard
                    title="Par mois"
                    value={stats.averageActionsCorrectivesPerMonth.toFixed(1)}
                    subtitle="actions en moyenne / mois"
                    icon="calendar-outline"
                    color={colors.primary}
                />
                <StatCard
                    title="Par an"
                    value={stats.averageActionsCorrectivesPerYear.toFixed(1)}
                    subtitle="actions en moyenne / an"
                    icon="trending-up-outline"
                    color={colors.warning}
                />
                <StatCard
                    title="Par utilisateur"
                    value={stats.averageActionsCorrectivesPerUser.toFixed(1)}
                    subtitle="actions en moyenne / utilisateur"
                    icon="person-outline"
                    color={colors.success}
                />
            </View>

            {/* Répartition incidents par statut */}
            <View style={globalStyles.section}>
                <SectionTitle title="Incidents par statut" />
                <View style={globalStyles.card}>
                    {Object.entries(stats.incidentStatutRate).map(([statut, rate]) => (
                        <RateBar
                            key={statut}
                            label={STATUT_LABELS[statut] ?? statut}
                            value={rate}
                            color={STATUT_INCIDENT_COLORS[statut] ?? colors.primary}
                        />
                    ))}
                </View>
            </View>

            {/* Répartition actions correctives par statut */}
            <View style={globalStyles.section}>
                <SectionTitle title="Actions correctives par statut" />
                <View style={globalStyles.card}>
                    {Object.entries(stats.actionCorrectiveStatutRate).map(([statut, rate]) => (
                        <RateBar
                            key={statut}
                            label={STATUT_LABELS[statut] ?? statut}
                            value={rate}
                            color={STATUT_ACTION_COLORS[statut] ?? colors.primary}
                        />
                    ))}
                </View>
            </View>

            {/* Incidents par type */}
            <View style={[globalStyles.section, { marginBottom: insets.bottom + 16 }]}>
                <SectionTitle title="Incidents par type" />
                <View style={globalStyles.card}>
                    {Object.entries(stats.incidentsAverageByType).map(([type, avg], index) => (
                        <RateBar
                            key={type}
                            label={type}
                            value={avg * 100}
                            color={[colors.primary, colors.warning, colors.success, colors.error][index % 4]}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 4,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statContent: {
        flex: 1,
    },
    statTitle: {
        fontSize: 13,
        color: colors.textMuted,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    statSubtitle: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 2,
    },
    coverageCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    coverageCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary + '20',
        borderWidth: 3,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    coveragePercent: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.primary,
    },
    coverageLabel: {
        fontSize: 10,
        color: colors.textMuted,
    },
    coverageInfo: {
        flex: 1,
    },
    coverageDesc: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 12,
        lineHeight: 18,
    },
    coverageBar: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    coverageFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    rateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 10,
    },
    rateLabel: {
        width: 80,
        fontSize: 13,
        color: colors.textSecondary,
    },
    rateBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    rateBar: {
        height: '100%',
        borderRadius: 4,
    },
    rateValue: {
        width: 48,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'right',
    },
});
