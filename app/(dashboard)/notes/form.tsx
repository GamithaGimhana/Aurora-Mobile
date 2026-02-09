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
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      {/* Soft Background Decor */}
      <View className="absolute top-[-50] left-[-50] w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* HEADER */}
          <View className="px-6 flex-row items-center justify-between py-4">
            <Pressable
              onPress={() => router.back()}
              className="w-11 h-11 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm active:bg-gray-50"
            >
              <ChevronLeft size={22} color="#1A1A1A" />
            </Pressable>
            
            <Text className="text-[#1A1A1A] text-xl font-black tracking-tight">
              {noteId ? "Edit Note" : "New Note"}
            </Text>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`w-11 h-11 rounded-2xl items-center justify-center shadow-md ${
                loading ? "bg-gray-300" : "bg-purple-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Check size={22} color="white" strokeWidth={3} />
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
                <Type size={14} color="#9333EA" />
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Note Title
                </Text>
              </View>
              <View className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm shadow-purple-900/5">
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Database Fundamentals"
                  placeholderTextColor="#9CA3AF"
                  className="text-[#1A1A1A] text-lg font-bold"
                />
              </View>
            </Animated.View>

            {/* CONTENT INPUT */}
            <Animated.View entering={FadeInUp.delay(400)} className="mb-10">
              <View className="flex-row items-center mb-3 ml-1">
                <AlignLeft size={14} color="#9333EA" />
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Content
                </Text>
              </View>
              <View className="bg-white border border-gray-200 rounded-[35px] px-6 py-6 h-80 shadow-sm shadow-purple-900/5">
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="Start writing your thoughts..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  className="text-[#374151] text-base leading-6 font-medium h-full"
                />
              </View>
            </Animated.View>

            {/* ACTION BUTTON */}
            <Animated.View entering={FadeInDown.delay(600)} className="pb-12">
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`h-16 rounded-[25px] flex-row items-center justify-center shadow-lg shadow-purple-200 ${
                  loading ? "bg-gray-400" : "bg-purple-600"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2 uppercase tracking-widest">
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