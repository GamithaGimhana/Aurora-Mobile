import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"

// Register
export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  await updateProfile(userCredential.user, {
    displayName: fullName,
  })

  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    name: fullName,
    email,
    role: "user",
    createdAt: new Date(),
  })

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    name: fullName,
  }
}

// Login
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    name: userCredential.user.displayName,
  }
}

// Logout
export const logoutUser = async () => {
  await signOut(auth)
}

// Firebase auth listener
export const subscribeToAuthChanges = (
  callback: (user: any | null) => void
) => {
  return onAuthStateChanged(auth, user => {
    if (!user) {
      callback(null)
      return
    }

    callback({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
    })
  })
}
