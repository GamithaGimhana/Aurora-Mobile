import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  Alert, 
  TextInput 
} from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { fetchNotesThunk, deleteNoteThunk } from "@/src/redux/slices/notesSlice";
import { 
  Plus, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Search, 
  X, 
  Trash2, 
  Edit3, 
  SearchX 
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SkeletonCard } from "@/src/components/SkeletonLoader"; 

export default function NotesIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  // Theme and Data selectors
  const { darkMode } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);
  const { notes, loading } = useAppSelector((state) => state.notes);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotesThunk());
    }
  }, [user]);

  // Search Logic
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Theme-based style constants
  const bgColor = darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]";
  const cardBg = darkMode ? "bg-white/5" : "bg-white";
  const cardBorder = darkMode ? "border-white/10" : "border-gray-100";
  const primaryText = darkMode ? "text-white" : "text-[#1A1A1A]";
  const secondaryText = darkMode ? "text-gray-500" : "text-gray-400";
  const actionContainerBg = darkMode ? "bg-white/[0.02]" : "bg-gray-50/30";
  const searchBarBg = darkMode ? "bg-white/5" : "bg-white";

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      <View className={`absolute top-[-50] left-[-50] w-96 h-96 rounded-full blur-3xl ${
        darkMode ? "bg-purple-900/20" : "bg-purple-100/40"
      }`} />

      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="px-8 pt-6 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className={`${primaryText} text-3xl font-black tracking-tighter`}>My Notes</Text>
              <Text className={`${secondaryText} text-xs font-bold uppercase tracking-widest mt-1`}>
                {notes.length} Collections
              </Text>
            </View>
            <Pressable 
              onPress={() => router.push({ pathname: "/(dashboard)/notes/form", params: {} })}
              className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center shadow-lg shadow-purple-500/20 active:scale-90"
            >
              <Plus size={24} color="white" strokeWidth={3} />
            </Pressable>
          </View>

          {/* SEARCH BAR */}
          <Animated.View entering={FadeInUp.delay(200)} className={`flex-row items-center mt-6 px-4 h-14 rounded-2xl border ${cardBorder} ${searchBarBg} shadow-sm shadow-black/5`}>
            <Search size={18} color={darkMode ? "#6B7280" : "#9CA3AF"} />
            <TextInput
              placeholder="Search by title..."
              placeholderTextColor={darkMode ? "#6B7280" : "#9CA3AF"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className={`flex-1 ml-3 font-bold ${primaryText}`}
            />
            {searchQuery !== "" && (
              <Pressable onPress={() => setSearchQuery("")} className="p-1">
                <X size={18} color={darkMode ? "#A855F7" : "#9333EA"} />
              </Pressable>
            )}
          </Animated.View>
        </View>

        {/* CONTENT */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100 }}
        >
          {loading ? (
            // Show Skeleton Loaders while fetching
            [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
          ) : filteredNotes.length === 0 ? (
            <Animated.View entering={FadeInUp} className="py-20 items-center justify-center">
              <View className={`w-24 h-24 rounded-[35px] items-center justify-center mb-6 shadow-sm border ${cardBorder} ${cardBg}`}>
                <SearchX size={40} color={darkMode ? "#4B5563" : "#D1D5DB"} />
              </View>
              <Text className={`${primaryText} text-xl font-bold`}>No notes found</Text>
              <Text className="text-gray-400 text-center mt-2 px-10 font-medium">
                Try searching for a different title or create a new note.
              </Text>
            </Animated.View>
          ) : (
            filteredNotes.map((note, index) => (
              <Animated.View 
                key={note.id} 
                entering={FadeInDown.delay(index * 50).duration(400)}
              >
                <View className={`${cardBg} border ${cardBorder} rounded-[32px] mb-5 overflow-hidden shadow-sm shadow-purple-900/5`}>
                  <Pressable
                    onPress={() => router.push({ pathname: "/(dashboard)/notes/view", params: { noteId: note.id } })}
                    className={`p-6 flex-row items-center ${darkMode ? "active:bg-white/5" : "active:bg-gray-50"}`}
                  >
                    <View className={`w-14 h-14 rounded-[20px] items-center justify-center mr-4 ${
                      darkMode ? "bg-purple-500/20" : "bg-purple-50"
                    }`}>
                      <BookOpen size={24} color={darkMode ? "#A855F7" : "#9333EA"} />
                    </View>
                    
                    <View className="flex-1">
                      <Text className={`${primaryText} text-lg font-bold mb-1`} numberOfLines={1}>
                        {note.title}
                      </Text>
                      <View className="flex-row items-center">
                        <Clock size={12} color={darkMode ? "#6B7280" : "#9CA3AF"} />
                        <Text className={`${secondaryText} text-[10px] font-bold uppercase tracking-wider ml-1`}>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color={darkMode ? "#374151" : "#D1D5DB"} />
                  </Pressable>

                  <View className={`flex-row border-t ${darkMode ? "border-white/5" : "border-gray-50"} ${actionContainerBg}`}>
                    <Pressable 
                      onPress={() => router.push({ pathname: "/(dashboard)/notes/form", params: { noteId: note.id } })}
                      className={`flex-1 flex-row items-center justify-center py-4 border-r ${
                        darkMode ? "border-white/5 active:bg-purple-500/10" : "border-gray-100 active:bg-purple-50"
                      }`}
                    >
                      <Edit3 size={16} color={darkMode ? "#A855F7" : "#9333EA"} />
                      <Text className="text-purple-500 text-xs font-bold ml-2 uppercase tracking-widest">Edit</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => confirmDelete(note.id, note.title)}
                      className={`flex-1 flex-row items-center justify-center py-4 ${
                        darkMode ? "active:bg-red-500/10" : "active:bg-red-50"
                      }`}
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