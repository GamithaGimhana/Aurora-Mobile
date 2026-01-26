import { Redirect } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const user = false; 

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  } else {
    return <Redirect href="/(dashboard)/home" />;
  }
};

export default Index;
