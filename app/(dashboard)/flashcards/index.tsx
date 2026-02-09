import React, { useEffect, useState } from "react";
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
  Edit3,
  Layers,
  FileText
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function FlashcardsIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeSection, setActiveSection] = useState<'sets' | 'cards'>('sets');

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
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      <View className="absolute top-[-50] left-[-50] w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="px-8 flex-row items-center justify-between py-6">
          <View>
            <Text className="text-[#1A1A1A] text-3xl font-black tracking-tighter">Aurora Flash</Text>
            <Text className="text-purple-600 text-[10px] font-bold uppercase tracking-widest mt-1">
              {activeSection === 'sets' ? `${studySetArray.length} Collections` : `${cards.length} Total Cards`}
            </Text>
          </View>
          <Pressable 
            onPress={() => router.push("/(dashboard)/flashcards/form")}
            className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center shadow-lg shadow-purple-200 active:scale-90"
          >
            <Plus size={24} color="white" strokeWidth={3} />
          </Pressable>
        </View>

        {/* SECTION SWITCHER */}
        <View className="px-8 mb-6">
          <View className="bg-white p-1 rounded-2xl flex-row border border-gray-100 shadow-sm">
            <Pressable 
              onPress={() => setActiveSection('sets')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${activeSection === 'sets' ? 'bg-purple-600' : ''}`}
            >
              <Layers size={16} color={activeSection === 'sets' ? "white" : "#9CA3AF"} />
              <Text className={`ml-2 font-bold uppercase text-[10px] tracking-widest ${activeSection === 'sets' ? 'text-white' : 'text-gray-400'}`}>Sets</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => setActiveSection('cards')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${activeSection === 'cards' ? 'bg-purple-600' : ''}`}
            >
              <FileText size={16} color={activeSection === 'cards' ? "white" : "#9CA3AF"} />
              <Text className={`ml-2 font-bold uppercase text-[10px] tracking-widest ${activeSection === 'cards' ? 'text-white' : 'text-gray-400'}`}>Cards</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={loading && cards.length > 0} onRefresh={onRefresh} tintColor="#9333EA" />
          }
        >
          {loading && cards.length === 0 ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#9333EA" />
            </View>
          ) : cards.length === 0 ? (
            <Animated.View entering={FadeInUp} className="py-20 items-center justify-center">
              <View className="w-24 h-24 bg-white rounded-[35px] items-center justify-center mb-6 shadow-sm border border-gray-100">
                <BrainCircuit size={40} color="#D1D5DB" />
              </View>
              <Text className="text-[#1A1A1A] text-xl font-bold">No Data Yet</Text>
              <Text className="text-gray-400 text-center mt-2 px-6 font-medium">Create your first set of cards to begin active recall.</Text>
            </Animated.View>
          ) : (
            <>
              {/* STUDY SETS VIEW */}
              {activeSection === 'sets' && studySetArray.map((set: any, index: number) => (
                <Animated.View key={set.title} entering={FadeInDown.delay(index * 100)}>
                  <Pressable
                    onPress={() => router.push({ pathname: "/(dashboard)/flashcards/study", params: { title: set.title } })}
                    className="bg-white border border-gray-100 rounded-[32px] mb-4 p-6 shadow-sm shadow-purple-900/5 active:bg-gray-50"
                  >
                    <View className="flex-row justify-between items-start mb-6">
                      <View className="w-12 h-12 bg-purple-50 rounded-2xl items-center justify-center">
                        <BookOpen size={22} color="#9333EA" />
                      </View>
                      <View className="bg-purple-600 px-4 py-2 rounded-full flex-row items-center shadow-sm">
                        <Play size={10} color="white" fill="white" />
                        <Text className="text-white text-[10px] font-black ml-2 uppercase tracking-tighter">Study Now</Text>
                      </View>
                    </View>
                    <Text className="text-[#1A1A1A] text-2xl font-black mb-1">{set.title}</Text>
                    <View className="flex-row items-center">
                      <Zap size={14} color="#9333EA" />
                      <Text className="text-gray-400 text-xs font-bold ml-2 uppercase tracking-widest">
                        {set.count} Interactive Cards
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}

              {/* INDIVIDUAL CARDS VIEW */}
              {activeSection === 'cards' && cards.map((card, index) => (
                <Animated.View key={card.id} entering={FadeInDown.delay(index * 50)}>
                  <View className="bg-white border border-gray-100 rounded-[24px] mb-3 overflow-hidden shadow-sm shadow-purple-900/5">
                    <View className="p-5 flex-row items-center">
                      <View className="w-2 h-2 bg-purple-500 rounded-full mr-4" />
                      <View className="flex-1">
                        <Text className="text-[#1A1A1A] text-sm font-bold" numberOfLines={1}>{card.question}</Text>
                        <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-1">{card.title}</Text>
                      </View>
                    </View>
                    <View className="flex-row border-t border-gray-50 bg-gray-50/30">
                      <Pressable 
                        onPress={() => router.push({ pathname: "/(dashboard)/flashcards/form", params: { cardId: card.id } })}
                        className="flex-1 flex-row items-center justify-center py-4 border-r border-gray-100 active:bg-purple-50"
                      >
                        <Edit3 size={14} color="#9333EA" />
                        <Text className="text-purple-600 text-[10px] font-bold ml-2 uppercase tracking-widest">Edit</Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => confirmDelete(card.id)}
                        className="flex-1 flex-row items-center justify-center py-4 active:bg-red-50"
                      >
                        <Trash2 size={14} color="#EF4444" />
                        <Text className="text-red-500 text-[10px] font-bold ml-2 uppercase tracking-widest">Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}