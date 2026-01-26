import { Slot } from "expo-router"
import { Provider } from "react-redux"
import { store } from "@/src/redux/store"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Slot />
      </Provider>
    </SafeAreaProvider>
  )
}
