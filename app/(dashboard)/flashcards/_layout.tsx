import { Stack } from 'expo-router'

const FlashcardsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0A0A' },
        animation: 'slide_from_right',
      }}
    >
      {/* 1. Flashcards Home */}
      <Stack.Screen
        name="index"
        options={{ title: 'Flashcards' }}
      />

      {/* 2. Study Mode */}
      <Stack.Screen
        name="study"
        options={{
          title: 'Study',
          animation: 'slide_from_right',
          gestureEnabled: false, // prevents accidental swipe-back
        }}
      />

      {/* 3. Create / Edit Flashcard */}
      <Stack.Screen
        name="form"
        options={{
          title: 'Flashcard Form',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  )
}

export default FlashcardsLayout
