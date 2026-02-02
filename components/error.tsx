// components/ErrorState.tsx
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {globalStyles, colors} from '@/styles/theme';

interface ErrorStateProps {
    error: string;
    onRetry?: () => void;
    retryButtonText?: string;
}

export default function ErrorState({
                                       error, onRetry, retryButtonText = 'Réessayer'
                                   }: ErrorStateProps) {
    return (
        <View style={[globalStyles.container, styles.centerContainer]}>
            <Ionicons name="alert-circle" size={64} color="#FF6B6B"/>
            <Text style={styles.errorText}>{error}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryButtonText}>{retryButtonText}</Text>
                </TouchableOpacity>
            )}
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
});