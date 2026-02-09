import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Dimensions, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { ChevronLeft, Rotate3d, ChevronRight, Shuffle, AlertTriangle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  FadeIn
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function StudyMode() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const router = useRouter();
  
  // Theme and Data selectors
  const { darkMode } = useAppSelector((state) => state.theme);
  const { cards, loading } = useAppSelector(state => state.flashcards);
  
  const initialSet = cards.filter(c => c.title === title);

  const [studySet, setStudySet] = useState(initialSet);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipRotation = useSharedValue(0);

  useEffect(() => {
    setStudySet(initialSet);
  }, [cards, title]);

  const shuffleDeck = () => {
    const shuffled = [...studySet].sort(() => Math.random() - 0.5);
    setStudySet(shuffled);
    setCurrentIndex(0);
    resetFlip();
  };

  const resetFlip = () => {
    setIsFlipped(false);
    flipRotation.value = withTiming(0, { duration: 300 });
  };

  const flipCard = () => {
    const targetValue = isFlipped ? 0 : 180;
    flipRotation.value = withTiming(targetValue, { duration: 400 });
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < studySet.length - 1) {
      resetFlip();
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    } else {
      router.back();
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      resetFlip();
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flipRotation.value}deg` }],
    backfaceVisibility: "hidden",
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flipRotation.value - 180}deg` }],
    backfaceVisibility: "hidden",
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
  }));

  // Theme constants
  const bgColor = darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]";
  const cardBg = darkMode ? "bg-white/5" : "bg-white";
  const cardBorder = darkMode ? "border-white/10" : "border-gray-100";
  const primaryText = darkMode ? "text-white" : "text-[#1A1A1A]";
  const headerBtnBg = darkMode ? "bg-white/5" : "bg-white";
  const headerBtnBorder = darkMode ? "border-white/10" : "border-gray-200";

  // --- LOADING STATE ---
  if (loading && studySet.length === 0) {
    return (
      <View className={`flex-1 ${bgColor} justify-center items-center`}>
        <ActivityIndicator color="#9333EA" size="large" />
      </View>
    );
  }

  // --- ERROR / EMPTY STATE ---
  if (studySet.length === 0) {
    return (
      <View className={`flex-1 ${bgColor} justify-center items-center px-10`}>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <Animated.View entering={FadeIn} className="items-center">
          <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${darkMode ? "bg-purple-500/10" : "bg-purple-50"}`}>
             <AlertTriangle size={40} color="#9333EA" />
          </View>
          <Text className={`text-xl font-bold text-center ${primaryText}`}>No cards in this set</Text>
          <Text className="text-gray-500 text-center mt-2 leading-5">
            This study collection is currently empty. Add cards to start active recall.
          </Text>
          <Pressable 
            onPress={() => router.back()}
            className="mt-8 bg-purple-600 px-8 py-4 rounded-2xl shadow-lg"
          >
            <Text className="text-white font-bold">Go Back</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <SafeAreaView className="flex-1 px-6">
        
        {/* HEADER */}
        <View className="flex-row items-center justify-between py-6">
          <Pressable 
            onPress={() => router.back()} 
            className={`w-11 h-11 ${headerBtnBg} rounded-2xl items-center justify-center border ${headerBtnBorder} shadow-sm active:opacity-70`}
          >
            <ChevronLeft color={darkMode ? "white" : "#1A1A1A"} size={22} />
          </Pressable>
          <View className="items-center">
            <Text className={`${primaryText} font-black text-lg tracking-tight`}>{title}</Text>
            <Text className="text-purple-600 text-[10px] font-bold uppercase tracking-[2px]">Focus Mode</Text>
          </View>
          <Pressable 
            onPress={shuffleDeck} 
            className={`w-11 h-11 rounded-2xl items-center justify-center border shadow-sm active:opacity-70 ${
              darkMode ? "bg-purple-900/20 border-purple-500/30" : "bg-purple-50 border-purple-100"
            }`}
          >
            <Shuffle size={20} color="#9333EA" />
          </Pressable>
        </View>

        {/* PROGRESS INDICATOR */}
        <View className="flex-row justify-center mb-8">
            <View className={`${headerBtnBg} px-5 py-1.5 rounded-full border ${headerBtnBorder} shadow-sm`}>
                <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                   Card <Text className="text-purple-600 font-black">{currentIndex + 1}</Text> of {studySet.length}
                </Text>
            </View>
        </View>

        {/* CARD CONTAINER */}
        <Animated.View entering={FadeIn.duration(800)} className="flex-1 justify-center items-center">
          <Pressable onPress={flipCard} style={{ width: width * 0.88, height: 450 }}>
            {/* FRONT (QUESTION) */}
            <Animated.View style={[frontStyle]} className={`w-full h-full border ${cardBorder} ${cardBg} rounded-[45px] items-center justify-center p-10 shadow-xl shadow-purple-900/5`}>
              <Text className="text-purple-600 text-[10px] font-black uppercase tracking-[4px] mb-8">Question</Text>
              <Text className={`${primaryText} text-2xl font-bold text-center leading-10 tracking-tight`}>
                {studySet[currentIndex].question}
              </Text>
              <View className={`absolute bottom-12 flex-row items-center px-5 py-2.5 rounded-2xl border ${
                darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"
              }`}>
                <Rotate3d size={16} color="#9333EA" />
                <Text className="text-gray-500 text-[10px] font-bold ml-2 uppercase tracking-widest">Tap to flip</Text>
              </View>
            </Animated.View>

            {/* BACK (ANSWER) */}
            <Animated.View style={[backStyle]} className="w-full h-full bg-purple-600 rounded-[45px] items-center justify-center p-10 shadow-2xl shadow-purple-900/20">
              <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px] mb-8">Answer</Text>
              <Text className="text-white text-2xl font-bold text-center leading-10 tracking-tight">
                {studySet[currentIndex].answer}
              </Text>
              <View className="absolute bottom-12 flex-row items-center bg-white/20 px-5 py-2.5 rounded-2xl">
                <Rotate3d size={16} color="white" />
                <Text className="text-white text-[10px] font-bold ml-2 uppercase tracking-widest">Tap to see question</Text>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* FOOTER ACTIONS */}
        <View className="pb-12 flex-row items-center justify-center gap-x-4">
          <Pressable 
            onPress={prevCard}
            disabled={currentIndex === 0}
            className={`w-16 h-16 rounded-[24px] items-center justify-center border ${headerBtnBorder} shadow-sm ${
              currentIndex === 0 
                ? (darkMode ? 'bg-white/5 opacity-10' : 'bg-gray-50 opacity-30') 
                : `${headerBtnBg} active:opacity-70`
            }`}
          >
            <ChevronLeft color={darkMode ? "white" : "#1A1A1A"} size={28} />
          </Pressable>

          <Pressable 
            onPress={nextCard}
            className="flex-1 h-16 bg-purple-600 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-purple-900/30 active:scale-[0.98]"
          >
            <Text className="text-white font-black text-lg mr-2 uppercase tracking-widest">
              {currentIndex === studySet.length - 1 ? "Finish" : "Next Card"}
            </Text>
            <ChevronRight color="white" size={24} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}