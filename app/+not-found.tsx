// app/+not-found.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { globalStyles, colors } from '@/styles/theme';

export default function NotFoundScreen() {
    const router = useRouter();

    return (
        <View style={[globalStyles.container, globalStyles.centered]}>
            <View style={styles.content}>
                {/* Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons name="warning-outline" size={80} color={colors.warning} />
                </View>

                {/* Error Code */}
                <Text style={styles.errorCode}>404</Text>

                {/* Title */}
                <Text style={styles.title}>Page introuvable</Text>

                {/* Description */}
                <Text style={styles.description}>
                    Oups ! La page que vous recherchez n&#39;existe pas ou a été déplacée.
                </Text>

                {/* Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Ionicons name="home-outline" size={20} color={colors.text} />
                    <Text style={styles.buttonText}>Retour à l&#39;accueil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        padding: 24,
        maxWidth: 400,
    },
    iconContainer: {
        marginBottom: 24,
    },
    errorCode: {
        fontSize: 72,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
});
