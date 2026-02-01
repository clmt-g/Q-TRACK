import {Stack} from 'expo-router';
import {AuthProvider} from "@/contexts/AuthContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen
                    name="login"
                />
                <Stack.Screen
                    name="index"
                />
                <Stack.Screen
                    name="(tabs)"
                />
                <Stack.Screen
                    name="+not-found"
                />
            </Stack>
        </AuthProvider>
    );
}
