import { Stack, Redirect } from "expo-router"
import { useAppSelector } from "@/src/hooks/useAppSelector"

export default function AuthLayout() {
  const { isAuthenticated, authLoading } = useAppSelector(state => state.auth)

  if (authLoading) return null 

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
