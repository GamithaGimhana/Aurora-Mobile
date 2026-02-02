import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { fetchNoteByIdThunk, deleteNoteThunk } from "@/src/redux/slices/notesSlice";
import { ChevronLeft, Edit3, Trash2, Calendar, Clock } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";

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
      "Are you sure you want to delete this note? This action cannot be undone.",
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
      <View className="flex-1 bg-[#050505] justify-center items-center">
        <ActivityIndicator color="#A855F7" size="large" />
      </View>
    );
  }

  if (!note) return null;

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      {/* Top Header Actions */}
      <SafeAreaView className="bg-[#0A0A0A] border-b border-white/5">
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/5 rounded-full items-center justify-center"
          >
            <ChevronLeft size={20} color="white" />
          </Pressable>
          
          <View className="flex-row gap-x-3">
            <Pressable 
              onPress={() => router.push({
                pathname: "/(dashboard)/notes/form",
                params: { noteId: note.id }
              })}
              className="w-10 h-10 bg-purple-600/20 rounded-full items-center justify-center border border-purple-500/30"
            >
              <Edit3 size={18} color="#A855F7" />
            </Pressable>
            <Pressable 
              onPress={handleDelete}
              className="w-10 h-10 bg-red-500/10 rounded-full items-center justify-center border border-red-500/20"
            >
              <Trash2 size={18} color="#EF4444" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Animated.View entering={FadeIn.duration(600)} className="px-8 py-10">
          
          {/* Metadata */}
          <View className="flex-row items-center gap-x-4 mb-6">
            <View className="flex-row items-center">
              <Calendar size={14} color="#6B7280" />
              <Text className="text-gray-500 text-xs ml-1 font-bold uppercase tracking-widest">
                {new Date(note.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="w-1 h-1 bg-gray-800 rounded-full" />
            <View className="flex-row items-center">
              <Clock size={14} color="#6B7280" />
              <Text className="text-gray-500 text-xs ml-1 font-bold uppercase tracking-widest">
                Read Only
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-white text-4xl font-black tracking-tighter leading-[48px] mb-8">
            {note.title}
          </Text>

          {/* Decorative Divider */}
          <View className="w-16 h-1 bg-purple-600 rounded-full mb-10" />

          {/* Content Body */}
          <Text className="text-gray-300 text-lg leading-8 tracking-wide">
            {note.content}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}