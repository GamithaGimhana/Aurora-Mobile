import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  SafeAreaView 
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { 
  BookOpen, 
  Zap, 
  Plus, 
  ChevronRight, 
  Search,
  LayoutGrid
} from "lucide-react-native";

// Sub-components
const QuickAction = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  color, 
  onPress 
}: { 
  title: string, 
  subtitle: string, 
  icon: any, 
  color: string, 
  onPress: () => void 
}) => (
  <Pressable 
    onPress={onPress}
    className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex-row items-center mb-4 active:scale-[0.98]"
  >
    <View className={`w-14 h-14 ${color} rounded-2xl items-center justify-center mr-4 shadow-sm`}>
      <Icon size={24} color="white" />
    </View>
    <View className="flex-1">
      <Text className="text-gray-900 text-lg font-bold">{title}</Text>
      <Text className="text-gray-400 text-sm font-medium">{subtitle}</Text>
    </View>
    <ChevronRight size={20} color="#D1D5DB" />
  </Pressable>
);

export default function Home() {
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}
        >
          
          {/* HEADER SECTION */}
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Welcome back,</Text>
              <Text className="text-3xl font-black text-gray-900 tracking-tighter">
                {user?.name?.split(' ')[0] || "Scholar"} 👋
              </Text>
            </View>
            <Pressable className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-100">
              <Search size={22} color="#4F46E5" />
            </Pressable>
          </View>

          {/* PROGRESS CARD */}
          <View className="bg-indigo-600 rounded-[40px] p-8 mb-10 overflow-hidden shadow-xl shadow-indigo-200">
             {/* Decorative Background Glows */}
             <View className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full opacity-30" />
             <View className="absolute top-20 -left-10 w-20 h-20 bg-indigo-400 rounded-full opacity-20" />
             
             <View className="flex-row items-center mb-6">
               <View className="bg-white/20 p-2 rounded-lg">
                 <Zap size={18} color="white" />
               </View>
               <Text className="text-white/80 font-bold ml-2 text-xs uppercase tracking-widest">Study Streak: 5 Days</Text>
             </View>
             
             <Text className="text-white text-2xl font-extrabold leading-8">
               You're on fire!{"\n"}Keep mastering your notes.
             </Text>
             
             <Pressable className="bg-white self-start mt-6 px-6 py-3 rounded-2xl shadow-sm">
               <Text className="text-indigo-600 font-bold">Resume Learning</Text>
             </Pressable>
          </View>

          {/* TOOLS / QUICK ACTIONS */}
          <View className="flex-row items-center justify-between mb-6 px-1">
            <Text className="text-xl font-extrabold text-gray-900">Study Ecosystem</Text>
            <LayoutGrid size={20} color="#9CA3AF" />
          </View>

          <QuickAction 
            title="Smart Notes"
            subtitle="Rich-text study documents"
            icon={BookOpen}
            color="bg-indigo-600"
            onPress={() => router.push("/(dashboard)/notes")}
          />

          <QuickAction 
            title="Flashcards"
            subtitle="Active recall & revision"
            icon={Zap}
            color="bg-emerald-600"
            onPress={() => router.push("/(dashboard)/flashcards")}
          />

          {/* CREATE NEW BUTTON */}
          <View className="mt-6">
            <Pressable 
              className="bg-gray-900 py-6 rounded-[32px] flex-row items-center justify-center shadow-lg active:scale-[0.98]"
              onPress={() => router.push("/(dashboard)/notes/form")}
            >
              <View className="bg-indigo-600 w-8 h-8 rounded-full items-center justify-center mr-3">
                <Plus size={20} color="white" strokeWidth={3} />
              </View>
              <Text className="text-white font-bold text-lg">Create New Note</Text>
            </Pressable>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}