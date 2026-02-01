import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import {
  addNoteThunk,
  updateNoteThunk,
  fetchNoteByIdThunk,
  selectNoteById,
} from "@/src/redux/slices/notesSlice";

export default function NoteForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { noteId } = useLocalSearchParams<{ noteId?: string }>();

  const note = useAppSelector(state =>
    noteId ? selectNoteById(state, noteId) : null
  );

  const { loading } = useAppSelector(state => state.notes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // LOAD NOTE SAFELY 
  useEffect(() => {
    if (!noteId) return;

    if (!note) {
      dispatch(fetchNoteByIdThunk(noteId));
      return;
    }

    setTitle(note.title);
    setContent(note.content);
  }, [noteId, note]);

  // SUBMIT
  const handleSubmit = async () => {
    if (loading) return;

    if (!title.trim() || !content.trim()) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    try {
      if (noteId) {
        await dispatch(
          updateNoteThunk({ id: noteId, title, content })
        ).unwrap();

        Alert.alert("Success", "Note updated successfully");
      } else {
        await dispatch(
          addNoteThunk({ title, content })
        ).unwrap();

        Alert.alert("Success", "Note created successfully");
      }

      router.back();
    } catch (err: any) {
      Alert.alert("Error", err || "Something went wrong");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* HEADER */}
          <View className="flex-row items-center mb-8">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 rounded-full"
            >
              <MaterialIcons name="chevron-left" size={32} color="#334155" />
            </Pressable>

            <Text className="text-2xl font-bold ml-2">
              {noteId ? "Edit Note" : "New Note"}
            </Text>
          </View>

          {/* FORM */}
          <View className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              className="p-4 rounded-xl bg-white border mb-4"
            />

            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Content"
              multiline
              className="p-4 rounded-xl bg-white border h-48 mb-6"
            />

            <Pressable
              disabled={loading}
              onPress={handleSubmit}
              className={`py-4 rounded-xl ${
                loading ? "bg-slate-400" : "bg-indigo-600"
              }`}
            >
              <Text className="text-white font-bold text-center text-lg">
                {loading ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
