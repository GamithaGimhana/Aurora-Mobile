import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="flex-1 justify-center items-center bg-slate-50">
        <Text className="text-3xl font-bold mb-6">Login Page</Text>
        <Pressable
          className="bg-blue-600 py-3 px-6 rounded"
          onPress={() => router.push("/(dashboard)/home")}
        >
          <Text className="text-white font-bold">Go to Dashboard</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Login;
