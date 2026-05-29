import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useImpersonation } from '@/contexts/ImpersonationContext';
import { useRouter } from 'expo-router';

export default function ImpersonationBanner() {
    const { isImpersonating, impersonatedUser, stopImpersonation } = useImpersonation();
    const { top } = useSafeAreaInsets();
    const router = useRouter();

    if (!isImpersonating || !impersonatedUser) return null;

    const handleStop = () => {
        stopImpersonation();
        router.push('/(tabs)/profils');
    };

    return (
        <View style={[styles.banner, { paddingTop: top + 10 }]}>
            <Ionicons name="eye" size={16} color="#fff" />
            <Text style={styles.text} numberOfLines={1}>
                Vue de <Text style={styles.bold}>{impersonatedUser.prenom} {impersonatedUser.nom}</Text>
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleStop}>
                <Ionicons name="close-circle" size={16} color="#fff" />
                <Text style={styles.buttonText}>Quitter</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C3AED',
        paddingHorizontal: 16,
        paddingBottom: 10,
        gap: 8,
    },
    text: {
        flex: 1,
        color: '#EDE9FE',
        fontSize: 13,
    },
    bold: {
        fontWeight: '700',
        color: '#fff',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
