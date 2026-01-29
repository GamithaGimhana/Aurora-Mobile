import { View, Text, Pressable } from "react-native"
import { useRouter } from "expo-router"

export default function Home() {
  const router = useRouter()

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Text className="text-3xl font-extrabold mb-2">Dashboard</Text>
      <Text className="text-gray-500 mb-10">
        Quick access to your study tools
      </Text>

      <Pressable
        onPress={() => router.push("/(dashboard)/notes")}
        className="bg-indigo-600 p-6 rounded-2xl mb-4"
      >
        <Text className="text-white text-lg font-bold">📘 Notes</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(dashboard)/flashcards")}
        className="bg-emerald-600 p-6 rounded-2xl"
      >
        <Text className="text-white text-lg font-bold">🧠 Flashcards</Text>
      </Pressable>
    </View>
  )
}
