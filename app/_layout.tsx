import React from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          <Slot />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RootLayout;
