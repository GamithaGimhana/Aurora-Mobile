import { View, Text, TextInput, Pressable } from "react-native"

export default function NotesForm() {
  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold mb-6">New Note</Text>

      <TextInput
        placeholder="Title"
        className="border border-gray-300 rounded-xl p-4 mb-4"
      />

      <TextInput
        placeholder="Content"
        multiline
        className="border border-gray-300 rounded-xl p-4 h-40"
      />

      <Pressable className="bg-indigo-600 p-4 rounded-xl mt-6">
        <Text className="text-white font-bold text-center">
          Save Note
        </Text>
      </Pressable>
    </View>
  )
}
