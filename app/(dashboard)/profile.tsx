import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  Alert, 
  TextInput, 
  Modal, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { logoutThunk, setUser } from "@/src/redux/slices/authSlice";
import { updateUserProfile, reauthenticate, changePassword } from "@/src/services/userService";
import {
  User,
  Mail,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Edit3,
  X,
  Check,
  Lock,
  KeyRound
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";

const SettingItem = ({ icon: Icon, title, value, onPress, isDestructive = false }: any) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center bg-white border border-gray-100 p-5 rounded-[28px] mb-3 shadow-sm active:bg-gray-50"
  >
    <View className={`w-10 h-10 rounded-xl items-center justify-center ${isDestructive ? "bg-red-50" : "bg-purple-50"}`}>
      <Icon size={20} color={isDestructive ? "#EF4444" : "#9333EA"} />
    </View>
    <View className="flex-1 ml-4">
      <Text className={`font-bold ${isDestructive ? "text-red-500" : "text-[#1A1A1A]"}`}>{title}</Text>
      {value && <Text className="text-gray-400 text-xs mt-0.5 font-medium">{value}</Text>}
    </View>
    {!isDestructive && <ChevronRight size={18} color="#D1D5DB" />}
  </Pressable>
);

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector(state => state.auth);

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [passModalVisible, setPassModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/(auth)/login");
  }, [user, authLoading]);

  const handleUpdateName = async () => {
    if (!newName.trim()) return Alert.alert("Error", "Name cannot be empty");
    setIsUpdating(true);
    try {
      await updateUserProfile(newName);
      if (user) dispatch(setUser({ ...user, name: newName }));
      Alert.alert("Success", "Profile updated!");
      setNameModalVisible(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return Alert.alert("Error", "All fields are required");
    setIsUpdating(true);
    try {
      await reauthenticate(currentPassword);
      await changePassword(newPassword);
      Alert.alert("Success", "Password updated!");
      setPassModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => dispatch(logoutThunk()) }
    ]);
  };

  if (authLoading || !user) return null;

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="px-8">
          
          {/* Avatar Header */}
          <Animated.View entering={FadeInUp.delay(200)} className="items-center py-12">
            <View className="relative">
              <View className="w-32 h-32 bg-white rounded-[45px] items-center justify-center shadow-xl shadow-purple-900/10 border border-purple-50">
                <Text className="text-purple-600 text-5xl font-black">
                  {user.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Pressable 
                onPress={() => setNameModalVisible(true)}
                className="absolute bottom-0 right-0 bg-purple-600 w-10 h-10 rounded-2xl items-center justify-center border-4 border-[#FAFAFA] shadow-sm"
              >
                <Edit3 size={16} color="white" />
              </Pressable>
            </View>
            <Text className="text-[#1A1A1A] text-3xl font-black mt-6 tracking-tighter">{user.name}</Text>
            <View className="bg-purple-100 px-3 py-1 rounded-lg mt-2">
               <Text className="text-purple-700 text-xs font-bold uppercase tracking-widest">Premium Student</Text>
            </View>
          </Animated.View>

          {/* Account Section */}
          <Animated.View entering={FadeInDown.delay(400)} className="mb-8">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-2">Personal Identity</Text>
            <SettingItem icon={User} title="Display Name" value={user.name} onPress={() => setNameModalVisible(true)} />
            <SettingItem icon={Mail} title="Email Address" value={user.email} />
          </Animated.View>

          {/* Security Section */}
          <Animated.View entering={FadeInDown.delay(600)}>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-2">Security & Privacy</Text>
            <SettingItem icon={ShieldCheck} title="Update Password" value="Keep your account secure" onPress={() => setPassModalVisible(true)} />
            <SettingItem icon={LogOut} title="Sign Out" isDestructive onPress={handleLogout} />
          </Animated.View>

          <View className="items-center pt-12 pb-8">
            <Text className="text-gray-300 text-[10px] font-bold uppercase tracking-[3px]">Aurora v1.0.0 • 2026</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* --- CENTERED NAME MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={nameModalVisible}>
        <View className="flex-1 justify-center items-center bg-[#1A1A1A]/40 px-8">
          <Animated.View entering={FadeIn} className="bg-white w-full rounded-[40px] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[#1A1A1A] text-2xl font-black">Edit Name</Text>
              <Pressable onPress={() => setNameModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                <X size={18} color="#6B7280" />
              </Pressable>
            </View>

            <View className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex-row items-center mb-8">
              <User size={18} color="#9333EA" />
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                className="text-[#1A1A1A] text-base font-bold flex-1 ml-3"
              />
            </View>

            <Pressable
              onPress={handleUpdateName}
              disabled={isUpdating}
              className="bg-purple-600 h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-purple-200"
            >
              {isUpdating ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Save Profile</Text>}
            </Pressable>
          </Animated.View>
        </View>
      </Modal>

      {/* --- CENTERED PASSWORD MODAL --- */}
      <Modal animationType="fade" transparent={true} visible={passModalVisible}>
        <View className="flex-1 justify-center items-center bg-[#1A1A1A]/40 px-8">
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-full">
            <Animated.View entering={FadeIn} className="bg-white w-full rounded-[40px] p-8 shadow-2xl">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-[#1A1A1A] text-2xl font-black">Security</Text>
                <Pressable onPress={() => setPassModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                  <X size={18} color="#6B7280" />
                </Pressable>
              </View>

              <View className="gap-y-4 mb-8">
                <View className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex-row items-center">
                  <KeyRound size={18} color="#9333EA" />
                  <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Current Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    className="text-[#1A1A1A] text-base font-bold flex-1 ml-3"
                  />
                </View>
                <View className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex-row items-center">
                  <Lock size={18} color="#9333EA" />
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    className="text-[#1A1A1A] text-base font-bold flex-1 ml-3"
                  />
                </View>
              </View>

              <Pressable
                onPress={handleChangePassword}
                disabled={isUpdating}
                className="bg-purple-600 h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-purple-200"
              >
                {isUpdating ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Update Security</Text>}
              </Pressable>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}