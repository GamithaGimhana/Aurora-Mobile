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
import { registerThunk } from "@/src/redux/slices/authSlice";
import { User, Mail, Lock, ChevronLeft, ArrowRight } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const Register = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector(state => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const result = await dispatch(
      registerThunk({ fullName: name, email, password })
    );

    if (registerThunk.fulfilled.match(result)) {
      Alert.alert(
        "Success", 
        "Account created successfully! Please login.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    } else if (registerThunk.rejected.match(result)) {
      Alert.alert("Registration failed", (result.payload as string) || "Could not create account.");
    }
  };

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      {/* Background Glows for Light Mode */}
      <View className="absolute bottom-[-50] right-[-50] w-96 h-96 bg-purple-100/60 rounded-full blur-3xl" />
      
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
            <Animated.View entering={FadeInUp.delay(200).duration(800)} className="py-8">
              <Text className="text-[#1A1A1A] text-5xl font-black tracking-tighter">
                Create{"\n"}
                <Text className="text-purple-600">Account.</Text>
              </Text>
              <Text className="text-gray-500 text-lg mt-4 leading-6 font-medium">
                Join Aurora to start your personalized learning experience today.
              </Text>
            </Animated.View>

            {/* Form Fields */}
            <Animated.View entering={FadeInDown.delay(400).duration(800)} className="gap-y-5">
              {/* Full Name */}
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Full Name</Text>
                <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-5 py-5 focus:border-purple-500/50">
                  <User size={20} color="#9333EA" opacity={0.6} />
                  <TextInput
                    placeholder="Your Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    className="flex-1 ml-4 text-[#1A1A1A] text-base font-semibold"
                  />
                </View>
              </View>

              {/* Email Address */}
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
              </View>
            </Animated.View>

            {/* Actions */}
            <Animated.View entering={FadeInDown.delay(600).duration(800)} className="mt-10">
              <Pressable
                onPress={handleRegister}
                disabled={loading}
                className={`bg-purple-600 rounded-2xl py-5 flex-row justify-center items-center shadow-md active:scale-[0.98] ${
                  loading ? "opacity-70" : "active:opacity-90"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">Create My Account</Text>
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