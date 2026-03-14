// app/(tabs)/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useFocusEffect, useRouter} from 'expo-router';
import { globalStyles, colors } from '@/styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { useProfile } from "@/hooks/useProfile";
import ErrorState from "@/components/error";
import LoadingState from "@/components/loading";
import {useCallback} from "react";

export default function HomeScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const { profile, loadProfile, loading, error } = useProfile(session?.user?.id);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    const handleLogout = async () => {
        Alert.alert(
            'Déconnexion',
            'Voulez-vous vraiment vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        await supabase.auth.signOut();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    // Afficher le loading
    if (loading) {
        return <LoadingState message="Chargement du profil..." />;
    }

    // Afficher l'erreur
    if (error) {
        return <ErrorState error={error} onRetry={loadProfile} />;
    }

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header Section */}
            <View style={globalStyles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerText}>
                        <Text style={globalStyles.headerTitle}>{`Bonjour, ${profile?.nom}`}</Text>
                        <Text style={globalStyles.subtitle}>PharmaSanté - Gestion Qualité</Text>
                    </View>

                    {/* Header Actions */}
                    <View style={styles.headerActions}>
                        {/* Bouton Profil */}
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.push('/users/profil' as any)}
                        >
                            <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
                        </TouchableOpacity>

                        {/* Bouton Logout */}
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={28} color="#FF6B6B" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="alert-circle" size={32} color="#FF6B6B" />
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Incidents actifs</Text>
                </View>

                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={32} color="#51CF66" />
                    <Text style={styles.statNumber}>45</Text>
                    <Text style={styles.statLabel}>Traités ce mois</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Actions rapides</Text>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => {/* Navigation vers déclaration */}}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#1E3A8A15' }]}>
                        <Ionicons name="add-circle" size={28} color="#60A5FA" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={globalStyles.cardTitle}>Déclarer un incident</Text>
                        <Text style={globalStyles.cardDescription}>
                            Signaler un problème qualité rapidement
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => {/* Navigation vers historique */}}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#7C3AED15' }]}>
                        <Ionicons name="list" size={28} color="#A78BFA" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={globalStyles.cardTitle}>Mes déclarations</Text>
                        <Text style={globalStyles.cardDescription}>
                            Consulter l&#39;historique de vos incidents
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => {/* Navigation vers actions correctives */}}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#EA580C15' }]}>
                        <Ionicons name="construct" size={28} color="#FB923C" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={globalStyles.cardTitle}>Actions correctives</Text>
                        <Text style={globalStyles.cardDescription}>
                            Suivre les mesures en cours
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#555" />
                </TouchableOpacity>
            </View>

            {/* Recent Incidents */}
            <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Incidents récents</Text>

                <View style={styles.incidentCard}>
                    <View style={globalStyles.spaceBetween}>
                        <View style={[styles.statusBadge, styles.statusDeclare]}>
                            <Text style={styles.statusText}>Déclaré</Text>
                        </View>
                        <Text style={styles.incidentDate}>Aujourd&#39;hui, 14:30</Text>
                    </View>
                    <Text style={[globalStyles.cardTitle, globalStyles.mt8]}>Non-conformité emballage Lot A2345</Text>
                    <Text style={globalStyles.cardDescription}>Type : Défaut emballage</Text>
                </View>

                <View style={styles.incidentCard}>
                    <View style={globalStyles.spaceBetween}>
                        <View style={[styles.statusBadge, styles.statusEnCours]}>
                            <Text style={styles.statusText}>En cours</Text>
                        </View>
                        <Text style={styles.incidentDate}>Hier, 10:15</Text>
                    </View>
                    <Text style={[globalStyles.cardTitle, globalStyles.mt8]}>Température hors norme Zone 3</Text>
                    <Text style={globalStyles.cardDescription}>Type : Conditions de stockage</Text>
                </View>
            </View>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={24} color="#60A5FA" />
                <Text style={styles.infoBannerText}>
                    Besoin d&#39;aide ? Consultez le guide utilisateur dans les paramètres
                </Text>
            </View>
        </ScrollView>
    );
}

// Styles spécifiques à cette page uniquement
const styles = StyleSheet.create({
    // Header
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerText: {
        flex: 1,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userEmail: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 8,
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        marginTop: 0,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 20,
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
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 4,
    },

    // Action Cards
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionContent: {
        flex: 1,
    },

    // Incident Cards
    incidentCard: {
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
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDeclare: {
        backgroundColor: '#92400E',
        borderWidth: 1,
        borderColor: '#D97706',
    },
    statusEnCours: {
        backgroundColor: '#1E3A8A',
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
    },
    incidentDate: {
        fontSize: 12,
        color: colors.textMuted,
    },

    // Info Banner
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
