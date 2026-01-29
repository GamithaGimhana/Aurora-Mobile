import { View, Text, Pressable, ScrollView } from "react-native"
import { useEffect } from "react"
import { useRouter } from "expo-router"

import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { useAppSelector } from "@/src/hooks/useAppSelector"
import { fetchFlashcardsThunk } from "@/src/redux/slices/flashcardsSlice"

export default function Flashcards() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user } = useAppSelector(state => state.auth)
  const { cards, loading, error } = useAppSelector(
    state => state.flashcards
  )

  useEffect(() => {
    if (!user) return
    dispatch(fetchFlashcardsThunk())
  }, [user, dispatch])

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      {/* HEADER */}
      <View className="flex-row justify-between mb-6">
        <Text className="text-2xl font-bold">Flashcards</Text>

        <Pressable
          onPress={() => router.push("/(dashboard)/flashcards/form")}
          className="bg-emerald-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-bold">+ Add</Text>
        </Pressable>
      </View>

      {/* STATES */}
      {loading && (
        <Text className="text-center text-gray-400 mt-10">
          Loading flashcards...
        </Text>
      )}

      {error && (
        <Text className="text-center text-red-500 mt-10">
          {error}
        </Text>
      )}

      {!loading && cards.length === 0 && (
        <Text className="text-gray-400 text-center mt-10">
          No flashcards yet
        </Text>
      )}

      {/* LIST */}
      <ScrollView>
        {cards.map(card => (
          <Pressable
            key={card.id}
            onPress={() =>
              router.push({
                pathname: "/(dashboard)/flashcards/form",
                params: { cardId: card.id }
              })
            }
            className="p-4 bg-slate-100 rounded-xl mb-3"
          >
            <Text className="font-bold mb-1">
              {card.question}
            </Text>

            <Text
              className="text-gray-500 text-sm"
              numberOfLines={2}
            >
              {card.answer}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}
