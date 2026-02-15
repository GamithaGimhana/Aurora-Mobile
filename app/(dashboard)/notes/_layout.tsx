import { Stack } from 'expo-router'

const NotesLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // custom header
        contentStyle: { backgroundColor: '#0A0A0A' }, 
        animation: 'slide_from_right',
      }}
    >
      {/* 1. Notes List */}
      <Stack.Screen
        name="index"
        options={{ title: 'Notes' }}
      />

      {/* 2. View Note */}
      <Stack.Screen
        name="view"
        options={{
          title: 'Note',
          animation: 'slide_from_right',
        }}
      />

      {/* 3. Create / Edit Note */}
      <Stack.Screen
        name="form"
        options={{
          title: 'Note Form',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  )
}

export default NotesLayout
