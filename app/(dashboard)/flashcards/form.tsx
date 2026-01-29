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
import { MaterialIcons } from "@expo/vector-icons"

import {
  addFlashcard,
  getFlashcardById,
  updateFlashcard
} from "@/src/services/flashcardService"

export default function FlashcardForm() {
  const router = useRouter()
  const { cardId } = useLocalSearchParams<{ cardId?: string }>()

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cardId) return

    setLoading(true)
    getFlashcardById(cardId)
      .then(card => {
        setQuestion(card.question)
        setAnswer(card.answer)
      })
      .catch(() => Alert.alert("Error", "Failed to load flashcard"))
      .finally(() => setLoading(false))
  }, [cardId])

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Validation Error", "All fields are required")
      return
    }

    try {
      setLoading(true)

      if (cardId) {
        await updateFlashcard(cardId, question, answer)
        Alert.alert("Success", "Flashcard updated")
      } else {
        await addFlashcard(question, answer)
        Alert.alert("Success", "Flashcard created")
      }

      router.back()
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong")
    } finally {
      setLoading(false)
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
