import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, TextInput, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { logoutThunk, setUser } from "@/src/redux/slices/authSlice"; // Added setUser
import { updateUserProfile } from "@/src/services/userService";
import {
  User,
  Mail,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Edit3,
  X,
  Check
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const SettingItem = ({ icon: Icon, title, value, onPress, isDestructive = false }: any) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center bg-white/5 border border-white/10 p-5 rounded-[24px] mb-3 active:bg-white/10"
  >
    <View className={`w-10 h-10 rounded-xl items-center justify-center ${isDestructive ? "bg-red-500/20" : "bg-purple-500/20"}`}>
      <Icon size={20} color={isDestructive ? "#EF4444" : "#A855F7"} />
    </View>
    <View className="flex-1 ml-4">
      <Text className={`font-bold ${isDestructive ? "text-red-500" : "text-white"}`}>{title}</Text>
      {value && <Text className="text-gray-500 text-xs mt-1">{value}</Text>}
    </View>
    {!isDestructive && <ChevronRight size={18} color="#4B5563" />}
  </Pressable>
);

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector(state => state.auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/(auth)/login");
  }, [user, authLoading]);

  // --- Logic to sync state after update ---
  const handleUpdate = async () => {
    if (!newName.trim()) return Alert.alert("Error", "Name cannot be empty");
    setIsUpdating(true);
    try {
      // 1. Update the database via Firebase
      await updateUserProfile(newName);

      // 2. Update Redux state immediately so the app "reloads" the UI data
      if (user) {
        dispatch(setUser({ ...user, name: newName }));
      }

      Alert.alert("Success", "Profile updated successfully!");
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => dispatch(logoutThunk()) }
    ]);
  };

  if (authLoading || !user) return null;

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="px-6">
          
          <Animated.View entering={FadeInUp.delay(200)} className="items-center py-10">
            <View className="relative">
              <View className="w-28 h-28 bg-purple-600 rounded-full items-center justify-center border-4 border-white/10">
                <Text className="text-white text-4xl font-black">
                  {user.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Pressable 
                onPress={() => setModalVisible(true)}
                className="absolute bottom-0 right-0 bg-white w-8 h-8 rounded-full items-center justify-center border-2 border-[#050505]"
              >
                <Edit3 size={14} color="black" />
              </Pressable>
            </View>
            <Text className="text-white text-3xl font-black mt-4 tracking-tighter">{user.name}</Text>
            <Text className="text-gray-500 font-medium">Student • {user.email}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)}>
            <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-1">Account</Text>
            <SettingItem icon={User} title="Edit Name" value={user.name} onPress={() => setModalVisible(true)} />
            <SettingItem icon={Mail} title="Email Address" value={user.email} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} className="mt-6">
            <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-1">Security</Text>
            <SettingItem icon={ShieldCheck} title="Password & Security" value="Change your password" />
            <SettingItem icon={LogOut} title="Sign Out" isDestructive onPress={handleLogout} />
          </Animated.View>

          <View className="items-center py-10">
            <Text className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">Aurora v1.0.0 • 2026</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-[#121212] rounded-t-[40px] p-8 border-t border-white/10">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-white text-2xl font-black tracking-tight">Edit Profile</Text>
              <Pressable onPress={() => setModalVisible(false)} className="bg-white/10 p-2 rounded-full">
                <X size={20} color="white" />
              </Pressable>
            </View>

            <View className="mb-8">
              <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">Full Name</Text>
              <View className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter Name"
                  placeholderTextColor="#4B5563"
                  className="text-white text-base font-bold"
                />
              </View>
            </View>

            <Pressable
              onPress={handleUpdate}
              disabled={isUpdating}
              className="bg-purple-600 h-16 rounded-2xl flex-row items-center justify-center active:opacity-90"
            >
              {isUpdating ? <ActivityIndicator color="white" /> : (
                <>
                  <Text className="text-white font-bold text-lg mr-2">Save Changes</Text>
                  <Check size={20} color="white" />
                </>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}