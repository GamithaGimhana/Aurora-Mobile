import { View, Text } from "react-native"
import { useAppSelector } from "@/src/hooks/useAppSelector"

export default function Profile() {
  const { user } = useAppSelector(state => state.auth)

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Text className="text-3xl font-bold mb-4">Profile</Text>

      <Text className="text-lg">Name: {user?.name}</Text>
      <Text className="text-lg mt-2">Email: {user?.email}</Text>
    </View>
  )
}
