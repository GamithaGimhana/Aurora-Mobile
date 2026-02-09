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
import { toggleTheme } from "@/src/redux/slices/themeSlice"; // Import toggle action
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
  KeyRound,
  Moon,
  Sun
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";

// Helper component updated for dynamic theme colors
const SettingItem = ({ icon: Icon, title, value, onPress, isDestructive = false, darkMode }: any) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center border p-5 rounded-[28px] mb-3 shadow-sm ${
      darkMode 
        ? "bg-white/5 border-white/10 active:bg-white/10" 
        : "bg-white border-gray-100 active:bg-gray-50"
    }`}
  >
    <View className={`w-10 h-10 rounded-xl items-center justify-center ${
      isDestructive ? "bg-red-500/20" : (darkMode ? "bg-purple-500/20" : "bg-purple-50")
    }`}>
      <Icon size={20} color={isDestructive ? "#EF4444" : "#9333EA"} />
    </View>
    <View className="flex-1 ml-4">
      <Text className={`font-bold ${
        isDestructive ? "text-red-500" : (darkMode ? "text-white" : "text-[#1A1A1A]")
      }`}>{title}</Text>
      {value && <Text className="text-gray-400 text-xs mt-0.5 font-medium">{value}</Text>}
    </View>
    {!isDestructive && <ChevronRight size={18} color={darkMode ? "#4B5563" : "#D1D5DB"} />}
  </Pressable>
);

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { user, loading: authLoading } = useAppSelector(state => state.auth);
  const { darkMode } = useAppSelector(state => state.theme); // Consuming theme state

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
    <View className={`flex-1 ${darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]"}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="px-8">
          
          {/* Avatar Header */}
          <Animated.View entering={FadeInUp.delay(200)} className="items-center py-12">
            <View className="relative">
              <View className={`w-32 h-32 rounded-[45px] items-center justify-center shadow-xl border ${
                darkMode ? "bg-white/5 border-white/10 shadow-purple-900/40" : "bg-white border-purple-50 shadow-purple-900/10"
              }`}>
                <Text className="text-purple-600 text-5xl font-black">
                  {user.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Pressable 
                onPress={() => setNameModalVisible(true)}
                className={`absolute bottom-0 right-0 w-10 h-10 rounded-2xl items-center justify-center border-4 shadow-sm ${
                  darkMode ? "bg-purple-500 border-[#050505]" : "bg-purple-600 border-[#FAFAFA]"
                }`}
              >
                <Edit3 size={16} color="white" />
              </Pressable>
            </View>
            <Text className={`text-3xl font-black mt-6 tracking-tighter ${darkMode ? "text-white" : "text-[#1A1A1A]"}`}>
              {user.name}
            </Text>
          </Animated.View>

          {/* Theme Section */}
          <Animated.View entering={FadeInDown.delay(350)} className="mb-8">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-2">Appearance</Text>
            <SettingItem 
              icon={darkMode ? Moon : Sun} 
              title={darkMode ? "Dark Mode" : "Light Mode"} 
              value="Switch app appearance" 
              onPress={() => dispatch(toggleTheme())} 
              darkMode={darkMode}
            />
          </Animated.View>

          {/* Account Section */}
          <Animated.View entering={FadeInDown.delay(400)} className="mb-8">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-2">Personal Identity</Text>
            <SettingItem icon={User} title="Display Name" value={user.name} onPress={() => setNameModalVisible(true)} darkMode={darkMode} />
            <SettingItem icon={Mail} title="Email Address" value={user.email} darkMode={darkMode} />
          </Animated.View>

          {/* Security Section */}
          <Animated.View entering={FadeInDown.delay(600)}>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-2">Security & Privacy</Text>
            <SettingItem icon={ShieldCheck} title="Update Password" value="Keep your account secure" onPress={() => setPassModalVisible(true)} darkMode={darkMode} />
            <SettingItem icon={LogOut} title="Sign Out" isDestructive onPress={handleLogout} darkMode={darkMode} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* --- CENTERED MODALS (Updated for Theme) --- */}
      {[ 
        { visible: nameModalVisible, setVisible: setNameModalVisible, title: "Edit Name", type: 'name' },
        { visible: passModalVisible, setVisible: setPassModalVisible, title: "Security", type: 'pass' }
      ].map((modal, i) => (
        <Modal key={i} animationType="fade" transparent={true} visible={modal.visible}>
          <View className="flex-1 justify-center items-center bg-black/60 px-8">
            <Animated.View entering={FadeIn} className={`w-full rounded-[40px] p-8 shadow-2xl ${darkMode ? "bg-[#121212] border border-white/10" : "bg-white"}`}>
              <View className="flex-row justify-between items-center mb-6">
                <Text className={`text-2xl font-black ${darkMode ? "text-white" : "text-[#1A1A1A]"}`}>{modal.title}</Text>
                <Pressable onPress={() => modal.setVisible(false)} className={darkMode ? "bg-white/10 p-2 rounded-full" : "bg-gray-100 p-2 rounded-full"}>
                  <X size={18} color={darkMode ? "white" : "#6B7280"} />
                </Pressable>
              </View>

              {modal.type === 'name' ? (
                <View className={`border rounded-2xl px-5 py-4 flex-row items-center mb-8 ${darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
                  <User size={18} color="#9333EA" />
                  <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Full Name"
                    placeholderTextColor={darkMode ? "#6B7280" : "#9CA3AF"}
                    className={`text-base font-bold flex-1 ml-3 ${darkMode ? "text-white" : "text-[#1A1A1A]"}`}
                  />
                </View>
              ) : (
                <View className="gap-y-4 mb-8">
                  <View className={`border rounded-2xl px-5 py-4 flex-row items-center ${darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
                    <KeyRound size={18} color="#9333EA" />
                    <TextInput
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Current Password"
                      secureTextEntry
                      placeholderTextColor={darkMode ? "#6B7280" : "#9CA3AF"}
                      className={`text-base font-bold flex-1 ml-3 ${darkMode ? "text-white" : "text-[#1A1A1A]"}`}
                    />
                  </View>
                  <View className={`border rounded-2xl px-5 py-4 flex-row items-center ${darkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}>
                    <Lock size={18} color="#9333EA" />
                    <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="New Password"
                      secureTextEntry
                      placeholderTextColor={darkMode ? "#6B7280" : "#9CA3AF"}
                      className={`text-base font-bold flex-1 ml-3 ${darkMode ? "text-white" : "text-[#1A1A1A]"}`}
                    />
                  </View>
                </View>
              )}

              <Pressable
                onPress={modal.type === 'name' ? handleUpdateName : handleChangePassword}
                disabled={isUpdating}
                className="bg-purple-600 h-14 rounded-2xl flex-row items-center justify-center shadow-lg"
              >
                {isUpdating ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Confirm Changes</Text>}
              </Pressable>
            </Animated.View>
          </View>
        </Modal>
      ))}
    </View>
  );
}