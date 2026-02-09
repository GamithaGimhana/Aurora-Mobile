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
  
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
  }));

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      {/* Background Glow Effect - Adjusted for Light Mode */}
      <View className="absolute top-[-50] right-[-50] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
      
      <SafeAreaView className="flex-1 px-8 justify-between pb-10">
        
        {/* Header Section */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} className="items-center mt-12">
          <Animated.View style={animatedLogoStyle} className="mb-6">
            <Image 
              // source={require("../assets/images/Aurora-logo.png")} 
              source={{ uri: "https://res.cloudinary.com/dg11uvapu/image/upload/v1770646537/Aurora-logo_ncjip3.png" }} 
              className="w-32 h-32"
              resizeMode="contain"
            />
          </Animated.View>
          
          <View className="bg-purple-100 px-4 py-1.5 rounded-full border border-purple-200 flex-row items-center">
            <Sparkles size={12} color="#9333EA" />
            <Text className="text-purple-700 text-[10px] font-bold tracking-widest uppercase ml-2">
              Next-Gen Learning
            </Text>
          </View>
        </Animated.View>

        {/* Hero Text */}
        <View>
          <Animated.Text 
            entering={FadeInUp.delay(400).duration(800)}
            className="text-[#1A1A1A] text-5xl font-black tracking-tighter leading-[54px]"
          >
            Aurora.{"\n"}
            <Text className="text-purple-600">Master </Text> 
            Everything.
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInUp.delay(600).duration(800)}
            className="text-gray-500 text-lg mt-4 leading-7 font-medium"
          >
            A seamless ecosystem for notes, flashcards, and live learning. Designed for the modern student.
          </Animated.Text>
        </View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.delay(800).duration(800)} className="gap-y-4">
          <Pressable 
            onPress={() => router.push("/(auth)/register")}
            className="bg-purple-600 h-16 rounded-2xl flex-row items-center justify-center shadow-md active:scale-[0.98]"
          >
            <Text className="text-white font-bold text-lg mr-2">Get Started</Text>
            <ArrowRight size={20} color="white" />
          </Pressable>

          <Pressable 
            onPress={() => router.push("/(auth)/login")}
            className="h-16 rounded-2xl items-center justify-center border border-gray-200 bg-white shadow-sm active:bg-gray-50 active:scale-[0.98]"
          >
            <Text className="text-purple-700 font-bold text-lg">Sign In</Text>
          </Pressable>

          <Text className="text-gray-400 text-center text-[10px] mt-2 font-bold tracking-widest uppercase">
            © 2026 Aurora Education Inc.
          </Text>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}