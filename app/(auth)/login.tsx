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
import { Mail, Lock, ArrowRight, ChevronLeft } from "lucide-react-native";

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authLoading } = useAppSelector((state) => state.auth);

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
    <View className="flex-1 bg-indigo-600">
      <StatusBar style="light" />
      
      {/* --- DECORATIVE BACKGROUND --- */}
      <View className="absolute top-0 left-0 right-0 h-full overflow-hidden">
        <View className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500 rounded-full opacity-40" />
        <View className="absolute top-40 -left-20 w-60 h-60 bg-indigo-400 rounded-full opacity-20" />
      </View>

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Back Button to Welcome */}
        <Pressable 
          onPress={() => router.back()} 
          className="ml-6 mt-2 w-10 h-10 bg-white/10 rounded-full items-center justify-center border border-white/20"
        >
          <ChevronLeft size={20} color="white" />
        </Pressable>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            
            {/* --- HEADER --- */}
            <View className="px-8 pt-6 pb-10">
              <View className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center mb-6 shadow-xl">
                <Text className="text-3xl font-black text-indigo-600">A</Text>
              </View>
              <Text className="text-white text-4xl font-extrabold tracking-tight">Welcome{"\n"}Back</Text>
              <Text className="text-indigo-100 text-lg mt-3 opacity-90 leading-6">
                Continue your journey toward mastering your subjects.
              </Text>
            </View>

            {/* --- FORM SECTION --- */}
            <View className="flex-1 bg-white rounded-t-[50px] px-8 pt-12 shadow-2xl">
              
              {/* Email */}
              <View className="mb-6">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Email Address</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                  <Mail size={18} color="#6366F1" />
                  <TextInput
                    placeholder="student@university.edu"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="flex-1 ml-4 text-gray-900 text-base font-medium"
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-4">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Password</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                  <Lock size={18} color="#6366F1" />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="flex-1 ml-4 text-gray-900 text-base font-medium"
                  />
                </View>
                <Pressable className="self-end mt-4">
                  <Text className="text-indigo-600 font-bold text-sm">Forgot Password?</Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <View className="mt-8">
                <Pressable
                  onPress={handleLogin}
                  disabled={authLoading}
                  className={`bg-indigo-600 rounded-2xl py-5 flex-row justify-center items-center shadow-xl shadow-indigo-200 ${
                    authLoading ? "opacity-70" : "active:scale-[0.98]"
                  }`}
                >
                  {authLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text className="text-white font-bold text-lg mr-2">Sign In</Text>
                      <ArrowRight size={20} color="white" strokeWidth={2.5} />
                    </>
                  )}
                </Pressable>
              </View>

              {/* Footer */}
              <View className="py-10 items-center">
                <View className="flex-row justify-center items-center">
                  <Text className="text-gray-500 text-base">Don't have an account? </Text>
                  <Pressable onPress={() => router.push("/(auth)/register")}>
                    <Text className="text-indigo-600 font-black text-base">Sign Up</Text>
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