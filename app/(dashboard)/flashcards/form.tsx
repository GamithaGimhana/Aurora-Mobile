import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import {
  addFlashcardThunk,
  updateFlashcardThunk,
  fetchFlashcardByIdThunk,
  selectFlashcardById,
} from "@/src/redux/slices/flashcardsSlice";
import { ChevronLeft, Check, BrainCircuit, HelpCircle, MessageSquare, Book } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function FlashcardForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cardId } = useLocalSearchParams<{ cardId?: string }>();

  // Theme and Data selectors
  const { darkMode } = useAppSelector((state) => state.theme);
  const card = useAppSelector((state) =>
    cardId ? selectFlashcardById(state, cardId) : null
  );
  const { loading } = useAppSelector((state) => state.flashcards);

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Sync state for editing
  useEffect(() => {
    if (!cardId) {
      setTitle("");
      setQuestion("");
      setAnswer("");
      return;
    }

    if (!card) {
      dispatch(fetchFlashcardByIdThunk(cardId));
    } else {
      setTitle(card.title || "");
      setQuestion(card.question);
      setAnswer(card.answer);
    }
  }, [cardId, card]);

  const handleSubmit = async () => {
    if (loading) return;

    if (!title.trim() || !question.trim() || !answer.trim()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    try {
      if (cardId) {
        await dispatch(
          updateFlashcardThunk({ id: cardId, title, question, answer })
        ).unwrap();
        Alert.alert("Success", "Flashcard updated");
      } else {
        await dispatch(
          addFlashcardThunk({ title, question, answer })
        ).unwrap();
        Alert.alert("Success", "Flashcard created");
      }
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err || "Something went wrong.");
    }
  };

  // Theme constants
  const bgColor = darkMode ? "bg-[#050505]" : "bg-[#FAFAFA]";
  const inputBg = darkMode ? "bg-white/5" : "bg-white";
  const inputBorder = darkMode ? "border-white/10" : "border-gray-200";
  const primaryText = darkMode ? "text-white" : "text-[#1A1A1A]";
  const bodyText = darkMode ? "text-gray-300" : "text-[#374151]";
  const labelText = darkMode ? "text-gray-500" : "text-gray-400";
  const placeholderColor = darkMode ? "#4B5563" : "#9CA3AF";

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      {/* Dynamic Background Glow */}
      <View className={`absolute top-[-50] left-[-50] w-96 h-96 rounded-full blur-3xl ${
        darkMode ? "bg-purple-900/15" : "bg-purple-100/40"
      }`} />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* HEADER */}
          <View className="px-6 flex-row items-center justify-between py-4">
            <Pressable
              onPress={() => router.back()}
              className={`w-11 h-11 ${inputBg} rounded-2xl items-center justify-center border ${inputBorder} shadow-sm active:opacity-70`}
            >
              <ChevronLeft size={22} color={darkMode ? "white" : "#1A1A1A"} />
            </Pressable>
            
            <Text className={`${primaryText} text-xl font-black tracking-tight`}>
              {cardId ? "Edit Card" : "New Card"}
            </Text>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`w-11 h-11 rounded-2xl items-center justify-center shadow-md ${
                loading ? (darkMode ? "bg-gray-800" : "bg-gray-300") : "bg-purple-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Check size={22} color="white" strokeWidth={3} />
              )}
            </Pressable>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
          >
            {/* SET TITLE INPUT */}
            <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
              <View className="flex-row items-center mb-3 ml-1">
                <Book size={14} color="#9333EA" />
                <Text className={`${labelText} text-[10px] font-bold uppercase tracking-[2px] ml-2`}>
                  Set Title (e.g., Biology)
                </Text>
              </View>
              <View className={`${inputBg} border ${inputBorder} rounded-2xl px-5 py-4 shadow-sm`}>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter study set title..."
                  placeholderTextColor={placeholderColor}
                  className={`${primaryText} text-base font-bold`}
                />
              </View>
            </Animated.View>

            {/* QUESTION INPUT */}
            <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
              <View className="flex-row items-center mb-3 ml-1">
                <HelpCircle size={14} color="#9333EA" />
                <Text className={`${labelText} text-[10px] font-bold uppercase tracking-[2px] ml-2`}>
                  Front Side (Question)
                </Text>
              </View>
              <View className={`${inputBg} border ${inputBorder} rounded-2xl px-5 py-4 h-28 shadow-sm`}>
                <TextInput
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="What is the question?"
                  placeholderTextColor={placeholderColor}
                  multiline
                  className={`${primaryText} text-base font-medium h-full`}
                  textAlignVertical="top"
                />
              </View>
            </Animated.View>

            {/* ANSWER INPUT */}
            <Animated.View entering={FadeInUp.delay(600)} className="mb-10">
              <View className="flex-row items-center mb-3 ml-1">
                <MessageSquare size={14} color="#9333EA" />
                <Text className={`${labelText} text-[10px] font-bold uppercase tracking-[2px] ml-2`}>
                  Back Side (Answer)
                </Text>
              </View>
              <View className={`${inputBg} border ${inputBorder} rounded-[35px] px-6 py-6 h-48 shadow-sm`}>
                <TextInput
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Provide the detailed answer..."
                  placeholderTextColor={placeholderColor}
                  multiline
                  textAlignVertical="top"
                  className={`${bodyText} text-base leading-6 font-medium h-full`}
                />
              </View>
            </Animated.View>

            {/* ACTION BUTTON */}
            <Animated.View entering={FadeInDown.delay(800)} className="pb-12">
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`h-16 rounded-[25px] flex-row items-center justify-center shadow-lg ${
                  loading 
                    ? (darkMode ? "bg-gray-800" : "bg-gray-400") 
                    : "bg-purple-600 shadow-purple-900/20"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2 uppercase tracking-widest">
                      {cardId ? "Update Card" : "Save Card"}
                    </Text>
                    <BrainCircuit size={20} color="white" strokeWidth={2} />
                  </>
                )}
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}