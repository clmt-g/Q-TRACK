import {Stack, Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function RootLayout() {
  return (
      <Stack>
        <Tabs
            screenOptions={{
              tabBarActiveTintColor: "#007AFF",
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings" size={size} color={color} />
              ),
            }}
        />
      </Stack>
  );
}
