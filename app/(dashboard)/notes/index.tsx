import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl 
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { fetchNotesThunk } from "@/src/redux/slices/notesSlice";
import { 
  Plus, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  FileText,
  Search
} from "lucide-react-native";

export default function Notes() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);
  const { notes, loading } = useAppSelector(state => state.notes);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotesThunk());
    }
  }, [user]);

  const onRefresh = () => {
    dispatch(fetchNotesThunk());
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* --- 1. DYNAMIC HEADER --- */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between bg-white border-b border-gray-100 shadow-sm">
          <View>
            <Text className="text-3xl font-black text-gray-900 tracking-tighter">My Notes</Text>
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
              {notes.length} Documents Saved
            </Text>
          </View>
          <View className="flex-row">
            <Pressable className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-2 border border-gray-100">
              <Search size={18} color="#4F46E5" />
            </Pressable>
            <Pressable 
              onPress={() => router.push("/(dashboard)/notes/form")}
              className="w-10 h-10 bg-indigo-600 rounded-full items-center justify-center shadow-lg shadow-indigo-200"
            >
              <Plus size={20} color="white" strokeWidth={3} />
            </Pressable>
          </View>
        </View>

        {/* --- 2. CONTENT AREA --- */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={loading && notes.length > 0} onRefresh={onRefresh} tintColor="#4F46E5" />
          }
        >
          {loading && notes.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="text-gray-400 font-bold mt-4">Syncing with Aurora...</Text>
            </View>
          ) : notes.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
              <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-6">
                <FileText size={40} color="#4F46E5" />
              </View>
              <Text className="text-xl font-bold text-gray-900">Your library is empty</Text>
              <Text className="text-gray-400 text-center px-10 mt-2 leading-5">
                Start your learning journey by creating your first smart note.
              </Text>
              <Pressable 
                onPress={() => router.push("/(dashboard)/notes/form")}
                className="mt-8 bg-indigo-600 px-8 py-4 rounded-2xl shadow-md"
              >
                <Text className="text-white font-bold">Create Note</Text>
              </Pressable>
            </View>
          ) : (
            notes.map((note) => (
              <Pressable
                key={note.id}
                onPress={() =>
                  router.push({
                    pathname: "/(dashboard)/notes/form",
                    params: { noteId: note.id },
                  })
                }
                className="bg-white p-6 rounded-[32px] mb-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="bg-indigo-50 p-2 rounded-xl">
                    <BookOpen size={18} color="#4F46E5" />
                  </View>
                  <ChevronRight size={18} color="#D1D5DB" />
                </View>

                <Text className="text-xl font-bold text-gray-900 mb-2" numberOfLines={1}>
                  {note.title}
                </Text>
                
                <Text className="text-gray-500 text-sm leading-5 mb-4" numberOfLines={2}>
                  {note.content}
                </Text>

                <View className="flex-row items-center border-t border-gray-50 pt-4">
                  <Clock size={12} color="#9CA3AF" />
                  <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">
                    Last Modified: Just Now
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}