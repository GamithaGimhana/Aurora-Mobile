import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { loginThunk } from "@/src/redux/slices/authSlice";
import { Mail, Lock, ArrowRight, ChevronLeft } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter both your email and password.");
      return;
    }

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.rejected.match(result)) {
      Alert.alert("Login Failed", (result.payload as string) || "Please check your credentials.");
    }
  };

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      {/* Background Glows for Light Mode */}
      <View className="absolute top-[-50] left-[-50] w-96 h-96 bg-purple-100/50 rounded-full blur-3xl" />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Top Navigation */}
        <View className="px-6 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()} 
            className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm active:bg-gray-50"
          >
            <ChevronLeft size={24} color="#1A1A1A" />
          </Pressable>
          
          <Image 
            source={require("../../assets/images/Aurora-logo.png")} 
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
            <Animated.View entering={FadeInUp.delay(200).duration(800)} className="py-10">
              <Text className="text-[#1A1A1A] text-5xl font-black tracking-tighter">
                Welcome{"\n"}
                <Text className="text-purple-600">Back.</Text>
              </Text>
              <Text className="text-gray-500 text-lg mt-4 leading-6 font-medium">
                Sign in to continue your learning journey with Aurora.
              </Text>
            </Animated.View>

            {/* Form Fields */}
            <Animated.View entering={FadeInDown.delay(400).duration(800)} className="gap-y-6">
              {/* Email */}
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Email Address</Text>
                <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-5 py-5 focus:border-purple-500/50">
                  <Mail size={20} color="#9333EA" opacity={0.6} />
                  <TextInput
                    placeholder="student@aurora.edu"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="flex-1 ml-4 text-[#1A1A1A] text-base font-semibold"
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Password</Text>
                <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-5 py-5 focus:border-purple-500/50">
                  <Lock size={20} color="#9333EA" opacity={0.6} />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="flex-1 ml-4 text-[#1A1A1A] text-base font-semibold"
                  />
                </View>
                <Pressable className="self-end mt-4">
                  <Text className="text-purple-600 font-bold text-sm tracking-wide">Forgot Password?</Text>
                </Pressable>
              </View>
            </Animated.View>

            {/* Actions */}
            <Animated.View entering={FadeInDown.delay(600).duration(800)} className="mt-10">
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                className={`bg-purple-600 rounded-2xl py-5 flex-row justify-center items-center shadow-md active:scale-[0.98] ${
                  loading ? "opacity-70" : "active:opacity-90"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">Sign In</Text>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </Pressable>

              <View className="flex-row justify-center items-center mt-8 pb-10">
                <Text className="text-gray-500 text-base font-medium">New to Aurora? </Text>
                <Pressable onPress={() => router.push("/(auth)/register")}>
                  <Text className="text-purple-700 font-bold text-base">Create Account</Text>
                </Pressable>
              </View>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Login;