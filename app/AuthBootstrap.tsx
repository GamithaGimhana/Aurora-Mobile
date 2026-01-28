import { useEffect } from "react"
import { useAppDispatch } from "@/src/hooks/useAppDispatch"
import { subscribeToAuthChanges } from "@/src/services/authService"
import { setUser } from "@/src/redux/slices/authSlice"

export default function AuthBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(user => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        }))
      } else {
        dispatch(setUser(null))
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  return null
}
