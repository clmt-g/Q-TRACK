// app/(tabs)/_layout.tsx
import {Tabs, useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@/contexts/AuthContext';
import {useEffect} from "react";

export default function TabsLayout() {
    const router = useRouter();
    const { isLoggedIn, role } = useAuth();
    const insets = useSafeAreaInsets();

    // redirect to the login page if not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            router.replace('/login');
        }
    }, [isLoggedIn]);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#00D9FF',
                tabBarInactiveTintColor: '#666',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#131837',
                    borderBottomWidth: 1,
                    borderBottomColor: '#1E2347',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                },
                tabBarStyle: {
                    backgroundColor: '#131837',
                    borderTopWidth: 1,
                    borderTopColor: '#1E2347',
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profils"
                options={{
                    title: 'Profils',
                    href: role === 'admin' ? '/profils' : null,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather name="users" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="types-incidents"
                options={{
                    title: 'Type incidents',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name="pricetag-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="incidents"
                options={{
                    title: 'Incidents',
                    tabBarIcon: ({ color, size, focused }) => (
                        <AntDesign
                            name="flag"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="actions-correctives"
                options={{
                    title: 'Actions',
                    href: role && ['admin', 'direction', 'qualite'].includes(role) ? '/actions-correctives' : null,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="build-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>

    );
}
