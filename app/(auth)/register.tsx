import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator,
  Image,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { registerThunk } from "@/src/redux/slices/authSlice";
import { User, Mail, Lock, ChevronLeft, ArrowRight, AlertCircle, X } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";

const Register = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Theme and Data selectors
  const { darkMode } = useAppSelector(state => state.theme);
  const { loading } = useAppSelector(state => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regError, setRegError] = useState<string | null>(null); // NEW: Error state

  const handleRegister = async () => {
    setRegError(null);

    if (!name || !email || !password) {
      setRegError("All fields are required to create an account.");
      return;
    }

    if (password.length < 6) {
      setRegError("Password must be at least 6 characters long.");
      return;
    }

    const result = await dispatch(
      registerThunk({ fullName: name, email, password })
    );

    if (registerThunk.fulfilled.match(result)) {
      Alert.alert(
        "Success", 
        "Account created! Let's get you signed in.",
        [{ text: "Login Now", onPress: () => router.replace("/(auth)/login") }]
      );
    } else if (registerThunk.rejected.match(result)) {
      setRegError((result.payload as string) || "Could not create account.");
    }
  };

  // Theme-based style constants
  const bgColor = darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]";
  const inputBg = darkMode ? "bg-white/5" : "bg-white";
  const inputBorder = darkMode ? "border-white/10" : "border-gray-200";
  const primaryText = darkMode ? "text-white" : "text-[#1A1A1A]";

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      <View className={`absolute bottom-[-50] right-[-50] w-96 h-96 rounded-full blur-3xl ${
        darkMode ? "bg-purple-900/20" : "bg-purple-100/60"
      }`} />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Top Navigation */}
        <View className="px-6 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()} 
            className={`w-12 h-12 rounded-2xl items-center justify-center border shadow-sm active:scale-95 ${
              darkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <ChevronLeft size={24} color={darkMode ? "white" : "#1A1A1A"} />
          </Pressable>
          
          <Image 
            // source={require("../../assets/images/Aurora-logo.png")} 
            source={{ uri: "https://res.cloudinary.com/dg11uvapu/image/upload/v1770646537/Aurora-logo_ncjip3.png" }} 
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="px-8"
          >
            {/* Header */}
            <Animated.View entering={FadeInUp.delay(200).duration(800)} className="py-8">
              <Text className={`${primaryText} text-5xl font-black tracking-tighter`}>
                Create{"\n"}
                <Text className="text-purple-600">Account.</Text>
              </Text>
              <Text className="text-gray-500 text-lg mt-4 leading-6 font-medium">
                Join Aurora to start your personalized learning journey today.
              </Text>
            </Animated.View>

            {/* ERROR MESSAGE DISPLAY */}
            {regError && (
              <Animated.View 
                entering={FadeIn.duration(400)} 
                className="flex-row items-center bg-red-500/10 p-4 rounded-2xl mb-6 border border-red-500/20"
              >
                <AlertCircle size={20} color="#EF4444" />
                <Text className="text-red-500 text-sm font-bold ml-3 flex-1">{regError}</Text>
                <Pressable onPress={() => setRegError(null)}>
                  <X size={16} color="#EF4444" />
                </Pressable>
              </Animated.View>
            )}

            {/* Form Fields */}
            <Animated.View entering={FadeInDown.delay(400).duration(800)} className="gap-y-5">
              {/* Full Name */}
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Full Name</Text>
                <View className={`flex-row items-center border rounded-2xl px-5 py-5 ${inputBg} ${inputBorder}`}>
                  <User size={20} color="#9333EA" opacity={0.6} />
                  <TextInput
                    placeholder="Your Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={(val) => {setName(val); setRegError(null);}}
                    className={`flex-1 ml-4 text-base font-semibold ${primaryText}`}
                  />
                </View>
              </View>

              {/* Email Address */}
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Email Address</Text>
                <View className={`flex-row items-center border rounded-2xl px-5 py-5 ${inputBg} ${inputBorder}`}>
                  <Mail size={20} color="#9333EA" opacity={0.6} />
                  <TextInput
                    placeholder="student@aurora.edu"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={(val) => {setEmail(val); setRegError(null);}}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className={`flex-1 ml-4 text-base font-semibold ${primaryText}`}
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Password</Text>
                <View className={`flex-row items-center border rounded-2xl px-5 py-5 ${inputBg} ${inputBorder}`}>
                  <Lock size={20} color="#9333EA" opacity={0.6} />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={(val) => {setPassword(val); setRegError(null);}}
                    secureTextEntry
                    className={`flex-1 ml-4 text-base font-semibold ${primaryText}`}
                  />
                </View>
              </View>
            </Animated.View>

            {/* Actions */}
            <Animated.View entering={FadeInDown.delay(600).duration(800)} className="mt-10">
              <Pressable
                onPress={handleRegister}
                disabled={loading}
                className={`bg-purple-600 rounded-2xl py-5 flex-row justify-center items-center shadow-lg active:scale-[0.98] ${
                  loading ? "opacity-70" : "shadow-purple-500/20 active:opacity-90"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">Create Account</Text>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </Pressable>

              <View className="flex-row justify-center items-center mt-8 pb-10">
                <Text className="text-gray-500 text-base font-medium">Already a member? </Text>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                  <Text className="text-purple-700 font-bold text-base">Sign In</Text>
                </Pressable>
              </View>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Register;