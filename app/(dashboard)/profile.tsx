import { View, Text, Pressable } from "react-native"
import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { logoutThunk } from "@/src/redux/slices/authSlice"

export default function Profile() {
  const dispatch = useAppDispatch()

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Profile
      </Text>

      <Pressable
        onPress={() => dispatch(logoutThunk())}
        style={{
          backgroundColor: "#e11d48",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Logout
        </Text>
      </Pressable>
    </View>
  )
}
