// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

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
                name="(users)/profils"
                options={{
                    title: 'Profils',
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
        </Tabs>

    );
}
