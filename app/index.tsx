import { Redirect } from "expo-router"
import { useAppSelector } from "@/src/hooks/useAppSelector"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import "../global.css"

export default function Index() {
  const { user, loading } = useAppSelector(state => state.auth)

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  if (user) {
    return <Redirect href="/(dashboard)/home" />
  }

  return <Redirect href="/welcome" />
}
