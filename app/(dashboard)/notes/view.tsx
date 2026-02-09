import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { fetchNoteByIdThunk, deleteNoteThunk } from "@/src/redux/slices/notesSlice";
import { ChevronLeft, Edit3, Trash2, Calendar, BookText } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function ViewNote() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Theme and Data selectors
  const { darkMode } = useAppSelector((state) => state.theme);
  const { notes, loading } = useAppSelector((state) => state.notes);
  const note = notes.find((n) => n.id === noteId);

  useEffect(() => {
    if (noteId) {
      dispatch(fetchNoteByIdThunk(noteId));
    }
  }, [noteId]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note permanently?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            await dispatch(deleteNoteThunk(noteId!));
            router.back();
          } 
        },
      ]
    );
  };

  // Theme-based style constants
  const bgColor = darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]";
  const headerBg = darkMode ? "bg-[#0A0A0A]" : "bg-white";
  const cardBg = darkMode ? "bg-white/5" : "bg-white";
  const cardBorder = darkMode ? "border-white/10" : "border-gray-100";
  const primaryText = darkMode ? "text-white" : "text-[#1A1A1A]";
  const bodyText = darkMode ? "text-gray-300" : "text-[#374151]";
  const secondaryText = darkMode ? "text-gray-500" : "text-gray-400";
  const iconColor = darkMode ? "white" : "#1A1A1A";

  if (loading && !note) {
    return (
      <View className={`flex-1 ${bgColor} justify-center items-center`}>
        <ActivityIndicator color="#9333EA" size="large" />
      </View>
    );
  }

  if (!note) return null;

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      {/* HEADER ACTIONS */}
      <SafeAreaView className={`${headerBg} border-b ${darkMode ? "border-white/5" : "border-gray-100"} shadow-sm`}>
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()}
            className={`w-11 h-11 rounded-2xl items-center justify-center border ${darkMode ? "bg-white/5 border-white/10 active:bg-white/10" : "bg-gray-50 border-gray-100 active:bg-gray-100"}`}
          >
            <ChevronLeft size={22} color={iconColor} />
          </Pressable>
          
          <View className="flex-row gap-x-3">
            <Pressable 
              onPress={() => router.push({
                pathname: "/(dashboard)/notes/form",
                params: { noteId: note.id }
              })}
              className={`w-11 h-11 rounded-2xl items-center justify-center border ${darkMode ? "bg-purple-600/20 border-purple-500/30 active:bg-purple-600/30" : "bg-purple-50 border-purple-100 active:bg-purple-100"}`}
            >
              <Edit3 size={20} color={darkMode ? "#A855F7" : "#9333EA"} />
            </Pressable>
            <Pressable 
              onPress={handleDelete}
              className={`w-11 h-11 rounded-2xl items-center justify-center border ${darkMode ? "bg-red-500/10 border-red-500/20 active:bg-red-500/20" : "bg-red-50 border-red-100 active:bg-red-100"}`}
            >
              <Trash2 size={20} color="#EF4444" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Animated.View entering={FadeInUp.duration(600)} className="px-8 py-10">
          
          {/* CATEGORY & DATE TAGS */}
          <View className="flex-row items-center gap-x-3 mb-8">
            <View className={`${darkMode ? "bg-purple-500/20" : "bg-purple-100"} px-3 py-1.5 rounded-lg flex-row items-center`}>
              <BookText size={12} color={darkMode ? "#A855F7" : "#9333EA"} />
              <Text className={`${darkMode ? "text-purple-400" : "text-purple-700"} text-[10px] font-black uppercase tracking-widest ml-2`}>Study Note</Text>
            </View>
            <View className={`${darkMode ? "bg-white/5" : "bg-gray-100"} px-3 py-1.5 rounded-lg flex-row items-center`}>
              <Calendar size={12} color={darkMode ? "#6B7280" : "#6B7280"} />
              <Text className={`${secondaryText} text-[10px] font-bold uppercase tracking-widest ml-2`}>
                {new Date(note.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* NOTE TITLE */}
          <Text className={`${primaryText} text-4xl font-black tracking-tighter leading-[48px] mb-6`}>
            {note.title}
          </Text>

          {/* DECORATIVE DIVIDER */}
          <View className="w-16 h-1.5 bg-purple-500 rounded-full mb-10" />

          {/* NOTE BODY */}
          <View className={`${cardBg} border ${cardBorder} p-8 rounded-[40px] shadow-sm shadow-purple-900/5`}>
            <Text className={`${bodyText} text-lg leading-8 font-medium tracking-tight`}>
              {note.content}
            </Text>
          </View>

          {/* FOOTER INFO */}
          <View className="mt-10 items-center">
            <Text className={`${darkMode ? "text-gray-700" : "text-gray-300"} text-[10px] font-bold uppercase tracking-[2px]`}>
              End of Document
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}