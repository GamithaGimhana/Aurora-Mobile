import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from "react-native"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"

import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { useAppSelector } from "@/src/hooks/useAppSelector"

import {
  addNoteThunk,
  updateNoteThunk
} from "@/src/redux/slices/notesSlice"

export default function NoteForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { noteId } = useLocalSearchParams<{ noteId?: string }>()

  const { notes, loading } = useAppSelector(state => state.notes)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // ---------------- LOAD NOTE FROM REDUX ----------------
  useEffect(() => {
    if (!noteId) return

    const existingNote = notes.find(n => n.id === noteId)
    if (!existingNote) {
      Alert.alert("Error", "Note not found")
      router.back()
      return
    }

    setTitle(existingNote.title)
    setContent(existingNote.content)
  }, [noteId, notes])

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (loading) return

    if (!title.trim() || !content.trim()) {
      Alert.alert("Validation Error", "All fields are required")
      return
    }

    try {
      if (noteId) {
        await dispatch(
          updateNoteThunk({
            id: noteId,
            title,
            content
          })
        ).unwrap()

        Alert.alert("Success", "Note updated successfully")
      } else {
        await dispatch(
          addNoteThunk({
            title,
            content
          })
        ).unwrap()

        Alert.alert("Success", "Note created successfully")
      }

      router.back()
    } catch (err: any) {
      Alert.alert("Error", err || "Something went wrong")
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ---------- HEADER ---------- */}
          <View className="flex-row items-center mb-8">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 rounded-full active:bg-slate-200"
            >
              <MaterialIcons name="chevron-left" size={32} color="#334155" />
            </Pressable>

            <Text className="text-2xl font-bold ml-2">
              {noteId ? "Edit Note" : "New Note"}
            </Text>
          </View>

          {/* ---------- FORM CARD ---------- */}
          <View className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            {/* TITLE */}
            <View className="mb-6">
              <Text className="text-slate-500 text-xs font-bold uppercase mb-2 ml-1">
                Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Note title"
                className="p-4 rounded-xl bg-white border border-slate-300 text-base"
              />
            </View>

            {/* CONTENT */}
            <View className="mb-8">
              <Text className="text-slate-500 text-xs font-bold uppercase mb-2 ml-1">
                Content
              </Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Write your note here..."
                multiline
                textAlignVertical="top"
                className="p-4 rounded-xl bg-white border border-slate-300 text-base h-48"
              />
            </View>

            {/* ACTION BUTTON */}
            <Pressable
              disabled={loading}
              onPress={handleSubmit}
              className={`py-4 rounded-xl flex-row justify-center items-center ${
                loading ? "bg-slate-400" : "bg-indigo-600"
              }`}
            >
              <MaterialIcons
                name={noteId ? "save" : "add"}
                size={22}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-bold text-lg">
                {loading
                  ? "Saving..."
                  : noteId
                  ? "Save Changes"
                  : "Create Note"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
