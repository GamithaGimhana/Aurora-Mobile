import { Stack, Redirect } from "expo-router"
import { useAppSelector } from "@/src/hooks/useAppSelector"

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAppSelector(state => state.auth)

  if (loading) return null 

  if (isAuthenticated) {
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
