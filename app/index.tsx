import { Redirect } from "expo-router"
import { useAppSelector } from "@/src/hooks/useAppSelector"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import "../global.css"

export default function Index() {
  // const { isAuthenticated, loading } = useAppSelector(
  //   state => state.auth
  // )

  // if (loading) {
  //   return (
  //     <SafeAreaView className="flex-1 justify-center items-center bg-white">
  //       <View className="flex-1 items-center justify-center">
  //         <ActivityIndicator size="large" />
  //       </View>
  //     </SafeAreaView>
  //   )
  // }

  const { isAuthenticated, initialized } = useAppSelector(
    state => state.auth
  )

  if (!initialized) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  if (isAuthenticated) {
    return <Redirect href="/(dashboard)/home" />
  }

  return <Redirect href="/welcome" />
}
