import React from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { store } from "@/src/redux/store";
import { Provider } from "react-redux";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1">
            <Slot />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default RootLayout;
