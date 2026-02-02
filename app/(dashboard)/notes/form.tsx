import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import {
  addNoteThunk,
  updateNoteThunk,
  fetchNoteByIdThunk,
  selectNoteById,
} from "@/src/redux/slices/notesSlice";
import { ChevronLeft, Check, Type, AlignLeft } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function NoteForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();

  const note = useAppSelector((state) =>
    noteId ? selectNoteById(state, noteId) : null
  );
  const { loading } = useAppSelector((state) => state.notes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Sync state with note data for editing
  useEffect(() => {
    if (!noteId) {
      setTitle("");
      setContent("");
      return;
    }

    if (!note) {
      dispatch(fetchNoteByIdThunk(noteId));
    } else {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [noteId, note]); 

  const handleSubmit = async () => {
    if (loading) return;

    if (!title.trim() || !content.trim()) {
      Alert.alert("Validation Error", "Please provide both a title and content.");
      return;
    }

    try {
      if (noteId) {
        await dispatch(updateNoteThunk({ id: noteId, title, content })).unwrap();
        Alert.alert("Success", "Note updated successfully");
      } else {
        await dispatch(addNoteThunk({ title, content })).unwrap();
        Alert.alert("Success", "Note created successfully");
      }
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err || "Something went wrong while saving.");
    }
  };

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      {/* Background Glow */}
      <View className="absolute top-[-50] left-[-50] w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* HEADER */}
          <View className="px-6 flex-row items-center justify-between py-4">
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
            >
              <ChevronLeft size={24} color="white" />
            </Pressable>
            
            <Text className="text-white text-xl font-black tracking-tight">
              {noteId ? "Edit Note" : "New Note"}
            </Text>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                loading ? "bg-gray-800" : "bg-purple-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Check size={24} color="white" strokeWidth={3} />
              )}
            </Pressable>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
          >
            {/* TITLE INPUT */}
            <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
              <View className="flex-row items-center mb-3 ml-1">
                <Type size={14} color="#A855F7" />
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Note Title
                </Text>
              </View>
              <View className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter a descriptive title..."
                  placeholderTextColor="#4B5563"
                  className="text-white text-lg font-bold"
                />
              </View>
            </Animated.View>

            {/* CONTENT INPUT */}
            <Animated.View entering={FadeInUp.delay(400)} className="mb-10">
              <View className="flex-row items-center mb-3 ml-1">
                <AlignLeft size={14} color="#A855F7" />
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Content
                </Text>
              </View>
              <View className="bg-white/5 border border-white/10 rounded-3xl px-5 py-5 h-64">
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="Start writing your thoughts..."
                  placeholderTextColor="#4B5563"
                  multiline
                  textAlignVertical="top"
                  className="text-gray-300 text-base leading-6 h-full"
                />
              </View>
            </Animated.View>

            {/* SAVE BUTTON (Secondary access) */}
            <Animated.View entering={FadeInDown.delay(600)} className="pb-10">
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-purple-500/20 ${
                  loading ? "bg-gray-800" : "bg-purple-600"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">
                      {noteId ? "Update Note" : "Save Note"}
                    </Text>
                    <Check size={20} color="white" strokeWidth={2.5} />
                  </>
                )}
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}