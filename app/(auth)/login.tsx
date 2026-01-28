// app/(tabs)/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            {/* Header Section with Gradient */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.welcomeText}>Bonjour, Clément 👋</Text>
                        <Text style={styles.subtitle}>Q-Track • Gestion Qualité</Text>
                    </View>
                    <View style={styles.logoContainer}>
                        <Ionicons name="shield-checkmark" size={32} color="#00D9FF" />
                    </View>
                </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <View style={[styles.statIconBg, { backgroundColor: '#FF6B6B20' }]}>
                        <Ionicons name="alert-circle" size={28} color="#FF6B6B" />
                    </View>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Incidents actifs</Text>
                </View>

                <View style={styles.statCard}>
                    <View style={[styles.statIconBg, { backgroundColor: '#51CF6620' }]}>
                        <Ionicons name="checkmark-circle" size={28} color="#51CF66" />
                    </View>
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
                    activeOpacity={0.7}
                >
                    <View style={[styles.actionIconContainer, { backgroundColor: '#00D9FF15' }]}>
                        <Ionicons name="add-circle" size={26} color="#00D9FF" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Déclarer un incident</Text>
                        <Text style={styles.actionDescription}>
                            Signaler un problème qualité rapidement
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => {/* Navigation vers historique */}}
                    activeOpacity={0.7}
                >
                    <View style={[styles.actionIconContainer, { backgroundColor: '#9775FA15' }]}>
                        <Ionicons name="list" size={26} color="#9775FA" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Mes déclarations</Text>
                        <Text style={styles.actionDescription}>
                            Consulter l&#39;historique de vos incidents
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => {/* Navigation vers actions correctives */}}
                    activeOpacity={0.7}
                >
                    <View style={[styles.actionIconContainer, { backgroundColor: '#FF922B15' }]}>
                        <Ionicons name="construct" size={26} color="#FF922B" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Actions correctives</Text>
                        <Text style={styles.actionDescription}>
                            Suivre les mesures en cours
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Recent Incidents */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Incidents récents</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Voir tout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.incidentCard}>
                    <View style={styles.incidentHeader}>
                        <View style={[styles.statusBadge, styles.statusDeclare]}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Déclaré</Text>
                        </View>
                        <Text style={styles.incidentDate}>14:30</Text>
                    </View>
                    <Text style={styles.incidentTitle}>Non-conformité emballage Lot A2345</Text>
                    <View style={styles.incidentFooter}>
                        <View style={styles.incidentTag}>
                            <Ionicons name="pricetag" size={12} color="#888" />
                            <Text style={styles.incidentType}>Défaut emballage</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.incidentCard}>
                    <View style={styles.incidentHeader}>
                        <View style={[styles.statusBadge, styles.statusEnCours]}>
                            <View style={[styles.statusDot, { backgroundColor: '#00D9FF' }]} />
                            <Text style={styles.statusText}>En cours</Text>
                        </View>
                        <Text style={styles.incidentDate}>Hier</Text>
                    </View>
                    <Text style={styles.incidentTitle}>Température hors norme Zone 3</Text>
                    <View style={styles.incidentFooter}>
                        <View style={styles.incidentTag}>
                            <Ionicons name="pricetag" size={12} color="#888" />
                            <Text style={styles.incidentType}>Conditions de stockage</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={22} color="#00D9FF" />
                <Text style={styles.infoBannerText}>
                    Besoin d&#39;aide ? Consultez le guide utilisateur
                </Text>
            </View>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E27',
    },
    header: {
        backgroundColor: '#131837',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#1E2347',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#00D9FF10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#8B92B2',
        letterSpacing: 0.5,
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        marginTop: 8,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#131837',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1E2347',
    },
    statIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#8B92B2',
        textAlign: 'center',
    },

    // Sections
    section: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    seeAllText: {
        fontSize: 14,
        color: '#00D9FF',
        fontWeight: '600',
    },

    // Action Cards
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#131837',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#1E2347',
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 3,
    },
    actionDescription: {
        fontSize: 12,
        color: '#8B92B2',
        lineHeight: 16,
    },

    // Incident Cards
    incidentCard: {
        backgroundColor: '#131837',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#00D9FF',
        borderWidth: 1,
        borderColor: '#1E2347',
    },
    incidentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF922B',
    },
    statusDeclare: {
        backgroundColor: '#FF922B15',
    },
    statusEnCours: {
        backgroundColor: '#00D9FF15',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    incidentDate: {
        fontSize: 11,
        color: '#666',
        fontWeight: '500',
    },
    incidentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
        lineHeight: 20,
    },
    incidentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    incidentTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#1E2347',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    incidentType: {
        fontSize: 11,
        color: '#8B92B2',
    },

    // Info Banner
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#00D9FF08',
        marginHorizontal: 16,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#00D9FF20',
    },
    infoBannerText: {
        flex: 1,
        fontSize: 13,
        color: '#8B92B2',
        lineHeight: 18,
    },
});
