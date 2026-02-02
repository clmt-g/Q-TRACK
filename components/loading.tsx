// components/LoadingState.tsx
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { globalStyles, colors } from '@/styles/theme';

interface LoadingStateProps {
    message?: string;
}

export default function LoadingState({ message = 'Chargement...' }: LoadingStateProps) {
    return (
        <View style={[globalStyles.container, styles.centerContainer]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{message}</Text>
        </View>
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
});
