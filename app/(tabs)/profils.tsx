// app/(tabs)/profils.tsx
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {globalStyles, colors} from '@/styles/theme';
import {useProfile} from "@/hooks/useProfile";
import {useCallback} from 'react';
import {useFocusEffect, useRouter} from "expo-router";
import {useAuth} from "@/contexts/AuthContext";
import LoadingState from "@/components/loading";
import ErrorState from "@/components/error";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { formatDateTime } from '@/utils/date';
import {getRoleBadgeStyle, getRoleLabel, getRoleIcon} from '@/utils/users';

export default function ProfilesScreen() {
    const router = useRouter();
    const {session} = useAuth();
    const {profiles, loading, error, loadProfiles, deleteProfile} = useProfile(session?.user?.id);

    useFocusEffect(
        useCallback(() => {
            loadProfiles();
        }, [])
    );

    const handleDelete = async (userId: string) => {
        Alert.alert(
            'Suppression de compte',
            'Voulez-vous vraiment supprimer ce compte ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProfile(userId);
                        } catch (err) {
                            console.error('Erreur lors de la suppression:', err);
                        }
                    }
                }
            ]
        );
    };

    // Afficher le loading
    if (loading) {
        return <LoadingState message="Chargement des profils..."/>;
    }

    // Afficher l'erreur
    if (error) {
        return <ErrorState error={error} onRetry={loadProfiles}/>;
    }

    return (
        <ScrollView style={globalStyles.container}>
            {/* Header Section */}
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Profils Utilisateurs</Text>
                <Text style={globalStyles.subtitle}>
                    {profiles.length} utilisateur{profiles.length > 1 ? 's' : ''} enregistré{profiles.length > 1 ? 's' : ''}
                </Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="people" size={28} color="#60A5FA"/>
                    <Text style={styles.statNumber}>{profiles.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>

                <View style={styles.statCard}>
                    <Ionicons name="shield-checkmark" size={28} color="#F59E0B"/>
                    <Text style={styles.statNumber}>
                        {profiles.filter(p => p.role === 'admin').length}
                    </Text>
                    <Text style={styles.statLabel}>Admins</Text>
                </View>

                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={28} color="#10B981"/>
                    <Text style={styles.statNumber}>
                        {profiles.filter(p => p.role === 'qualite').length}
                    </Text>
                    <Text style={styles.statLabel}>Qualité</Text>
                </View>
            </View>

            {/* Profiles List */}
            <View style={globalStyles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={globalStyles.sectionTitle}>Liste des utilisateurs</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/users/create')}
                    >
                        <Ionicons name="person-add" size={20} color="#fff"/>
                    </TouchableOpacity>
                </View>

                {profiles.map((profile) => (
                    <View key={profile.id} style={styles.profileCard}>
                        {/* Header avec rôle */}
                        <View style={globalStyles.spaceBetween}>
                            <View style={[styles.roleBadge, getRoleBadgeStyle(profile.role)]}>
                                <Ionicons
                                    name={getRoleIcon(profile.role) as any}
                                    size={14}
                                    color={colors.text}
                                    style={styles.roleIcon}
                                />
                                <Text style={styles.roleText}>{getRoleLabel(profile.role)}</Text>
                            </View>
                            <Text style={styles.dateText}>
                                {formatDateTime(profile.created_at)}
                            </Text>
                        </View>

                        {/* Nom et Prénom */}
                        <Text style={[globalStyles.cardTitle, globalStyles.mt8]}>
                            {profile.prenom} {profile.nom}
                        </Text>

                        {/* ID */}
                        <View style={styles.idContainer}>
                            <Ionicons name="key-outline" size={14} color={colors.textMuted}/>
                            <Text style={styles.idText} numberOfLines={1} ellipsizeMode="middle">
                                {profile.id}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => router.push(`/users/${profile.id}` as any)}
                            >
                                <Ionicons name="eye-outline" size={18} color="#60A5FA"/>
                                <Text style={styles.actionButtonText}>Voir</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => router.push(`/users/${profile.id}/update` as any)}
                            >
                                <Ionicons name="create-outline" size={18} color="#F59E0B"/>
                                <Text style={styles.actionButtonText}>Modifier</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => router.push(`/users/${profile.id}/update-password` as any)}
                            >
                                <Ionicons name="key-outline" size={18} color="#10b981"/>
                                <Text style={styles.actionButtonText}>Mot de passe</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleDelete(profile.id)}
                            >
                                <MaterialIcons name="delete-outline" size={18} color="#C32D2D"/>
                                <Text style={styles.actionButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {profiles.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color={colors.textMuted}/>
                        <Text style={styles.emptyText}>Aucun profil trouvé</Text>
                    </View>
                )}
            </View>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={24} color="#60A5FA"/>
                <Text style={styles.infoBannerText}>
                    Les profils sont synchronisés avec la base de données Supabase
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.textSecondary,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#FF6B6B',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
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
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
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

    // Profile Card
    profileCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },

    // Role Badge
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    roleIcon: {
        marginRight: 4,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
    },
    dateText: {
        fontSize: 12,
        color: colors.textMuted,
    },

    // ID
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
        flex: 1,
    },

    // Actions
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

    // Empty State
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16, // Pour garder l'espacement avec le contenu en dessous
    },
    addButton: {
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
});
