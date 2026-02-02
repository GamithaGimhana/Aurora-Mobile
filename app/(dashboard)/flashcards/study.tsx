import React, { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { ChevronLeft, Rotate3d, ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate 
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function StudyMode() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const router = useRouter();
  
  // Filter cards by the selected title
  const allCards = useAppSelector(state => state.flashcards.cards);
  const studySet = allCards.filter(c => c.title === title);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flipRotation = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    const targetValue = isFlipped ? 0 : 180;
    flipRotation.value = withTiming(targetValue, { duration: 400 });
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < studySet.length - 1) {
      setIsFlipped(false);
      flipRotation.value = 0;
      setCurrentIndex(currentIndex + 1);
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
          <Text className="text-white font-bold text-lg">{title}</Text>
          <Text className="text-purple-500 font-bold">{currentIndex + 1}/{studySet.length}</Text>
        </View>

        {/* Card Container */}
        <View className="flex-1 justify-center items-center">
          <Pressable onPress={flipCard} style={{ width: width * 0.85, height: 450 }}>
            {/* Front Side (Question) */}
            <Animated.View style={[frontStyle]} className="w-full h-full bg-white/5 border border-white/10 rounded-[40px] items-center justify-center p-8">
              <Text className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-4">Question</Text>
              <Text className="text-white text-2xl font-bold text-center leading-9">
                {studySet[currentIndex].question}
              </Text>
              <View className="absolute bottom-10 flex-row items-center">
                <Rotate3d size={16} color="#A855F7" />
                <Text className="text-gray-500 text-xs ml-2">Tap to flip</Text>
              </View>
            </Animated.View>

            {/* Back Side (Answer) */}
            <Animated.View style={[backStyle]} className="w-full h-full bg-purple-600 rounded-[40px] items-center justify-center p-8">
              <Text className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Answer</Text>
              <Text className="text-white text-2xl font-bold text-center leading-9">
                {studySet[currentIndex].answer}
              </Text>
            </Animated.View>
          </Pressable>
        </View>

        {/* Footer Actions */}
        <View className="pb-12 items-center">
          <Pressable 
            onPress={nextCard}
            disabled={currentIndex === studySet.length - 1}
            className={`flex-row items-center px-8 py-4 rounded-2xl ${currentIndex === studySet.length - 1 ? 'bg-gray-800 opacity-50' : 'bg-purple-600'}`}
          >
            <Text className="text-white font-bold mr-2">
              {currentIndex === studySet.length - 1 ? "Finish Session" : "Next Card"}
            </Text>
            <ChevronRight color="white" size={20} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}