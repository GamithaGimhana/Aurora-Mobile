import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl,
  Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { fetchFlashcardsThunk, deleteFlashcardThunk } from "@/src/redux/slices/flashcardsSlice";
import { 
  Plus, 
  Zap, 
  BrainCircuit, 
  ChevronRight,
  BookOpen,
  Play,
  Trash2,
  Edit3
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function FlashcardsIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);
  const { cards, loading } = useAppSelector(state => state.flashcards);

  useEffect(() => {
    if (user) {
      dispatch(fetchFlashcardsThunk());
    }
  }, [user]);

  // Group cards by title to create "Study Sets"
  const studySets = cards.reduce((acc: any, card) => {
    const title = card.title || "Uncategorized";
    if (!acc[title]) {
      acc[title] = { title, count: 0, lastCreated: card.createdAt };
    }
    acc[title].count += 1;
    return acc;
  }, {});

  const studySetArray = Object.values(studySets);

  const onRefresh = () => {
    dispatch(fetchFlashcardsThunk());
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete Flashcard",
      "Are you sure you want to permanently remove this card?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => dispatch(deleteFlashcardThunk(id)) 
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      <View className="absolute top-[-50] left-[-50] w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        <View className="px-6 flex-row items-center justify-between py-6">
          <View>
            <Text className="text-white text-3xl font-black tracking-tighter">Study Sets</Text>
            <Text className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              {studySetArray.length} Collections Available
            </Text>
          </View>
          <Pressable 
            onPress={() => router.push({ pathname: "/(dashboard)/flashcards/form", params: {} })}
            className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center shadow-lg active:scale-95"
          >
            <Plus size={24} color="white" strokeWidth={3} />
          </Pressable>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={loading && cards.length > 0} onRefresh={onRefresh} tintColor="#A855F7" />
          }
        >
          {loading && cards.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#A855F7" />
            </View>
          ) : studySetArray.length === 0 ? (
            <Animated.View entering={FadeInUp} className="py-20 items-center justify-center">
              <View className="w-20 h-20 bg-white/5 rounded-full items-center justify-center mb-6">
                <BrainCircuit size={40} color="#4B5563" />
              </View>
              <Text className="text-white text-xl font-bold">No Collections</Text>
              <Pressable 
                onPress={() => router.push({ pathname: "/(dashboard)/flashcards/form", params: {} })}
                className="mt-6 bg-purple-600/20 px-6 py-3 rounded-xl border border-purple-500/30"
              >
                <Text className="text-purple-400 font-bold">Create First Card</Text>
              </Pressable>
            </Animated.View>
          ) : (
            studySetArray.map((set: any, index: number) => (
              <Animated.View 
                key={set.title} 
                entering={FadeInDown.delay(index * 100).duration(500)}
              >
                <Pressable
                  onPress={() => router.push({ 
                    pathname: "/(dashboard)/flashcards/study", 
                    params: { title: set.title } 
                  })}
                  className="bg-white/5 border border-white/10 rounded-[32px] mb-4 p-6 active:bg-white/10"
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="w-12 h-12 bg-purple-500/20 rounded-2xl items-center justify-center">
                      <BookOpen size={22} color="#A855F7" />
                    </View>
                    <View className="bg-purple-600 px-3 py-1 rounded-full flex-row items-center">
                      <Play size={10} color="white" fill="white" />
                      <Text className="text-white text-[10px] font-black ml-1 uppercase">Study</Text>
                    </View>
                  </View>

                  <Text className="text-white text-2xl font-black mb-1">{set.title}</Text>
                  <View className="flex-row items-center">
                    <Zap size={14} color="#A855F7" />
                    <Text className="text-gray-500 text-xs font-bold ml-2 uppercase tracking-widest">
                      {set.count} Cards in Set
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))
          )}

          <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-[2px] mt-8 mb-4 ml-1">
            Manage Individual Cards
          </Text>
          
          {cards.map((card, index) => (
              <Animated.View 
                key={card.id} 
                entering={FadeInDown.delay(index * 50).duration(400)}
              >
                <View className="bg-white/5 border border-white/10 rounded-[24px] mb-3 overflow-hidden">
                  <View className="p-4 flex-row items-center">
                    <View className="w-2 h-2 bg-purple-500 rounded-full mr-4" />
                    <View className="flex-1">
                      <Text className="text-white text-sm font-bold" numberOfLines={1}>{card.question}</Text>
                      <Text className="text-gray-500 text-[10px] uppercase font-bold mt-1">{card.title}</Text>
                    </View>
                  </View>

                  <View className="flex-row border-t border-white/5 bg-white/[0.02]">
                    <Pressable 
                      onPress={() => router.push({ pathname: "/(dashboard)/flashcards/form", params: { cardId: card.id } })}
                      className="flex-1 flex-row items-center justify-center py-3 border-r border-white/5 active:bg-purple-500/10"
                    >
                      <Edit3 size={14} color="#A855F7" />
                      <Text className="text-purple-400 text-[10px] font-bold ml-2 uppercase">Edit</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => confirmDelete(card.id)}
                      className="flex-1 flex-row items-center justify-center py-3 active:bg-red-500/10"
                    >
                      <Trash2 size={14} color="#EF4444" />
                      <Text className="text-red-500 text-[10px] font-bold ml-2 uppercase">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}