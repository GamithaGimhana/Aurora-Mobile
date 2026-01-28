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
  ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { loginThunk } from "@/src/redux/slices/authSlice";
import { Mail, Lock, ArrowRight } from "lucide-react-native";

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter both your email and password.");
      return;
    }

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.rejected.match(result)) {
      Alert.alert("Login Failed", result.payload as string || "Please check your credentials.");
    }
  };

  return (
    <View className="flex-1 bg-indigo-600">
      <StatusBar style="light" />
      
      {/* --- DECORATIVE BACKGROUND --- */}
      {/* These absolute circles create the "Aurora" glow effect without images */}
      <View className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden">
        <View className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full opacity-30" />
        <View className="absolute top-10 -left-10 w-40 h-40 bg-indigo-400 rounded-full opacity-20" />
      </View>

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            
            {/* --- HEADER SECTION --- */}
            <View className="px-8 pt-10 pb-12">
              <View className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Text className="text-2xl font-bold text-white">A</Text>
              </View>
              <Text className="text-white text-4xl font-bold">Welcome Back</Text>
              <Text className="text-indigo-100 text-lg mt-2 opacity-80">
                Sign in to continue your learning journey.
              </Text>
            </View>

            {/* --- FORM SECTION (Bottom Sheet Style) --- */}
            <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 pb-8 shadow-2xl">
              
              {/* Email Input */}
              <View className="space-y-4 mb-6">
                <Text className="text-gray-700 font-semibold ml-1">Email Address</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:border-indigo-500 focus:bg-white transition-all">
                  <Mail size={20} color="#6B7280" />
                  <TextInput
                    placeholder="student@university.edu"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="flex-1 ml-3 text-gray-900 text-base"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="space-y-4 mb-8">
                <Text className="text-gray-700 font-semibold ml-1">Password</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:border-indigo-500 focus:bg-white transition-all">
                  <Lock size={20} color="#6B7280" />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="flex-1 ml-3 text-gray-900 text-base"
                  />
                </View>
                <Pressable className="self-end">
                  <Text className="text-indigo-600 font-medium text-sm">Forgot Password?</Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={loading}
                className={`bg-indigo-600 rounded-2xl py-4 flex-row justify-center items-center shadow-lg shadow-indigo-200 ${
                  loading ? "opacity-70" : "active:bg-indigo-700"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">Sign In</Text>
                    <ArrowRight size={20} color="white" strokeWidth={2.5} />
                  </>
                )}
              </Pressable>

              {/* Footer */}
              <View className="flex-1 justify-end items-center mt-8">
                <View className="flex-row justify-center items-center">
                  <Text className="text-gray-500 text-base">Don't have an account? </Text>
                  <Pressable onPress={() => router.push("/(auth)/register")}>
                    <Text className="text-indigo-600 font-bold text-base">Sign Up</Text>
                  </Pressable>
                </View>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Login;