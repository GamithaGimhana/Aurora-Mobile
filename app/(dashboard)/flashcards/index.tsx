import { View, Text, Pressable, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"

import { getAllFlashcards } from "@/src/services/flashcardService"
import { Flashcard } from "@/src/types/flashcard"

export default function Flashcards() {
  const router = useRouter()
  const [cards, setCards] = useState<Flashcard[]>([])

  useEffect(() => {
    getAllFlashcards().then(setCards).catch(console.error)
  }, [])

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <View className="flex-row justify-between mb-6">
        <Text className="text-2xl font-bold">Flashcards</Text>
        <Pressable
          onPress={() => router.push("/(dashboard)/flashcards/form")}
          className="bg-emerald-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-bold">+ Add</Text>
        </Pressable>
      </View>

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
            <Text className="font-bold mb-1">{card.question}</Text>
            <Text className="text-gray-500 text-sm" numberOfLines={2}>
              {card.answer}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}
