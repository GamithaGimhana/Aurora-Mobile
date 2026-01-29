import React, { useEffect } from "react"
import { View, Text, Pressable, ScrollView, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { useAppSelector } from "@/src/hooks/useAppSelector"
import { logoutThunk } from "@/src/redux/slices/authSlice"
import {
  User,
  Mail,
  LogOut,
  Settings,
  Shield,
  ChevronRight
} from "lucide-react-native"

// ------------------ Reusable Row ------------------
const ProfileSetting = ({
  icon: Icon,
  title,
  value,
  onPress,
  isDestructive = false
}: {
  icon: any
  title: string
  value?: string
  onPress?: () => void
  isDestructive?: boolean
}) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center px-6 py-5 bg-white border-b border-gray-50 active:bg-gray-50"
  >
    <View
      className={`w-10 h-10 rounded-xl items-center justify-center ${
        isDestructive ? "bg-red-50" : "bg-indigo-50"
      }`}
    >
      <Icon size={20} color={isDestructive ? "#EF4444" : "#4F46E5"} />
    </View>

    <View className="flex-1 ml-4">
      <Text
        className={`text-sm font-bold ${
          isDestructive ? "text-red-500" : "text-gray-900"
        }`}
      >
        {title}
      </Text>
      {value && <Text className="text-gray-400 text-xs mt-1">{value}</Text>}
    </View>

    {!isDestructive && <ChevronRight size={18} color="#D1D5DB" />}
  </Pressable>
)

// ------------------ Main Screen ------------------
export default function Profile() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, initialized } = useAppSelector(state => state.auth)

  // Redirect if not logged in
  useEffect(() => {
    if (initialized && !user) {
      router.replace("/(auth)/login")
    }
  }, [user, initialized])

  if (!initialized || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Loading profile...</Text>
      </View>
    )
  }

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => dispatch(logoutThunk()) }
      ]
    )
  }

  const displayName = user?.name || "Aurora User"
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- HEADER ---------- */}
        <View className="bg-indigo-600 pt-16 pb-12 items-center rounded-b-[48px]">
          <View className="w-24 h-24 bg-white/20 rounded-full border-4 border-white/30 items-center justify-center mb-4">
            <Text className="text-white text-4xl font-black">{avatarLetter}</Text>
          </View>

          <Text className="text-white text-2xl font-black">{displayName}</Text>

          <Text className="text-white/70 text-xs mt-2">UID: {user.uid.slice(0, 6)}…</Text>
        </View>

        {/* ---------- ACCOUNT INFO ---------- */}
        <View className="mt-8 px-6">
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">
            Account Information
          </Text>

          <View className="bg-white rounded-3xl overflow-hidden border border-gray-100">
            <ProfileSetting icon={User} title="Display Name" value={displayName} />
            <ProfileSetting icon={Mail} title="Email" value={user?.email || "Not available"} />
          </View>
        </View>

        {/* ---------- SETTINGS ---------- */}
        <View className="mt-8 px-6">
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">
            Settings & Security
          </Text>

          <View className="bg-white rounded-3xl overflow-hidden border border-gray-100">
            <ProfileSetting icon={Shield} title="Privacy & Security" />
            <ProfileSetting icon={Settings} title="App Preferences" />
            <ProfileSetting icon={LogOut} title="Sign Out" isDestructive onPress={handleLogout} />
          </View>
        </View>

        {/* ---------- FOOTER ---------- */}
        <View className="items-center py-10">
          <Text className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
            Aurora Mobile • v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
