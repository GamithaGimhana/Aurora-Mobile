import React, { useEffect } from "react";
import { View, Text, Image, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  FadeInUp
} from "react-native-reanimated";
import { ArrowRight, Sparkles } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();
  
  // Animation Values
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
  }));

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      {/* Background Glow Effect */}
      <View className="absolute top-[-100] right-[-100] w-80 h-80 bg-purple-900/20 rounded-full blur-3xl" />
      
      <SafeAreaView className="flex-1 px-8 justify-between pb-10">
        
        {/* Header Section */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} className="items-center mt-12">
          <Animated.View style={animatedLogoStyle} className="mb-6">
            <Image 
              source={require("../assets/images/Aurora-logo.png")} 
              className="w-32 h-32"
              resizeMode="contain"
            />
          </Animated.View>
          
          <View className="bg-purple-900/30 px-4 py-1 rounded-full border border-purple-500/30 flex-row items-center">
            <Sparkles size={12} color="#A855F7" />
            <Text className="text-purple-400 text-[10px] font-bold tracking-widest uppercase ml-2">
              Next-Gen Learning
            </Text>
          </View>
        </Animated.View>

        {/* Hero Text */}
        <View>
          <Animated.Text 
            entering={FadeInUp.delay(400).duration(800)}
            className="text-white text-5xl font-black tracking-tighter leading-[54px]"
          >
            Aurora.{"\n"}
            <Text className="text-purple-500">Master </Text> 
            Everything.
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInUp.delay(600).duration(800)}
            className="text-gray-400 text-lg mt-4 leading-7"
          >
            A seamless ecosystem for notes, flashcards, and live learning. Designed for the modern student.
          </Animated.Text>
        </View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.delay(800).duration(800)} className="gap-y-4">
          <Pressable 
            onPress={() => router.push("/(auth)/register")}
            className="bg-purple-600 h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-purple-500/20 active:opacity-90"
          >
            <Text className="text-white font-bold text-lg mr-2">Get Started</Text>
            <ArrowRight size={20} color="white" />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/(auth)/login")}
            className="h-16 rounded-2xl items-center justify-center border border-white/10 bg-white/5 active:bg-white/10"
          >
            <Text className="text-white font-semibold text-lg">Sign In</Text>
          </Pressable>

          <Text className="text-gray-500 text-center text-xs mt-2 tracking-widest uppercase">
            © 2026 Aurora Education
          </Text>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}