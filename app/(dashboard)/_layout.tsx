import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function DashboardLayout() {
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
