import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl,
  Alert,
  TextInput
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
  FileText,
  Search,
  X,
  SearchX
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SkeletonCard } from "@/src/components/SkeletonLoader";

export default function FlashcardsIndex() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeSection, setActiveSection] = useState<'sets' | 'cards'>('sets');
  const [searchQuery, setSearchQuery] = useState("");

  // Theme and Data selectors
  const { darkMode } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector(state => state.auth);
  const { cards, loading } = useAppSelector(state => state.flashcards);

  useEffect(() => {
    if (user) {
      dispatch(fetchFlashcardsThunk());
    }
  }, [user]);

  // --- FILTERING LOGIC ---
  const filteredCards = cards.filter(card => 
    card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered cards by title to create "Study Sets"
  const studySets = filteredCards.reduce((acc: any, card) => {
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

  // Theme-based style constants
  const bgColor = darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]";
  const cardBg = darkMode ? "bg-white/5" : "bg-white";
  const cardBorder = darkMode ? "border-white/10" : "border-gray-100";
  const primaryText = darkMode ? "text-white" : "text-[#1A1A1A]";
  const secondaryText = darkMode ? "text-gray-400" : "text-gray-500";
  const switcherBg = darkMode ? "bg-white/5" : "bg-white";
  const actionContainerBg = darkMode ? "bg-white/[0.02]" : "bg-gray-50/30";
  const searchBarBg = darkMode ? "bg-white/5" : "bg-white";

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <View className={`absolute top-[-50] left-[-50] w-96 h-96 rounded-full blur-3xl ${
        darkMode ? "bg-purple-900/15" : "bg-purple-100/40"
      }`} />

      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="px-8 pt-6 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className={`${primaryText} text-3xl font-black tracking-tighter`}>Aurora Flash</Text>
              <Text className="text-purple-600 text-[10px] font-bold uppercase tracking-widest mt-1">
                {activeSection === 'sets' ? `${studySetArray.length} Collections` : `${filteredCards.length} Cards Found`}
              </Text>
            </View>
            <Pressable 
              onPress={() => router.push("/(dashboard)/flashcards/form")}
              className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center shadow-lg shadow-purple-500/20 active:scale-90"
            >
              <Plus size={24} color="white" strokeWidth={3} />
            </Pressable>
          </View>

          {/* SEARCH BAR */}
          <Animated.View entering={FadeInUp.delay(200)} className={`flex-row items-center mt-6 px-4 h-14 rounded-2xl border ${cardBorder} ${searchBarBg} shadow-sm`}>
            <Search size={18} color={darkMode ? "#6B7280" : "#9CA3AF"} />
            <TextInput
              placeholder="Search sets or questions..."
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

        {/* SECTION SWITCHER */}
        <View className="px-8 mt-4 mb-4">
          <View className={`${switcherBg} p-1 rounded-2xl flex-row border ${cardBorder} shadow-sm`}>
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
          {loading ? (
            [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
          ) : filteredCards.length === 0 ? (
            <Animated.View entering={FadeInUp} className="py-20 items-center justify-center">
              <View className={`w-24 h-24 rounded-[35px] items-center justify-center mb-6 shadow-sm border ${cardBorder} ${cardBg}`}>
                <SearchX size={40} color={darkMode ? "#4B5563" : "#D1D5DB"} />
              </View>
              <Text className={`${primaryText} text-xl font-bold`}>No matches found</Text>
              <Text className="text-gray-400 text-center mt-2 px-6 font-medium">Try a different keyword or create a new flashcard.</Text>
            </Animated.View>
          ) : (
            <>
              {/* STUDY SETS VIEW */}
              {activeSection === 'sets' && studySetArray.map((set: any, index: number) => (
                <Animated.View key={set.title} entering={FadeInDown.delay(index * 50)}>
                  <Pressable
                    onPress={() => router.push({ pathname: "/(dashboard)/flashcards/study", params: { title: set.title } })}
                    className={`${cardBg} border ${cardBorder} rounded-[32px] mb-4 p-6 shadow-sm shadow-purple-900/5 active:opacity-80`}
                  >
                    <View className="flex-row justify-between items-start mb-6">
                      <View className={`w-12 h-12 rounded-2xl items-center justify-center ${darkMode ? "bg-purple-500/20" : "bg-purple-50"}`}>
                        <BookOpen size={22} color={darkMode ? "#A855F7" : "#9333EA"} />
                      </View>
                      <View className="bg-purple-600 px-4 py-2 rounded-full flex-row items-center shadow-sm">
                        <Play size={10} color="white" fill="white" />
                        <Text className="text-white text-[10px] font-black ml-2 uppercase tracking-tighter">Study Now</Text>
                      </View>
                    </View>
                    <Text className={`${primaryText} text-2xl font-black mb-1`}>{set.title}</Text>
                    <View className="flex-row items-center">
                      <Zap size={14} color="#9333EA" />
                      <Text className={`${secondaryText} text-xs font-bold ml-2 uppercase tracking-widest`}>
                        {set.count} Interactive Cards
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}

              {/* INDIVIDUAL CARDS VIEW */}
              {activeSection === 'cards' && filteredCards.map((card, index) => (
                <Animated.View key={card.id} entering={FadeInDown.delay(index * 30)}>
                  <View className={`${cardBg} border ${cardBorder} rounded-[24px] mb-3 overflow-hidden shadow-sm shadow-purple-900/5`}>
                    <View className="p-5 flex-row items-center">
                      <View className="w-2 h-2 bg-purple-500 rounded-full mr-4" />
                      <View className="flex-1">
                        <Text className={`${primaryText} text-sm font-bold`} numberOfLines={1}>{card.question}</Text>
                        <Text className={`${secondaryText} text-[10px] uppercase font-bold tracking-wider mt-1`}>{card.title}</Text>
                      </View>
                    </View>
                    <View className={`flex-row border-t ${darkMode ? "border-white/5" : "border-gray-50"} ${actionContainerBg}`}>
                      <Pressable 
                        onPress={() => router.push({ pathname: "/(dashboard)/flashcards/form", params: { cardId: card.id } })}
                        className={`flex-1 flex-row items-center justify-center py-4 border-r ${darkMode ? "border-white/5 active:bg-purple-500/10" : "border-gray-100 active:bg-purple-50"}`}
                      >
                        <Edit3 size={14} color={darkMode ? "#A855F7" : "#9333EA"} />
                        <Text className="text-purple-600 text-[10px] font-bold ml-2 uppercase tracking-widest">Edit</Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => confirmDelete(card.id)}
                        className={`flex-1 flex-row items-center justify-center py-4 ${darkMode ? "active:bg-red-500/10" : "active:bg-red-50"}`}
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