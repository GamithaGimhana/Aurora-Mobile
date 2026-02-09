import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { fetchNotesThunk } from "@/src/redux/slices/notesSlice";
import { fetchFlashcardsThunk } from "@/src/redux/slices/flashcardsSlice";
import { 
  BookOpen, 
  Zap, 
  Plus, 
  TrendingUp,
  Clock,
  ArrowUpRight
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Theme and Data selectors
  const { darkMode } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);
  const { notes } = useAppSelector((state) => state.notes);
  const { cards } = useAppSelector((state) => state.flashcards);

  useEffect(() => {
    dispatch(fetchNotesThunk());
    dispatch(fetchFlashcardsThunk());
  }, []);

  // Theme-based colors
  const bgColor = darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]";
  const cardBg = darkMode ? "bg-white/5" : "bg-white";
  const cardBorder = darkMode ? "border-white/10" : "border-gray-100";
  const primaryText = darkMode ? "text-white" : "text-[#1A1A1A]";
  const secondaryText = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      {/* Dynamic Background Glow */}
      <View 
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl ${
          darkMode ? "bg-purple-900/20" : "bg-purple-100/50"
        }`} 
      />

      <SafeAreaView className="flex-1">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* --- HEADER SECTION --- */}
          <View className="px-8 pt-8 pb-6">
            <Animated.Text 
              entering={FadeInUp.delay(100)}
              className="text-gray-400 text-xs font-bold uppercase tracking-[2px]"
            >
              Master Everything
            </Animated.Text>
            <Animated.Text 
              entering={FadeInUp.delay(200)}
              className={`${primaryText} text-4xl font-black tracking-tighter mt-1`}
            >
              Hi, {user?.name?.split(" ")[0] || "Scholar"}!
            </Animated.Text>
          </View>

          {/* --- PERFORMANCE OVERVIEW --- */}
          <View className="px-8 mb-10">
            <Animated.View 
              entering={FadeInUp.delay(300)}
              className={`${darkMode ? "bg-purple-600" : "bg-white"} p-8 rounded-[40px] border ${cardBorder} shadow-xl shadow-purple-900/10`}
            >
              <View className="flex-row justify-between items-center mb-6">
                <View className={`${darkMode ? "bg-white/20" : "bg-purple-100"} px-4 py-2 rounded-full flex-row items-center`}>
                  <TrendingUp size={14} color={darkMode ? "white" : "#9333EA"} />
                  <Text className={`${darkMode ? "text-white" : "text-purple-700"} text-[10px] font-bold ml-2 uppercase tracking-widest`}>
                    Growth
                  </Text>
                </View>
                <Text className={`${darkMode ? "text-white/40" : "text-gray-300"} text-xs font-bold`}>AURORA v1.0</Text>
              </View>

              <View className="flex-row items-end justify-between">
                <View>
                  <Text className={`${darkMode ? "text-white" : "text-[#1A1A1A]"} text-4xl font-black`}>
                    {notes.length + cards.length}
                  </Text>
                  <Text className={`${darkMode ? "text-white/60" : "text-gray-400"} text-xs font-bold uppercase mt-1`}>
                    Study Assets
                  </Text>
                </View>
                <View className="items-end">
                   <Text className={`${darkMode ? "text-white" : "text-purple-600"} text-lg font-bold`}>Study Harder</Text>
                   <Text className={`${darkMode ? "text-white/50" : "text-gray-400"} text-[10px]`}>Active Session Ready</Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* --- ECOSYSTEM TOOLS --- */}
          <View className="px-8 gap-y-4">
            <View className="flex-row gap-x-4">
              <Animated.View entering={FadeInDown.delay(400)} className="flex-1">
                <Pressable 
                  onPress={() => router.push("/(dashboard)/notes")}
                  className={`${cardBg} border ${cardBorder} p-6 rounded-[35px] h-44 justify-between shadow-sm active:opacity-80`}
                >
                  <View className={`w-12 h-12 ${darkMode ? "bg-purple-500/20" : "bg-purple-50"} rounded-2xl items-center justify-center`}>
                    <BookOpen size={24} color="#9333EA" />
                  </View>
                  <View>
                    <Text className={`${primaryText} text-xl font-bold`}>Notes</Text>
                    <ArrowUpRight size={16} color={darkMode ? "#4B5563" : "#D1D5DB"} className="mt-1" />
                  </View>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(500)} className="flex-1">
                <Pressable 
                  onPress={() => router.push("/(dashboard)/flashcards")}
                  className={`${cardBg} border ${cardBorder} p-6 rounded-[35px] h-44 justify-between shadow-sm active:opacity-80`}
                >
                  <View className={`w-12 h-12 ${darkMode ? "bg-orange-500/20" : "bg-orange-50"} rounded-2xl items-center justify-center`}>
                    <Zap size={24} color="#F59E0B" />
                  </View>
                  <View>
                    <Text className={`${primaryText} text-xl font-bold`}>Recall</Text>
                    <ArrowUpRight size={16} color={darkMode ? "#4B5563" : "#D1D5DB"} className="mt-1" />
                  </View>
                </Pressable>
              </Animated.View>
            </View>

            {/* --- RECENT ACTIVITY --- */}
            <Animated.View entering={FadeInDown.delay(600)} className="mt-6">
              <View className="flex-row justify-between items-center mb-6 px-2">
                <Text className={`${primaryText} text-xl font-bold`}>Your Library</Text>
                <Pressable onPress={() => router.push("/(dashboard)/notes")}>
                  <Text className="text-purple-600 text-xs font-bold uppercase tracking-widest">See All</Text>
                </Pressable>
              </View>

              {notes.length === 0 ? (
                <View className={`${cardBg} rounded-[32px] p-10 items-center border border-dashed ${darkMode ? "border-white/10" : "border-gray-200"}`}>
                  <Text className="text-gray-400 font-medium text-center">No recent activity detected.</Text>
                </View>
              ) : (
                notes.slice(0, 3).map((note, index) => (
                  <View key={note.id} className={`${cardBg} border ${cardBorder} p-5 rounded-[28px] flex-row items-center mb-3 shadow-sm`}>
                    <View className={`w-12 h-12 ${darkMode ? "bg-white/10" : "bg-gray-50"} rounded-2xl items-center justify-center mr-4`}>
                      <Clock size={20} color={darkMode ? "#9CA3AF" : "#6B7280"} />
                    </View>
                    <View className="flex-1">
                      <Text className={`${primaryText} font-bold text-base`} numberOfLines={1}>{note.title}</Text>
                      <Text className={`${secondaryText} text-xs mt-0.5`} numberOfLines={1}>{note.content}</Text>
                    </View>
                  </View>
                ))
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* --- MODERN FAB --- */}
      <Animated.View entering={FadeInDown.delay(800)} className="absolute bottom-10 right-8">
        <Pressable
          onPress={() => router.push("/(dashboard)/notes/form")}
          className="bg-purple-600 w-16 h-16 rounded-full items-center justify-center shadow-xl shadow-purple-500/40 active:scale-90"
        >
          <Plus size={32} color="white" strokeWidth={2.5} />
        </Pressable>
      </Animated.View>
    </View>
  );
}