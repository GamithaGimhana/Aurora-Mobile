import { View, Text, Pressable, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import { getAllNotes } from "@/src/services/noteService"
import { Note } from "@/src/types/note"
import { useRouter } from "expo-router"
import { useAppSelector } from "@/src/hooks/useAppSelector"

export default function Notes() {
  const router = useRouter()
  const { user } = useAppSelector(state => state.auth)
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    if (!user) return 

    getAllNotes()
      .then(setNotes)
      .catch(console.error)
  }, [user])

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <View className="flex-row justify-between mb-6">
        <Text className="text-2xl font-bold">Notes</Text>
        <Pressable
          onPress={() => router.push("/(dashboard)/notes/form")}
          className="bg-indigo-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-bold">+ Add</Text>
        </Pressable>
      </View>

      <ScrollView>
        {notes.length === 0 && (
          <Text className="text-gray-400 text-center mt-10">
            No notes yet
          </Text>
        )}

        {notes.map(note => (
          <Pressable
            key={note.id}
            onPress={() =>
              router.push({
                pathname: "/(dashboard)/notes/form",
                params: { noteId: note.id }
              })
            }
            className="p-4 bg-slate-100 rounded-xl mb-3"
          >
            <Text className="font-bold">{note.title}</Text>
            <Text className="text-gray-500 text-sm" numberOfLines={2}>
              {note.content}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}
