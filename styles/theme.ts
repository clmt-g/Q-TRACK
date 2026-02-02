// styles/globalStyles.ts
import { StyleSheet } from 'react-native';

// Couleurs de votre thème dark
export const colors = {
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#60A5FA',
    success: '#51CF66',
    warning: '#FB923C',
    error: '#FF6B6B',
};

// Styles globaux réutilisables
export const globalStyles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    section: {
        padding: 16,
    },

    // Headers
    header: {
        backgroundColor: colors.surface,
        padding: 24,
        paddingTop: 16,
        paddingBottom: 32,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },

    // Cards
    card: {
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

    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },

    cardDescription: {
        fontSize: 13,
        color: colors.textSecondary,
    },

    // Buttons
    button: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 8,
    },

    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },

    buttonSecondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    // Text styles
    textPrimary: {
        color: colors.text,
        fontSize: 15,
    },

    textSecondary: {
        color: colors.textSecondary,
        fontSize: 13,
    },

    textMuted: {
        color: colors.textMuted,
        fontSize: 12,
    },

    // Layout helpers
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Spacing
    mb8: { marginBottom: 8 },
    mb12: { marginBottom: 12 },
    mb16: { marginBottom: 16 },
    mt8: { marginTop: 8 },
    mt16: { marginTop: 16 },
    p16: { padding: 16 },
    px16: { paddingHorizontal: 16 },
    py16: { paddingVertical: 16 },
});
