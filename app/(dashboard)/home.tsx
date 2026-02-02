import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
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
  Search, 
  Bell, 
  TrendingUp,
  Clock
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notes } = useAppSelector((state) => state.notes);
  const { cards } = useAppSelector((state) => state.flashcards);

  useEffect(() => {
    dispatch(fetchNotesThunk());
    dispatch(fetchFlashcardsThunk());
  }, []);

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      {/* Subtle Background Glow */}
      <View className="absolute top-0 right-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-6 flex-row items-center justify-between py-6">
            <View>
              <Text className="text-gray-500 text-sm font-medium">Good Morning,</Text>
              <Text className="text-white text-3xl font-black tracking-tighter">
                {user?.name?.split(" ")[0] || "Scholar"}
              </Text>
            </View>
            <View className="flex-row gap-x-3">
              <Pressable className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10 active:bg-white/20">
                <Search size={22} color="white" />
              </Pressable>
              <Pressable className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10 active:bg-white/20">
                <Bell size={22} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Bento Grid Sections */}
          <View className="px-6 py-2 gap-y-4">
            
            {/* Featured Card - Stats */}
            <Animated.View entering={FadeInUp.delay(200)} className="bg-purple-600 rounded-[32px] p-6 overflow-hidden">
              <View className="flex-row justify-between items-start">
                <View>
                  <View className="bg-white/20 self-start px-3 py-1 rounded-full flex-row items-center mb-4">
                    <TrendingUp size={12} color="white" />
                    <Text className="text-white text-[10px] font-bold ml-1 uppercase tracking-widest">Efficiency</Text>
                  </View>
                  <Text className="text-white text-2xl font-black leading-7">Mastery in{"\n"}Progress</Text>
                </View>
                <Zap size={40} color="white" opacity={0.3} />
              </View>
              <View className="mt-6 flex-row items-center gap-x-4">
                <View>
                  <Text className="text-white/60 text-[10px] font-bold uppercase">Notes</Text>
                  <Text className="text-white text-lg font-black">{notes.length}</Text>
                </View>
                <View className="w-[1px] h-8 bg-white/20" />
                <View>
                  <Text className="text-white/60 text-[10px] font-bold uppercase">Flashcards</Text>
                  <Text className="text-white text-lg font-black">{cards.length}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Core Modules - Two Columns */}
            <View className="flex-row gap-x-4">
              <Animated.View entering={FadeInDown.delay(400)} className="flex-1">
                <Pressable 
                  onPress={() => router.push("/(dashboard)/notes")}
                  className="bg-white/5 border border-white/10 p-6 rounded-[32px] h-48 justify-between active:bg-white/10"
                >
                  <View className="w-12 h-12 bg-purple-500/20 rounded-2xl items-center justify-center">
                    <BookOpen size={24} color="#A855F7" />
                  </View>
                  <View>
                    <Text className="text-white text-xl font-bold">Notes</Text>
                    <Text className="text-gray-500 text-xs">Rich Text Docs</Text>
                  </View>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(500)} className="flex-1">
                <Pressable 
                  onPress={() => router.push("/(dashboard)/flashcards")}
                  className="bg-white/5 border border-white/10 p-6 rounded-[32px] h-48 justify-between active:bg-white/10"
                >
                  <View className="w-12 h-12 bg-emerald-500/20 rounded-2xl items-center justify-center">
                    <Zap size={24} color="#10B981" />
                  </View>
                  <View>
                    <Text className="text-white text-xl font-bold">Flashcards</Text>
                    <Text className="text-gray-500 text-xs">Active Recall</Text>
                  </View>
                </Pressable>
              </Animated.View>
            </View>

            {/* Recent Activity Section */}
            <Animated.View entering={FadeInDown.delay(600)} className="mt-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-xl font-bold">Recent Notes</Text>
                <Pressable onPress={() => router.push("/(dashboard)/notes")}>
                  <Text className="text-purple-400 text-xs font-bold">See All</Text>
                </Pressable>
              </View>

              {notes.length === 0 ? (
                <View className="bg-white/5 rounded-3xl p-8 items-center border border-dashed border-white/10">
                  <Text className="text-gray-500 italic">No notes created yet</Text>
                </View>
              ) : (
                notes.slice(0, 2).map((note, index) => (
                  <View key={note.id} className="bg-white/5 border border-white/10 p-5 rounded-3xl flex-row items-center mb-3">
                    <View className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center mr-4">
                      <Clock size={18} color="#9CA3AF" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold" numberOfLines={1}>{note.title}</Text>
                      <Text className="text-gray-500 text-xs" numberOfLines={1}>{note.content}</Text>
                    </View>
                  </View>
                ))
              )}
            </Animated.View>

          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Floating Action Button */}
      <Animated.View entering={FadeInDown.delay(800)} className="absolute bottom-10 right-8">
        <Pressable
          onPress={() => router.push("/(dashboard)/notes/form")}
          className="bg-purple-600 w-16 h-16 rounded-full items-center justify-center shadow-xl shadow-purple-500/40 active:scale-95"
        >
          <Plus size={32} color="white" strokeWidth={2.5} />
        </Pressable>
      </Animated.View>
    </View>
  );
}