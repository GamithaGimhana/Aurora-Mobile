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
import { ChevronLeft, Check, Type, AlignLeft, AlertCircle, X } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";

export default function NoteForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();

  // Theme and Data Selectors
  const { darkMode } = useAppSelector((state) => state.theme);
  const note = useAppSelector((state) =>
    noteId ? selectNoteById(state, noteId) : null
  );
  const { loading } = useAppSelector((state) => state.notes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null); // NEW: Error state

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
      setFormError("Both a title and content are required to save your note.");
      return;
    }

    setFormError(null);

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
      setFormError(err || "Something went wrong while saving your note.");
    }
  };

  // Theme-based style constants
  const bgColor = darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]";
  const inputBg = darkMode ? "bg-white/5" : "bg-white";
  const inputBorder = darkMode ? "border-white/10" : "border-gray-200";
  const primaryText = darkMode ? "text-white" : "text-[#1A1A1A]";
  const labelText = darkMode ? "text-gray-500" : "text-gray-400";
  const bodyText = darkMode ? "text-gray-300" : "text-[#374151]";
  const placeholderColor = darkMode ? "#4B5563" : "#9CA3AF";

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      {/* Dynamic Background Glow */}
      <View className={`absolute top-[-50] left-[-50] w-96 h-96 rounded-full blur-3xl ${
        darkMode ? "bg-purple-900/15" : "bg-purple-100/40"
      }`} />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* HEADER */}
          <View className="px-6 flex-row items-center justify-between py-4">
            <Pressable
              onPress={() => router.back()}
              className={`w-11 h-11 ${inputBg} rounded-2xl items-center justify-center border ${inputBorder} shadow-sm active:opacity-70`}
            >
              <ChevronLeft size={22} color={darkMode ? "white" : "#1A1A1A"} />
            </Pressable>
            
            <Text className={`${primaryText} text-xl font-black tracking-tight`}>
              {noteId ? "Edit Note" : "New Note"}
            </Text>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`w-11 h-11 rounded-2xl items-center justify-center shadow-md ${
                loading ? (darkMode ? "bg-gray-800" : "bg-gray-300") : "bg-purple-600"
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
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10 }}
          >
            {/* ERROR MESSAGE DISPLAY */}
            {formError && (
              <Animated.View 
                entering={FadeIn.duration(400)} 
                className="flex-row items-center bg-red-500/10 p-4 rounded-2xl mb-6 border border-red-500/20"
              >
                <AlertCircle size={20} color="#EF4444" />
                <Text className="text-red-500 text-sm font-bold ml-3 flex-1">{formError}</Text>
                <Pressable onPress={() => setFormError(null)}>
                  <X size={16} color="#EF4444" />
                </Pressable>
              </Animated.View>
            )}

            {/* TITLE INPUT */}
            <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
              <View className="flex-row items-center mb-3 ml-1">
                <Type size={14} color="#9333EA" />
                <Text className={`${labelText} text-[10px] font-bold uppercase tracking-[2px] ml-2`}>
                  Note Title
                </Text>
              </View>
              <View className={`${inputBg} border ${inputBorder} rounded-2xl px-5 py-4 shadow-sm shadow-black/5`}>
                <TextInput
                  value={title}
                  onChangeText={(val) => {setTitle(val); setFormError(null);}}
                  placeholder="e.g. Database Fundamentals"
                  placeholderTextColor={placeholderColor}
                  className={`${primaryText} text-lg font-bold`}
                />
              </View>
            </Animated.View>

            {/* CONTENT INPUT */}
            <Animated.View entering={FadeInUp.delay(400)} className="mb-10">
              <View className="flex-row items-center mb-3 ml-1">
                <AlignLeft size={14} color="#9333EA" />
                <Text className={`${labelText} text-[10px] font-bold uppercase tracking-[2px] ml-2`}>
                  Content
                </Text>
              </View>
              <View className={`${inputBg} border ${inputBorder} rounded-[35px] px-6 py-6 h-80 shadow-sm shadow-black/5`}>
                <TextInput
                  value={content}
                  onChangeText={(val) => {setContent(val); setFormError(null);}}
                  placeholder="Start writing your thoughts..."
                  placeholderTextColor={placeholderColor}
                  multiline
                  textAlignVertical="top"
                  className={`${bodyText} text-base leading-6 font-medium h-full`}
                />
              </View>
            </Animated.View>

            {/* ACTION BUTTON */}
            <Animated.View entering={FadeInDown.delay(600)} className="pb-12">
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`h-16 rounded-[25px] flex-row items-center justify-center shadow-lg ${
                  loading 
                    ? (darkMode ? "bg-gray-800" : "bg-gray-400") 
                    : (darkMode ? "bg-purple-600 shadow-purple-900/40" : "bg-purple-600 shadow-purple-200")
                } active:scale-95`}
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