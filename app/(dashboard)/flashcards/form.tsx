import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  SafeAreaView
} from "react-native"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"

import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { useAppSelector } from "@/src/hooks/useAppSelector"

import {
  addFlashcardThunk,
  updateFlashcardThunk
} from "@/src/redux/slices/flashcardsSlice"

export default function FlashcardForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { cardId } = useLocalSearchParams<{ cardId?: string }>()

  const existingCard = useAppSelector(state =>
    cardId
      ? state.flashcards.cards.find(c => c.id === cardId)
      : null
  )

  const { loading } = useAppSelector(state => state.flashcards)

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  // Prefill on edit
  useEffect(() => {
    if (!existingCard) return
    setQuestion(existingCard.question)
    setAnswer(existingCard.answer)
  }, [existingCard])

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Validation Error", "All fields are required")
      return
    }

    try {
      if (cardId) {
        await dispatch(
          updateFlashcardThunk({
            id: cardId,
            question,
            answer
          })
        ).unwrap()

        Alert.alert("Success", "Flashcard updated")
      } else {
        await dispatch(
          addFlashcardThunk({ question, answer })
        ).unwrap()

        Alert.alert("Success", "Flashcard created")
      }

      router.back()
    } catch (err: any) {
      Alert.alert("Error", err || "Something went wrong")
    }
  }

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
  )
}
