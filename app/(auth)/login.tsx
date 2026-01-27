import React, { useState } from "react"
import { View, Text, TextInput, Pressable, Alert } from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { useAppSelector } from "@/src/hooks/useAppSelector"
import { loginThunk } from "@/src/redux/slices/authSlice"

const Login = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, error } = useAppSelector(state => state.auth)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields")
      return
    }

    const result = await dispatch(loginThunk({ email, password }))

    if (loginThunk.rejected.match(result)) {
      Alert.alert("Login failed", result.payload as string)
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center bg-slate-50 px-6">
      <Text className="text-3xl font-bold mb-6 text-center">Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        className="border p-3 rounded mb-4 bg-white"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border p-3 rounded mb-6 bg-white"
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className="bg-blue-600 py-3 rounded"
      >
        <Text className="text-white text-center font-bold">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text className="text-center mt-4 text-blue-600">
          Create an account
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Login
