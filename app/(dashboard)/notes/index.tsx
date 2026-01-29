import { View, Text, Pressable, ScrollView } from "react-native"
import { useEffect } from "react"
import { useRouter } from "expo-router"

import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { useAppSelector } from "@/src/hooks/useAppSelector"
import { fetchNotesThunk } from "@/src/redux/slices/notesSlice"

export default function Notes() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user } = useAppSelector(state => state.auth)
  const { notes, loading } = useAppSelector(state => state.notes)

  // Fetch notes from Redux
  useEffect(() => {
    if (!user) return
    dispatch(fetchNotesThunk())
  }, [user])

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      {/* HEADER */}
      <View className="flex-row justify-between mb-6">
        <Text className="text-2xl font-bold">Notes</Text>

        <Pressable
          onPress={() => router.push("/(dashboard)/notes/form")}
          className="bg-indigo-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-bold">+ Add</Text>
        </Pressable>
      </View>

      {/* CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading && (
          <Text className="text-center text-gray-400 mt-10">
            Loading notes...
          </Text>
        )}

        {!loading && notes.length === 0 && (
          <Text className="text-gray-400 text-center mt-10">
            No notes yet
          </Text>
        )}

        {!loading &&
          notes.map(note => (
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
