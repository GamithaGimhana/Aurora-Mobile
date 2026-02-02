import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { ChevronLeft, Rotate3d, ChevronRight, Shuffle, ChevronLeftSquare } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function StudyMode() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const router = useRouter();
  
  const allCards = useAppSelector(state => state.flashcards.cards);
  const initialSet = allCards.filter(c => c.title === title);

  // --- NEW STATES ---
  const [studySet, setStudySet] = useState(initialSet);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipRotation = useSharedValue(0);

  // Initialize and handle empty sets
  useEffect(() => {
    setStudySet(initialSet);
  }, [allCards]);

  // --- LOGIC FUNCTIONS ---
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
      // Small delay to allow flip animation to reset before changing content
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

  // --- ANIMATIONS ---
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

  if (studySet.length === 0) return null;

  return (
    <View className="flex-1 bg-[#050505]">
      <SafeAreaView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between py-6">
          <Pressable onPress={() => router.back()} className="p-2 bg-white/5 rounded-full">
            <ChevronLeft color="white" />
          </Pressable>
          <View className="items-center">
            <Text className="text-white font-bold text-lg">{title}</Text>
            <Text className="text-gray-500 text-[10px] uppercase tracking-widest">Active Recall</Text>
          </View>
          <Pressable onPress={shuffleDeck} className="p-2 bg-purple-600/20 rounded-full border border-purple-500/30">
            <Shuffle size={20} color="#A855F7" />
          </Pressable>
        </View>

        {/* Progress Indicator */}
        <View className="flex-row justify-center mb-8">
            <View className="bg-white/5 px-4 py-1 rounded-full border border-white/10">
                <Text className="text-purple-500 font-black text-xs">
                    {currentIndex + 1} / {studySet.length}
                </Text>
            </View>
        </View>

        {/* Card Container */}
        <View className="flex-1 justify-center items-center">
          <Pressable onPress={flipCard} style={{ width: width * 0.85, height: 420 }}>
            <Animated.View style={[frontStyle]} className="w-full h-full bg-white/5 border border-white/10 rounded-[40px] items-center justify-center p-8">
              <Text className="text-purple-500 text-[10px] font-bold uppercase tracking-[3px] mb-6">Question</Text>
              <Text className="text-white text-2xl font-bold text-center leading-9">
                {studySet[currentIndex].question}
              </Text>
              <View className="absolute bottom-10 flex-row items-center bg-white/5 px-4 py-2 rounded-full">
                <Rotate3d size={14} color="#A855F7" />
                <Text className="text-gray-400 text-[10px] font-bold ml-2 uppercase tracking-tighter">Tap to flip</Text>
              </View>
            </Animated.View>

            <Animated.View style={[backStyle]} className="w-full h-full bg-purple-600 rounded-[40px] items-center justify-center p-8 shadow-2xl shadow-purple-500/40">
              <Text className="text-white/60 text-[10px] font-bold uppercase tracking-[3px] mb-6">Answer</Text>
              <Text className="text-white text-2xl font-bold text-center leading-9">
                {studySet[currentIndex].answer}
              </Text>
            </Animated.View>
          </Pressable>
        </View>

        {/* Footer Actions */}
        <View className="pb-16 flex-row items-center justify-center gap-x-4">
          <Pressable 
            onPress={prevCard}
            disabled={currentIndex === 0}
            className={`w-16 h-16 rounded-2xl items-center justify-center border border-white/10 ${currentIndex === 0 ? 'opacity-20' : 'bg-white/5'}`}
          >
            <ChevronLeft color="white" size={28} />
          </Pressable>

          <Pressable 
            onPress={nextCard}
            className="flex-1 h-16 bg-purple-600 rounded-2xl flex-row items-center justify-center shadow-lg shadow-purple-500/30"
          >
            <Text className="text-white font-black text-lg mr-2">
              {currentIndex === studySet.length - 1 ? "Finish" : "Next"}
            </Text>
            <ChevronRight color="white" size={24} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}