// app/index.tsx
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { globalStyles, colors } from '@/styles/theme';
import ErrorState from "@/components/error";
import {useEffectiveAuth} from "@/hooks/useEffectiveAuth";

export default function Index() {
    const { isLoggedIn, isLoading, error } = useEffectiveAuth();

    // Afficher un loader pendant la vérification
    if (isLoading) {
        return (
            <View style={[globalStyles.container, globalStyles.centered]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error) {
        return <ErrorState error={error} />;
    }

    // Rediriger selon l'état de connexion
    return isLoggedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}
