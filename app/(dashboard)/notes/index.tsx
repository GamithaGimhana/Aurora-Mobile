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
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      {/* Background Decor */}
      <View className="absolute top-[-50] left-[-50] w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="px-8 flex-row items-center justify-between py-6">
          <View>
            <Text className="text-[#1A1A1A] text-3xl font-black tracking-tighter">My Notes</Text>
            <View className="flex-row items-center mt-1">
               <View className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
               <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">{notes.length} Documents</Text>
            </View>
          </View>
          <Pressable 
            onPress={() => router.push({ pathname: "/(dashboard)/notes/form", params: {} })}
            className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center shadow-lg shadow-purple-200 active:scale-90"
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
              <ActivityIndicator color="#9333EA" size="large" />
            </View>
          ) : notes.length === 0 ? (
            <Animated.View entering={FadeInUp} className="py-20 items-center justify-center">
              <View className="w-24 h-24 bg-white rounded-[35px] items-center justify-center mb-6 shadow-sm border border-gray-100">
                <FileText size={40} color="#D1D5DB" />
              </View>
              <Text className="text-[#1A1A1A] text-xl font-bold">Your library is empty</Text>
              <Text className="text-gray-400 text-center mt-2 px-10 font-medium">Create your first smart note to begin your journey.</Text>
              <Pressable 
                onPress={() => router.push({ pathname: "/(dashboard)/notes/form", params: {} })}
                className="mt-8 bg-purple-50 px-8 py-4 rounded-2xl border border-purple-100 shadow-sm"
              >
                <Text className="text-purple-600 font-black uppercase tracking-widest text-xs">Create First Note</Text>
              </Pressable>
            </Animated.View>
          ) : (
            notes.map((note, index) => (
              <Animated.View 
                key={note.id} 
                entering={FadeInDown.delay(index * 100).duration(500)}
              >
                <View className="bg-white border border-gray-100 rounded-[32px] mb-5 overflow-hidden shadow-sm shadow-purple-900/5">
                  <Pressable
                    onPress={() => router.push({ pathname: "/(dashboard)/notes/view", params: { noteId: note.id } })}
                    className="p-6 flex-row items-center active:bg-gray-50"
                  >
                    <View className="w-14 h-14 bg-purple-50 rounded-[20px] items-center justify-center mr-4">
                      <BookOpen size={24} color="#9333EA" />
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-[#1A1A1A] text-lg font-bold mb-1" numberOfLines={1}>
                        {note.title}
                      </Text>
                      <View className="flex-row items-center">
                        <Clock size={12} color="#9CA3AF" />
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider ml-1">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color="#D1D5DB" />
                  </Pressable>

                  {/* QUICK ACTION BAR */}
                  <View className="flex-row border-t border-gray-50 bg-gray-50/30">
                    <Pressable 
                      onPress={() => router.push({ pathname: "/(dashboard)/notes/form", params: { noteId: note.id } })}
                      className="flex-1 flex-row items-center justify-center py-4 border-r border-gray-100 active:bg-purple-50"
                    >
                      <Edit3 size={16} color="#9333EA" />
                      <Text className="text-purple-600 text-xs font-bold ml-2 uppercase tracking-widest">Edit</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => confirmDelete(note.id, note.title)}
                      className="flex-1 flex-row items-center justify-center py-4 active:bg-red-50"
                    >
                      <Trash2 size={16} color="#EF4444" />
                      <Text className="text-red-500 text-xs font-bold ml-2 uppercase tracking-widest">Delete</Text>
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