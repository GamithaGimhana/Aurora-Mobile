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

  if (loading && !note) {
    return (
      <View className="flex-1 bg-[#FAFAFA] justify-center items-center">
        <ActivityIndicator color="#9333EA" size="large" />
      </View>
    );
  }

  if (!note) return null;

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      {/* HEADER ACTIONS */}
      <SafeAreaView className="bg-white border-b border-gray-100 shadow-sm">
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()}
            className="w-11 h-11 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100 active:bg-gray-100"
          >
            <ChevronLeft size={22} color="#1A1A1A" />
          </Pressable>
          
          <View className="flex-row gap-x-3">
            <Pressable 
              onPress={() => router.push({
                pathname: "/(dashboard)/notes/form",
                params: { noteId: note.id }
              })}
              className="w-11 h-11 bg-purple-50 rounded-2xl items-center justify-center border border-purple-100 active:bg-purple-100"
            >
              <Edit3 size={20} color="#9333EA" />
            </Pressable>
            <Pressable 
              onPress={handleDelete}
              className="w-11 h-11 bg-red-50 rounded-2xl items-center justify-center border border-red-100 active:bg-red-100"
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
            <View className="bg-purple-100 px-3 py-1.5 rounded-lg flex-row items-center">
              <BookText size={12} color="#9333EA" />
              <Text className="text-purple-700 text-[10px] font-black uppercase tracking-widest ml-2">Study Note</Text>
            </View>
            <View className="bg-gray-100 px-3 py-1.5 rounded-lg flex-row items-center">
              <Calendar size={12} color="#6B7280" />
              <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-2">
                {new Date(note.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* NOTE TITLE */}
          <Text className="text-[#1A1A1A] text-4xl font-black tracking-tighter leading-[48px] mb-6">
            {note.title}
          </Text>

          {/* DECORATIVE DIVIDER */}
          <View className="w-16 h-1.5 bg-purple-500 rounded-full mb-10" />

          {/* NOTE BODY */}
          <View className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm shadow-purple-900/5">
            <Text className="text-[#374151] text-lg leading-8 font-medium tracking-tight">
              {note.content}
            </Text>
          </View>

          {/* FOOTER INFO */}
          <View className="mt-10 items-center">
            <Text className="text-gray-300 text-[10px] font-bold uppercase tracking-[2px]">
              End of Document
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}