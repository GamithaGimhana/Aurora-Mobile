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
          backgroundColor: "#0A0A0A",
          borderTopWidth: 0,
          elevation: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#A855F7",
        tabBarInactiveTintColor: "#4B5563",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ 
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? "bg-purple-500/10 p-2 rounded-xl" : ""}>
               <Home size={24} color={color} />
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="notes/index"
        options={{ 
          title: "Notes",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? "bg-purple-500/10 p-2 rounded-xl" : ""}>
               <BookOpen size={24} color={color} />
            </View>
          )
        }}
      />

      {/* Hide forms from the tab bar but keep them in the routing context */}
      <Tabs.Screen
        name="notes/form"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="flashcards/index"
        options={{ 
          title: "Flash",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? "bg-purple-500/10 p-2 rounded-xl" : ""}>
               <Layers size={24} color={color} />
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="flashcards/form"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="profile"
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? "bg-purple-500/10 p-2 rounded-xl" : ""}>
               <User size={24} color={color} />
            </View>
          )
        }}
      />
    </Tabs>
  );
}