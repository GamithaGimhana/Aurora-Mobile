import { Tabs, Redirect } from "expo-router";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { Home, BookOpen, Layers, User } from "lucide-react-native";
import { View } from "react-native";

export default function DashboardLayout() {
  const { user, loading } = useAppSelector(state => state.auth);

  if (loading) return null;

  if (!user) {
    return <Redirect href="/welcome" />;
  }
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // Clean light background
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6", // Subtle separator
          elevation: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#9333EA", // Vibrant Purple-600
        tabBarInactiveTintColor: "#9CA3AF", // Gray-400
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
            <View className={focused ? "bg-purple-100 p-2 rounded-xl" : "p-2"}>
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
            <View className={focused ? "bg-purple-100 p-2 rounded-xl" : "p-2"}>
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
            <View className={focused ? "bg-purple-100 p-2 rounded-xl" : "p-2"}>
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
            <View className={focused ? "bg-purple-100 p-2 rounded-xl" : "p-2"}>
               <User size={22} color={color} />
            </View>
          )
        }}
      />
    </Tabs>
  );
}