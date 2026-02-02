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
  Search,
  Trash2,
  Edit3,
  Clock
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function FlashcardsIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);
  const { cards, loading, error } = useAppSelector(state => state.flashcards);

  useEffect(() => {
    if (user) {
      dispatch(fetchFlashcardsThunk());
    }
  }, [user]);

  const onRefresh = () => {
    dispatch(fetchFlashcardsThunk());
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Delete Flashcard",
      "Are you sure you want to remove this card?",
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
      
      {/* Background Glow */}
      <View className="absolute top-[-50] left-[-50] w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="px-6 flex-row items-center justify-between py-6">
          <View>
            <Text className="text-white text-3xl font-black tracking-tighter">Flashcards</Text>
            <Text className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              {cards.length} Active Recall Cards
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
              <Text className="text-gray-500 mt-4 font-medium">Powering up your brain...</Text>
            </View>
          ) : cards.length === 0 ? (
            <Animated.View entering={FadeInUp} className="py-20 items-center justify-center">
              <View className="w-20 h-20 bg-white/5 rounded-full items-center justify-center mb-6">
                <BrainCircuit size={40} color="#4B5563" />
              </View>
              <Text className="text-white text-xl font-bold">No cards found</Text>
              <Text className="text-gray-500 text-center mt-2 px-10">Start your recall session by creating your first card.</Text>
              <Pressable 
                onPress={() => router.push({ pathname: "/(dashboard)/flashcards/form", params: {} })}
                className="mt-8 bg-purple-600/20 px-6 py-3 rounded-xl border border-purple-500/30"
              >
                <Text className="text-purple-400 font-bold">Add First Card</Text>
              </Pressable>
            </Animated.View>
          ) : (
            cards.map((card, index) => (
              <Animated.View 
                key={card.id} 
                entering={FadeInDown.delay(index * 100).duration(500)}
              >
                <View className="bg-white/5 border border-white/10 rounded-[32px] mb-4 overflow-hidden shadow-sm">
                  <Pressable
                    onPress={() => router.push({ pathname: "/(dashboard)/flashcards/form", params: { cardId: card.id } })}
                    className="p-6 active:bg-white/10"
                  >
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="bg-purple-500/20 p-2 rounded-xl">
                        <Zap size={18} color="#A855F7" />
                      </View>
                      <View className="flex-row items-center">
                        <Clock size={12} color="#4B5563" />
                        <Text className="text-gray-500 text-[10px] font-bold ml-1">
                          {new Date(card.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-white text-lg font-bold mb-3" numberOfLines={2}>
                      {card.question}
                    </Text>
                    
                    <View className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                      <Text className="text-gray-500 text-sm italic" numberOfLines={2}>
                        {card.answer}
                      </Text>
                    </View>
                  </Pressable>

                  {/* QUICK ACTIONS */}
                  <View className="flex-row border-t border-white/5 bg-white/[0.02]">
                    <Pressable 
                      onPress={() => router.push({ pathname: "/(dashboard)/flashcards/form", params: { cardId: card.id } })}
                      className="flex-1 flex-row items-center justify-center py-4 border-r border-white/5 active:bg-purple-500/10"
                    >
                      <Edit3 size={14} color="#A855F7" />
                      <Text className="text-purple-400 text-xs font-bold ml-2 uppercase tracking-widest">Edit</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => confirmDelete(card.id)}
                      className="flex-1 flex-row items-center justify-center py-4 active:bg-red-500/10"
                    >
                      <Trash2 size={14} color="#EF4444" />
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