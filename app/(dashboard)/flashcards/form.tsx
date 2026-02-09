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

  const card = useAppSelector((state) =>
    cardId ? selectFlashcardById(state, cardId) : null
  );
  const { loading } = useAppSelector((state) => state.flashcards);

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // --- SAFE LOAD & RESET LOGIC ---
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

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      {/* Soft Background Decor */}
      <View className="absolute top-[-50] left-[-50] w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* HEADER */}
          <View className="px-6 flex-row items-center justify-between py-4">
            <Pressable
              onPress={() => router.back()}
              className="w-11 h-11 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm active:bg-gray-50"
            >
              <ChevronLeft size={22} color="#1A1A1A" />
            </Pressable>
            
            <Text className="text-[#1A1A1A] text-xl font-black tracking-tight">
              {cardId ? "Edit Card" : "New Card"}
            </Text>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`w-11 h-11 rounded-2xl items-center justify-center shadow-md ${
                loading ? "bg-gray-300" : "bg-purple-600"
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
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Set Title (e.g., Biology)
                </Text>
              </View>
              <View className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm shadow-purple-900/5">
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter study set title..."
                  placeholderTextColor="#9CA3AF"
                  className="text-[#1A1A1A] text-base font-bold"
                />
              </View>
            </Animated.View>

            {/* QUESTION INPUT */}
            <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
              <View className="flex-row items-center mb-3 ml-1">
                <HelpCircle size={14} color="#9333EA" />
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Front Side (Question)
                </Text>
              </View>
              <View className="bg-white border border-gray-200 rounded-2xl px-5 py-4 h-28 shadow-sm shadow-purple-900/5">
                <TextInput
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="What is the question?"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  className="text-[#1A1A1A] text-base font-medium h-full"
                  textAlignVertical="top"
                />
              </View>
            </Animated.View>

            {/* ANSWER INPUT */}
            <Animated.View entering={FadeInUp.delay(600)} className="mb-10">
              <View className="flex-row items-center mb-3 ml-1">
                <MessageSquare size={14} color="#9333EA" />
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Back Side (Answer)
                </Text>
              </View>
              <View className="bg-white border border-gray-100 rounded-[35px] px-6 py-6 h-48 shadow-sm shadow-purple-900/5">
                <TextInput
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Provide the detailed answer..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  className="text-[#374151] text-base leading-6 font-medium h-full"
                />
              </View>
            </Animated.View>

            {/* ACTION BUTTON */}
            <Animated.View entering={FadeInDown.delay(800)} className="pb-12">
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`h-16 rounded-[25px] flex-row items-center justify-center shadow-lg shadow-purple-200 ${
                  loading ? "bg-gray-400" : "bg-purple-600"
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