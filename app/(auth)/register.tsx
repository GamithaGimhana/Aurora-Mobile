import React, { useState } from "react"
import { View, Text, TextInput, Pressable, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { useAppSelector } from "@/src/hooks/useAppSelector"
import { registerThunk } from "@/src/redux/slices/authSlice"
import { useRouter } from "expo-router"

const Register = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading } = useAppSelector(state => state.auth)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required")
      return
    }

    const result = await dispatch(
      registerThunk({ fullName: name, email, password })
    )

    if (registerThunk.rejected.match(result)) {
      Alert.alert("Registration failed", result.payload as string)
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center bg-slate-50 px-6">
      <Text className="text-3xl font-bold mb-6 text-center">Register</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        className="border p-3 rounded mb-4 bg-white"
      />

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
        onPress={handleRegister}
        disabled={loading}
        className="bg-green-600 py-3 rounded"
      >
        <Text className="text-white text-center font-bold">
          {loading ? "Creating..." : "Register"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text className="text-center mt-4 text-blue-600">
          Back to Login
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Register
