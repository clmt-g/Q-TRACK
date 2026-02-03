// app/(tabs)/profile.tsx
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useFocusEffect, useRouter} from 'expo-router';
import { globalStyles, colors } from '@/styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import {useProfile} from "@/hooks/useProfile";
import {useCallback, useEffect} from "react";
import ErrorState from "@/components/error";
import LoadingState from "@/components/loading";

export default function ProfileScreen() {
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
            {/* Header */}
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Mon Profil</Text>
                <Text style={globalStyles.subtitle}>Gérez vos informations</Text>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={80} color={colors.primary} />
                </View>
                <Text style={styles.userName}>{`${profile?.nom} ${profile?.prenom}`}</Text>
                <Text style={styles.userEmail}>{session?.user?.email || 'Non connecté'}</Text>
            </View>

            {/* Info Section */}
            <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Informations du compte</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>ID Utilisateur</Text>
                            <Text style={styles.infoValue} numberOfLines={1}>
                                {session?.user?.id?.substring(0, 20)}...
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{session?.user?.email}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Membre depuis</Text>
                            <Text style={styles.infoValue}>
                                {session?.user?.created_at
                                    ? new Date(session.user.created_at).toLocaleDateString('fr-FR')
                                    : 'N/A'
                                }
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Actions Section */}
            <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Actions</Text>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="key-outline" size={24} color={colors.primary} />
                    <Text style={styles.actionButtonText}>Changer le mot de passe</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/users/${profile?.id}/update` as any)}
                >
                    <MaterialIcons name="update" size={24} color={colors.primary} />
                    <Text style={styles.actionButtonText}>Modifier le profil</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="notifications-outline" size={24} color={colors.primary} />
                    <Text style={styles.actionButtonText}>Notifications</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
                    <Text style={styles.logoutButtonText}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>

            {/* App Version */}
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>PharmaSanté v1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Profile Card
    profileCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 24,
        margin: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: colors.textSecondary,
    },

    // Info Card
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoContent: {
        flex: 1,
        marginLeft: 12,
    },
    infoLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
    },

    // Action Buttons
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionButtonText: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        marginLeft: 12,
    },

    // Logout
    logoutContainer: {
        padding: 16,
        marginTop: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        gap: 12,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF6B6B',
    },

    // Version
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    versionText: {
        fontSize: 12,
        color: colors.textMuted,
    },
});
