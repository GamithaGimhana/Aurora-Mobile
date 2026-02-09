import { Tabs, Redirect } from "expo-router";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { Home, BookOpen, Layers, User } from "lucide-react-native";
import { View } from "react-native";

export default function DashboardLayout() {
  const { user, loading } = useAppSelector(state => state.auth);
  const { darkMode } = useAppSelector(state => state.theme); // Consuming theme state

  if (loading) return null;

  if (!user) {
    return <Redirect href="/welcome" />;
  }
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: darkMode ? "#0A0A0A" : "#FFFFFF", // Contextual background
          borderTopWidth: darkMode ? 0 : 1,
          borderTopColor: "#F3F4F6",
          elevation: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: darkMode ? "#A855F7" : "#9333EA",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ 
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? (darkMode ? "bg-purple-500/20 p-2 rounded-xl" : "bg-purple-100 p-2 rounded-xl") : "p-2"}>
               <Home size={22} color={color} />
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{ 
          title: "Notes",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? (darkMode ? "bg-purple-500/20 p-2 rounded-xl" : "bg-purple-100 p-2 rounded-xl") : "p-2"}>
               <BookOpen size={22} color={color} />
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="flashcards"
        options={{ 
          title: "Flash",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? (darkMode ? "bg-purple-500/20 p-2 rounded-xl" : "bg-purple-100 p-2 rounded-xl") : "p-2"}>
               <Layers size={22} color={color} />
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? (darkMode ? "bg-purple-500/20 p-2 rounded-xl" : "bg-purple-100 p-2 rounded-xl") : "p-2"}>
               <User size={22} color={color} />
            </View>
          )
        }}
      />
    </Tabs>
  );
}