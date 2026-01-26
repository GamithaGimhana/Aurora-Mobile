import { Slot } from "expo-router"
import { Provider } from "react-redux"
import { store } from "@/src/redux/store"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useEffect } from 'react'
import { subscribeToAuthChanges } from '@/src/services/authService'
import { setUser } from '@/src/redux/slices/authSlice'
import { useAppDispatch } from '@/src/hooks/useAppDispatch'

export default function RootLayout() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(user => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName
        }))
      } else {
        dispatch(setUser(null))
      }
    })
    return () => unsubscribe()
  }, [dispatch])
  
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Slot />
      </Provider>
    </SafeAreaProvider>
  )
}
