import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from "@/contexts/AuthContext";
import { networkService } from "@/services/NetworkService";
import { useNetwork } from "@/hooks/useNetwork";
import { OfflineBanner } from "@/components/OfflineBanner";

function RootLayoutNav() {
    const isConnected = useNetwork();

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
            </Stack>
            {!isConnected && <OfflineBanner />}
        </>
    );
}

export default function RootLayout() {
    useEffect(() => {
        networkService.init();
        return () => networkService.destroy();
    }, []);

    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}