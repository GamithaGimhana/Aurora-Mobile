import { View, Text, Pressable } from "react-native"
import { useRouter } from "expo-router"

export default function Notes() {
  const router = useRouter()

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold">My Notes</Text>
        <Pressable
          onPress={() => router.push("/(dashboard)/notes/form")}
          className="bg-indigo-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-bold">+ Add</Text>
        </Pressable>
      </View>

      <View className="p-4 bg-slate-100 rounded-xl mb-3">
        <Text className="font-bold">Sample Note</Text>
        <Text className="text-gray-500 text-sm">
          This is a placeholder note.
        </Text>
      </View>
    </View>
  )
}
