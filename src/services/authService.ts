import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { AuthUser } from "../types/AuthUser"

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
    createdAt: serverTimestamp(),
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
  callback: (user: AuthUser | null) => void
) => {
  return onAuthStateChanged(auth, async user => {
    if (!user) {
      callback(null)
      return
    }

    const snap = await getDoc(doc(db, "users", user.uid))

    callback({
      uid: user.uid,
      email: user.email,
      name: snap.exists() ? snap.data().name : user.displayName
    })
  })
}