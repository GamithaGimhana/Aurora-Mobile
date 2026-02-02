import { Stack, Redirect } from "expo-router"
import { useAppSelector } from "@/src/hooks/useAppSelector"

export default function AuthLayout() {
  const { user, loading } = useAppSelector(state => state.auth)

  if (loading) return null // or splash screen

  if (user) {
    return <Redirect href="/(dashboard)/home" />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  )
}
