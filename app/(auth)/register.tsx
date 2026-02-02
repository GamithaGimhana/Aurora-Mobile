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
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      {/* Background Glows */}
      <View className="absolute bottom-[-50] right-[-50] w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Top Navigation */}
        <View className="px-6 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()} 
            className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10 active:bg-white/10"
          >
            <ChevronLeft size={24} color="white" />
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
              <Text className="text-white text-5xl font-black tracking-tighter">
                Create{"\n"}
                <Text className="text-purple-500">Account.</Text>
              </Text>
              <Text className="text-gray-400 text-lg mt-4 leading-6">
                Join Aurora to start your personalized learning experience today.
              </Text>
            </Animated.View>

            {/* Form Fields */}
            <Animated.View entering={FadeInDown.delay(400).duration(800)} className="gap-y-5">
              {/* Full Name */}
              <View>
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Full Name</Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-5">
                  <User size={20} color="#A855F7" opacity={0.7} />
                  <TextInput
                    placeholder="Your Full Name"
                    placeholderTextColor="#4B5563"
                    value={name}
                    onChangeText={setName}
                    className="flex-1 ml-4 text-white text-base font-medium"
                  />
                </View>
              </View>

              {/* Email Address */}
              <View>
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Email Address</Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-5">
                  <Mail size={20} color="#A855F7" opacity={0.7} />
                  <TextInput
                    placeholder="student@aurora.edu"
                    placeholderTextColor="#4B5563"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="flex-1 ml-4 text-white text-base font-medium"
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Password</Text>
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-5">
                  <Lock size={20} color="#A855F7" opacity={0.7} />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#4B5563"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="flex-1 ml-4 text-white text-base font-medium"
                  />
                </View>
              </View>
            </Animated.View>

            {/* Actions */}
            <Animated.View entering={FadeInDown.delay(600).duration(800)} className="mt-10">
              <Pressable
                onPress={handleRegister}
                disabled={loading}
                className={`bg-purple-600 rounded-2xl py-5 flex-row justify-center items-center shadow-lg shadow-purple-500/20 ${
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
                <Text className="text-gray-500 text-base">Already a member? </Text>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                  <Text className="text-purple-400 font-bold text-base">Sign In</Text>
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