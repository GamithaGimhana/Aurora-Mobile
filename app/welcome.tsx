import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  Pressable, 
  FlatList,
  Dimensions 
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Sparkles, 
  ArrowRight, 
  Layers,
  LayoutTemplate,
  TrendingUp,
  ShieldCheck
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const ECOSYSTEM_CARDS = [
  {
    id: '1',
    title: 'Smart Notes',
    desc: 'Organized, structured notes easy to revise.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=500',
  },
  {
    id: '2',
    title: 'Flashcards',
    desc: 'Active recall techniques for better memory.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
  },
  {
    id: '3',
    title: 'Live Rooms',
    desc: 'Real-time interactive sessions for learning.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500',
  }
];

const BenefitItem = ({ title, description, icon: Icon, iconColor }: { title: string, description: string, icon: any, iconColor: string }) => (
  <View className="flex-row items-start mb-6">
    <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-100">
      <Icon size={22} color={iconColor} />
    </View>
    <View className="flex-1 ml-4">
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
      <Text className="text-gray-500 mt-1 leading-5">{description}</Text>
    </View>
  </View>
);

export default function Welcome() {
  const router = useRouter();

  // Navigation handlers wrapped to ensure they don't fire during render
  const handleSignIn = () => router.push("/(auth)/login");
  const handleRegister = () => router.push("/(auth)/register");

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        scrollEventThrottle={16}
      >
        
        {/* --- 1. FULL-PAGE HERO SECTION --- */}
        <View style={{ height: height }} className="bg-slate-50 justify-between pb-10">
          <SafeAreaView edges={['top']}>
            <View className="px-6 pt-6 flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-indigo-600 rounded-2xl items-center justify-center mr-3 shadow-lg shadow-indigo-200">
                  <Text className="text-white font-bold text-lg">A</Text>
                </View>
                <Text className="text-2xl font-black tracking-tighter text-gray-900">AURORA</Text>
              </View>
              <Pressable onPress={handleSignIn}>
                <Text className="text-indigo-600 font-bold">Sign In</Text>
              </Pressable>
            </View>
          </SafeAreaView>

          <View className="flex-1 justify-center">
            <View className="px-6 mb-4">
              <View className="bg-indigo-100/50 self-start px-4 py-1.5 rounded-full flex-row items-center mb-6">
                <Sparkles size={14} color="#4F46E5" />
                <Text className="text-indigo-700 text-[11px] font-bold uppercase ml-2 tracking-widest">
                  New: Live Quiz Rooms
                </Text>
              </View>

              <Text className="text-5xl font-extrabold text-gray-900 leading-[56px] tracking-tight">
                Meet Aurora.{"\n"}
                <Text className="text-gray-400">The Future of Learning.</Text>
              </Text>
              <Text className="text-gray-500 text-lg mt-6 mb-10 leading-7">
                Everything connects. Create a note, turn it into a flashcard, and test it with a quiz.
              </Text>
            </View>

            <View className="px-6">
              <View className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-200 bg-white">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }}
                  className="w-full h-64"
                  resizeMode="cover"
                />
                <View className="absolute bottom-6 left-6 bg-white/95 px-5 py-4 rounded-3xl shadow-xl border border-gray-100 flex-row items-center">
                   <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                     <Text className="text-green-600 font-bold text-sm">A+</Text>
                   </View>
                   <View>
                      <Text className="text-xs font-bold text-gray-900">Quiz Complete</Text>
                      <Text className="text-[10px] text-gray-500">Score: 98%</Text>
                   </View>
                </View>
              </View>
            </View>
          </View>

          <View className="items-center mt-4">
             <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-2">Scroll to explore</Text>
             <View className="w-[1px] h-8 bg-gray-300" />
          </View>
        </View>

        {/* --- 2. ECOSYSTEM CAROUSEL --- */}
        <View className="py-16">
          <Text className="px-6 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">The Ecosystem</Text>
          <FlatList
            data={ECOSYSTEM_CARDS}
            horizontal
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={width * 0.75 + 16}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mr-4 bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm" style={{ width: width * 0.75 }}>
                <Image source={{ uri: item.image }} className="w-full h-48" />
                <View className="p-8">
                  <Text className="text-2xl font-bold text-gray-900">{item.title}</Text>
                  <Text className="text-gray-500 mt-2 leading-6 text-base">{item.desc}</Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* --- 3. WHY CHOOSE AURORA --- */}
        <View className="px-6 py-16 bg-slate-50 border-y border-gray-100">
          <Text className="text-3xl font-bold text-gray-900 mb-10">Why Choose Aurora?</Text>
          <BenefitItem 
            icon={Layers} 
            iconColor="#4F46E5"
            title="All-in-One Ecosystem" 
            description="No need for three separate apps. Your notes connect directly to your quizzes." 
          />
          <BenefitItem 
            icon={LayoutTemplate} 
            iconColor="#10B981"
            title="Focus-First Design" 
            description="A clean, minimalist interface designed to keep you in the flow state." 
          />
          <BenefitItem 
            icon={TrendingUp} 
            iconColor="#F59E0B"
            title="Built to Scale" 
            description="Perfect for solo study sessions or lecture halls with 500+ students." 
          />
        </View>

        {/* --- 4. CALL TO ACTION --- */}
        <View className="px-6 py-16">
          <View className="bg-gray-900 rounded-[50px] p-12 items-center overflow-hidden">
            <View className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20" />
            <ShieldCheck size={48} color="white" />
            <Text className="text-white text-3xl font-bold text-center mt-8 leading-tight">
              Start Learning with Aurora.
            </Text>
            <Text className="text-gray-400 text-center mt-4 mb-12 text-base leading-6">
              Join thousands of students and educators using a modern platform designed for real retention.
            </Text>

            <Pressable 
              onPress={handleRegister}
              className="bg-white w-full py-6 rounded-[24px] flex-row items-center justify-center shadow-xl active:scale-[0.97]"
            >
              <Text className="text-black font-bold text-xl mr-2">Create Account</Text>
              <ArrowRight size={22} color="black" />
            </Pressable>
          </View>
        </View>

        <View className="items-center pb-12">
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Aurora Education Inc.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}