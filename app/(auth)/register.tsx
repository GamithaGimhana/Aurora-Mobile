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
import { registerThunk } from "@/src/redux/slices/authSlice";
import { User, Mail, Lock, UserPlus, ChevronLeft } from "lucide-react-native";

const Register = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authLoading } = useAppSelector((state) => state.auth);

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

    // Check if the registration was successful
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
    <View className="flex-1 bg-indigo-600">
      <StatusBar style="light" />
      
      {/* --- DECORATIVE BACKGROUND --- */}
      <View className="absolute top-0 left-0 right-0 h-full overflow-hidden">
        <View className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full opacity-40" />
        <View className="absolute top-60 -right-20 w-60 h-60 bg-indigo-400 rounded-full opacity-20" />
      </View>

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Back Button */}
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
            
            {/* --- HEADER SECTION --- */}
            <View className="px-8 pt-6 pb-10">
              <View className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center mb-6 shadow-xl">
                <UserPlus size={28} color="#4F46E5" strokeWidth={2.5} />
              </View>
              <Text className="text-white text-4xl font-extrabold tracking-tight">Create{"\n"}Account</Text>
              <Text className="text-indigo-100 text-lg mt-3 opacity-90 leading-6">
                Join Aurora and start your personalized learning experience today.
              </Text>
            </View>

            {/* --- FORM SECTION --- */}
            <View className="flex-1 bg-white rounded-t-[50px] px-8 pt-12 shadow-2xl">
              
              {/* Full Name Input */}
              <View className="mb-6">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Full Name</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                  <User size={18} color="#6366F1" />
                  <TextInput
                    placeholder="Gamitha Gimhana"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    className="flex-1 ml-4 text-gray-900 text-base font-medium"
                  />
                </View>
              </View>

              {/* Email Input */}
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

              {/* Password Input */}
              <View className="mb-8">
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
              </View>

              {/* Register Button */}
              <Pressable
                onPress={handleRegister}
                disabled={authLoading}
                className={`bg-indigo-600 rounded-2xl py-5 flex-row justify-center items-center shadow-xl shadow-indigo-200 ${
                  authLoading ? "opacity-70" : "active:scale-[0.98]"
                }`}
              >
                {authLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">Create My Account</Text>
                )}
              </Pressable>

              {/* Footer */}
              <View className="py-10 items-center">
                <View className="flex-row justify-center items-center">
                  <Text className="text-gray-500 text-base">Already a member? </Text>
                  <Pressable onPress={() => router.push("/(auth)/login")}>
                    <Text className="text-indigo-600 font-black text-base">Sign In</Text>
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

export default Register;