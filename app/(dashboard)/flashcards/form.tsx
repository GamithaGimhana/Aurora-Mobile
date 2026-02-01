import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import {
  addFlashcardThunk,
  updateFlashcardThunk,
  fetchFlashcardByIdThunk,
  selectFlashcardById,
} from "@/src/redux/slices/flashcardsSlice";

export default function FlashcardForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cardId } = useLocalSearchParams<{ cardId?: string }>();

  const card = useAppSelector(state =>
    cardId ? selectFlashcardById(state, cardId) : null
  );

  const { loading } = useAppSelector(state => state.flashcards);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // LOAD CARD SAFELY 
  useEffect(() => {
    if (!cardId) return;

    if (!card) {
      dispatch(fetchFlashcardByIdThunk(cardId));
      return;
    }

    setQuestion(card.question);
    setAnswer(card.answer);
  }, [cardId, card]);

  // SUBMIT 
  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    try {
      if (cardId) {
        await dispatch(
          updateFlashcardThunk({
            id: cardId,
            question,
            answer,
          })
        ).unwrap();

        Alert.alert("Success", "Flashcard updated");
      } else {
        await dispatch(
          addFlashcardThunk({ question, answer })
        ).unwrap();

        Alert.alert("Success", "Flashcard created");
      }

      router.back();
    } catch (err: any) {
      Alert.alert("Error", err || "Something went wrong");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold mb-6">
          {cardId ? "Edit Flashcard" : "New Flashcard"}
        </Text>

        <TextInput
          placeholder="Question"
          value={question}
          onChangeText={setQuestion}
          className="border border-gray-300 rounded-xl p-4 mb-4"
        />

        <TextInput
          placeholder="Answer"
          value={answer}
          onChangeText={setAnswer}
          multiline
          className="border border-gray-300 rounded-xl p-4 h-32 mb-6"
        />

        <Pressable
          disabled={loading}
          onPress={handleSubmit}
          className={`py-4 rounded-xl ${
            loading ? "bg-slate-400" : "bg-emerald-600"
          }`}
        >
          <Text className="text-white font-bold text-center text-lg">
            {loading ? "Saving..." : "Save Flashcard"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
