import { Tabs, Redirect } from "expo-router"
import { useAppSelector } from "@/src/hooks/useAppSelector"

export default function DashboardLayout() {
  const { user, loading } = useAppSelector(state => state.auth)

  if (loading) return null

  if (!user) {
    return <Redirect href="/welcome" />
  }
  
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />

      <Tabs.Screen
        name="notes/index"
        options={{ title: "Notes" }}
      />

      <Tabs.Screen
        name="notes/form"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="flashcards/index"
        options={{ title: "Flashcards" }}
      />

      <Tabs.Screen
        name="flashcards/form"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: "Profile" }}
      />
    </Tabs>

  );
}
