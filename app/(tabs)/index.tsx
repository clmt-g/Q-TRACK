// app/(tabs)/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bonjour, Clément 👋</Text>
                <Text style={styles.subtitle}>PharmaSanté - Gestion Qualité</Text>
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
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions rapides</Text>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => {/* Navigation vers déclaration */}}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#1E3A8A15' }]}>
                        <Ionicons name="add-circle" size={28} color="#60A5FA" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Déclarer un incident</Text>
                        <Text style={styles.actionDescription}>
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
                        <Text style={styles.actionTitle}>Mes déclarations</Text>
                        <Text style={styles.actionDescription}>
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
                        <Text style={styles.actionTitle}>Actions correctives</Text>
                        <Text style={styles.actionDescription}>
                            Suivre les mesures en cours
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#555" />
                </TouchableOpacity>
            </View>

            {/* Recent Incidents */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Incidents récents</Text>

                <View style={styles.incidentCard}>
                    <View style={styles.incidentHeader}>
                        <View style={[styles.statusBadge, styles.statusDeclare]}>
                            <Text style={styles.statusText}>Déclaré</Text>
                        </View>
                        <Text style={styles.incidentDate}>Aujourd&#39;hui, 14:30</Text>
                    </View>
                    <Text style={styles.incidentTitle}>Non-conformité emballage Lot A2345</Text>
                    <Text style={styles.incidentType}>Type : Défaut emballage</Text>
                </View>

                <View style={styles.incidentCard}>
                    <View style={styles.incidentHeader}>
                        <View style={[styles.statusBadge, styles.statusEnCours]}>
                            <Text style={styles.statusText}>En cours</Text>
                        </View>
                        <Text style={styles.incidentDate}>Hier, 10:15</Text>
                    </View>
                    <Text style={styles.incidentTitle}>Température hors norme Zone 3</Text>
                    <Text style={styles.incidentType}>Type : Conditions de stockage</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A', // Dark background
    },
    header: {
        backgroundColor: '#1E293B', // Dark header avec gradient subtil
        padding: 24,
        paddingTop: 16,
        paddingBottom: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F1F5F9',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
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
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F1F5F9',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 4,
    },

    // Sections
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#F1F5F9',
        marginBottom: 12,
    },

    // Action Cards
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155',
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
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F1F5F9',
        marginBottom: 2,
    },
    actionDescription: {
        fontSize: 13,
        color: '#94A3B8',
    },

    // Incident Cards
    incidentCard: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#60A5FA',
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    incidentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
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
        color: '#F1F5F9',
    },
    incidentDate: {
        fontSize: 12,
        color: '#64748B',
    },
    incidentTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#F1F5F9',
        marginBottom: 4,
    },
    incidentType: {
        fontSize: 13,
        color: '#94A3B8',
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
