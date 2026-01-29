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
import { fetchFlashcardsThunk } from "@/src/redux/slices/flashcardsSlice";
import { 
  Zap, 
  Plus, 
  BrainCircuit, 
  ChevronRight, 
  Search,
  RotateCcw
} from "lucide-react-native";

export default function Flashcards() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);
  const { cards, loading, error } = useAppSelector(state => state.flashcards);

  useEffect(() => {
    if (user) {
      dispatch(fetchFlashcardsThunk());
    }
  }, [user, dispatch]);

  const onRefresh = () => {
    dispatch(fetchFlashcardsThunk());
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* --- DYNAMIC HEADER --- */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between bg-white border-b border-gray-100 shadow-sm">
          <View>
            <Text className="text-3xl font-black text-gray-900 tracking-tighter">Flashcards</Text>
            <Text className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mt-1">
              Active Recall: {cards.length} Cards
            </Text>
          </View>
          <View className="flex-row">
            <Pressable className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-2 border border-gray-100">
              <Search size={18} color="#10B981" />
            </Pressable>
            <Pressable 
              onPress={() => router.push("/(dashboard)/flashcards/form")}
              className="w-10 h-10 bg-emerald-600 rounded-full items-center justify-center shadow-lg shadow-emerald-200"
            >
              <Plus size={20} color="white" strokeWidth={3} />
            </Pressable>
          </View>
        </View>

        {/* --- LIST CONTENT --- */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={loading && cards.length > 0} onRefresh={onRefresh} tintColor="#10B981" />
          }
        >
          {loading && cards.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-gray-400 font-bold mt-4">Charging your Brain...</Text>
            </View>
          ) : error ? (
            <View className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-6">
              <Text className="text-red-600 text-center font-bold">{error}</Text>
            </View>
          ) : cards.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
              <View className="w-20 h-20 bg-emerald-50 rounded-full items-center justify-center mb-6">
                <BrainCircuit size={40} color="#10B981" />
              </View>
              <Text className="text-xl font-bold text-gray-900">No cards found</Text>
              <Text className="text-gray-400 text-center px-10 mt-2 leading-5">
                Generate flashcards to start your active recall session. 
              </Text>
            </View>
          ) : (
            cards.map((card) => (
              <Pressable
                key={card.id}
                onPress={() =>
                  router.push({
                    pathname: "/(dashboard)/flashcards/form",
                    params: { cardId: card.id },
                  })
                }
                className="bg-white p-6 rounded-[32px] mb-4 border border-gray-100 shadow-sm active:scale-[0.98]"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="bg-emerald-50 p-2 rounded-xl">
                    <Zap size={18} color="#10B981" />
                  </View>
                  <ChevronRight size={18} color="#D1D5DB" />
                </View>

                <Text className="text-lg font-bold text-gray-900 mb-2" numberOfLines={2}>
                  {card.question} 
                </Text>
                
                <View className="bg-slate-50 p-4 rounded-2xl">
                  <Text className="text-gray-500 text-xs italic" numberOfLines={2}>
                    {card.answer}
                  </Text>
                </View>

                <View className="flex-row items-center mt-4">
                  <RotateCcw size={12} color="#10B981" />
                  <Text className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-2">
                    Ready for Review
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