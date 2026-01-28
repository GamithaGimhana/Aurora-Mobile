import { Slot } from "expo-router"
import { Provider } from "react-redux"
import { store } from "@/src/redux/store"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AuthBootstrap from "./AuthBootstrap"

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthBootstrap />
        <Slot />
      </SafeAreaProvider>
    </Provider>
  )
}
