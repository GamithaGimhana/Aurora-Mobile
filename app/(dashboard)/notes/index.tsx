import React, { useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { fetchNotesThunk, deleteNoteThunk } from "@/src/redux/slices/notesSlice";
import { Plus, BookOpen, Clock, ChevronRight, FileText, Trash2, Edit3 } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function NotesIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { notes, loading } = useAppSelector((state) => state.notes);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotesThunk());
    }
  }, [user]);

  const confirmDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => dispatch(deleteNoteThunk(id)) 
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      {/* Background Glow */}
      <View className="absolute top-[-50] right-[-50] w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="px-6 flex-row items-center justify-between py-6">
          <View>
            <Text className="text-white text-3xl font-black tracking-tighter">My Notes</Text>
            <Text className="text-gray-500 font-medium">{notes.length} Documents</Text>
          </View>
          <Pressable 
            onPress={() => router.push("/(dashboard)/notes/form")}
            className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center shadow-lg active:scale-95"
          >
            <Plus size={24} color="white" strokeWidth={3} />
          </Pressable>
        </View>

        {/* CONTENT */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        >
          {loading ? (
            <View className="py-20">
              <ActivityIndicator color="#A855F7" size="large" />
            </View>
          ) : notes.length === 0 ? (
            <Animated.View entering={FadeInUp} className="py-20 items-center justify-center">
              <View className="w-20 h-20 bg-white/5 rounded-full items-center justify-center mb-6">
                <FileText size={32} color="#4B5563" />
              </View>
              <Text className="text-white text-xl font-bold">Your library is empty</Text>
              <Pressable 
                onPress={() => router.push("/(dashboard)/notes/form")}
                className="mt-6 bg-purple-600/20 px-6 py-3 rounded-xl border border-purple-500/30"
              >
                <Text className="text-purple-400 font-bold">Create Your First Note</Text>
              </Pressable>
            </Animated.View>
          ) : (
            notes.map((note, index) => (
              <Animated.View 
                key={note.id} 
                entering={FadeInDown.delay(index * 100).duration(500)}
              >
                <View className="bg-white/5 border border-white/10 rounded-[28px] mb-4 overflow-hidden">
                  <Pressable
                    onPress={() => router.push({ pathname: "/(dashboard)/notes/view", params: { noteId: note.id } })}
                    className="p-5 flex-row items-center active:bg-white/10"
                  >
                    <View className="w-14 h-14 bg-purple-500/20 rounded-2xl items-center justify-center mr-4">
                      <BookOpen size={24} color="#A855F7" />
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold mb-1" numberOfLines={1}>
                        {note.title}
                      </Text>
                      <View className="flex-row items-center">
                        <Clock size={12} color="#6B7280" />
                        <Text className="text-gray-500 text-xs ml-1 font-medium">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color="#374151" />
                  </Pressable>

                  {/* QUICK ACTION BAR */}
                  <View className="flex-row border-t border-white/5 bg-white/[0.02]">
                    <Pressable 
                      onPress={() => router.push({ pathname: "/(dashboard)/notes/form", params: { noteId: note.id } })}
                      className="flex-1 flex-row items-center justify-center py-3 border-r border-white/5 active:bg-purple-500/10"
                    >
                      <Edit3 size={14} color="#A855F7" />
                      <Text className="text-purple-400 text-xs font-bold ml-2">Edit</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => confirmDelete(note.id, note.title)}
                      className="flex-1 flex-row items-center justify-center py-3 active:bg-red-500/10"
                    >
                      <Trash2 size={14} color="#EF4444" />
                      <Text className="text-red-500 text-xs font-bold ml-2">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}