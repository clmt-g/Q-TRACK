import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from "@/contexts/AuthContext";
import { networkService } from "@/services/NetworkService";
import { useNetwork } from "@/hooks/useNetwork";
import { OfflineBanner } from "@/components/OfflineBanner";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import ImpersonationBanner from "@/components/ImpersonationBanner";

function RootLayoutNav() {
    const isConnected = useNetwork();

    return (
        <>
            <ImpersonationBanner />
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
            <ImpersonationProvider>
                <RootLayoutNav />
            </ImpersonationProvider>
        </AuthProvider>
    );
}
