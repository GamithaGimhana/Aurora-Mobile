import { Text } from 'react-native'
import { useAppSelector } from '@/src/hooks/useAppSelector'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  const auth = useAppSelector(state => state.auth)

  return <SafeAreaView className="flex-1 justify-center items-center bg-white"><Text>{JSON.stringify(auth)}</Text></SafeAreaView>
}
