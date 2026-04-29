// app/profiles/[id].tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles/theme';
import { useProfile } from "@/hooks/useProfile";
import LoadingState from '@/components/loading';
import ErrorState from '@/components/error';
import {useSafeAreaInsets} from "react-native-safe-area-context";

// Fonction pour obtenir l'icône et la couleur selon le rôle
const getRoleConfig = (role: string) => {
    const configs: Record<string, { icon: any; color: string; gradient: string[] }> = {
        operateur: {
            icon: 'construct',
            color: '#3b82f6',
            gradient: ['#3b82f6', '#2563eb']
        },
        qualite: {
            icon: 'checkmark-circle',
            color: '#10b981',
            gradient: ['#10b981', '#059669']
        },
        admin: {
            icon: 'settings',
            color: '#8b5cf6',
            gradient: ['#8b5cf6', '#7c3aed']
        },
        direction: {
            icon: 'briefcase',
            color: '#f59e0b',
            gradient: ['#f59e0b', '#d97706']
        }
    };
    return configs[role] || configs.operateur;
};

export default function ProfileDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { profile, loading, error, loadProfile } = useProfile(id as string);

    if (loading) {
        return <LoadingState message="Chargement du profil..." />;
    }

    if (error || !profile) {
        return <ErrorState error={error || "Profil introuvable"} onRetry={loadProfile} />;
    }

    const roleConfig = getRoleConfig(profile.role);

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header avec bouton retour */}
            <View style={[globalStyles.header, { paddingTop: insets.top + 8 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={globalStyles.headerTitle}>Profile</Text>
                </View>
            </View>

            {/* Card principale avec avatar */}
            <View style={styles.profileCard}>
                <View style={[styles.avatarContainer, { backgroundColor: roleConfig.color + '20' }]}>
                    <View style={[styles.avatar, { backgroundColor: roleConfig.color }]}>
                        <Text style={styles.avatarText}>
                            {profile.prenom[0]}{profile.nom[0]}
                        </Text>
                    </View>
                </View>

                <Text style={styles.fullName}>
                    {profile.prenom} {profile.nom}
                </Text>

                {/* Badge rôle */}
                <View style={[styles.roleBadge, { backgroundColor: roleConfig.color + '15' }]}>
                    <Ionicons name={roleConfig.icon} size={16} color={roleConfig.color} />
                    <Text style={[styles.roleText, { color: roleConfig.color }]}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </Text>
                </View>
            </View>

            {/* Informations détaillées */}
            <View style={globalStyles.section}>
                <Text style={styles.sectionTitle}>Informations</Text>

                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Prénom</Text>
                        <Text style={styles.infoValue}>{profile.prenom}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Nom</Text>
                        <Text style={styles.infoValue}>{profile.nom}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="finger-print-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Identifiant</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                            {profile.id}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Membre depuis</Text>
                        <Text style={styles.infoValue}>
                            {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Bouton modifier */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push(`/users/${id}/update` as any)}
            >
                <Ionicons name="create-outline" size={20} color={colors.text} />
                <Text style={styles.editButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    profileCard: {
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
    avatarContainer: {
        padding: 4,
        borderRadius: 60,
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    fullName: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    roleText: {
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
        alignItems: 'center',
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
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: 16,
        margin: 16,
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
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
});
