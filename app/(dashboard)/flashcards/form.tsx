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
      Alert.alert("Validation Error", "All fields (Set Title, Question, and Answer) are required.");
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
      Alert.alert("Error", err || "Something went wrong while saving.");
    }
  };

  return (
    <View className="flex-1 bg-[#050505]">
      <StatusBar style="light" />
      
      {/* Background Glow */}
      <View className="absolute top-[-50] left-[-50] w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* HEADER */}
          <View className="px-6 flex-row items-center justify-between py-4">
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
            >
              <ChevronLeft size={24} color="white" />
            </Pressable>
            
            <Text className="text-white text-xl font-black tracking-tight">
              {cardId ? "Edit Card" : "New Card"}
            </Text>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`w-12 h-12 rounded-2xl items-center justify-center ${
                loading ? "bg-gray-800" : "bg-purple-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Check size={24} color="white" strokeWidth={3} />
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
                <Book size={14} color="#A855F7" />
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Study Set Title (e.g., Biology)
                </Text>
              </View>
              <View className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Set Title"
                  placeholderTextColor="#4B5563"
                  className="text-white text-base font-bold"
                />
              </View>
            </Animated.View>

            {/* QUESTION INPUT */}
            <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
              <View className="flex-row items-center mb-3 ml-1">
                <HelpCircle size={14} color="#A855F7" />
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Question
                </Text>
              </View>
              <View className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 h-24">
                <TextInput
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Ask a question..."
                  placeholderTextColor="#4B5563"
                  multiline
                  className="text-white text-base font-medium h-full"
                  textAlignVertical="top"
                />
              </View>
            </Animated.View>

            {/* ANSWER INPUT */}
            <Animated.View entering={FadeInUp.delay(600)} className="mb-10">
              <View className="flex-row items-center mb-3 ml-1">
                <MessageSquare size={14} color="#A855F7" />
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[2px] ml-2">
                  Correct Answer
                </Text>
              </View>
              <View className="bg-white/5 border border-white/10 rounded-3xl px-5 py-5 h-40">
                <TextInput
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Provide the correct answer..."
                  placeholderTextColor="#4B5563"
                  multiline
                  textAlignVertical="top"
                  className="text-gray-300 text-base leading-6 h-full"
                />
              </View>
            </Animated.View>

            {/* SAVE BUTTON */}
            <Animated.View entering={FadeInDown.delay(800)} className="pb-10">
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-purple-500/20 ${
                  loading ? "bg-gray-800" : "bg-purple-600"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">
                      {cardId ? "Update Flashcard" : "Save Flashcard"}
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