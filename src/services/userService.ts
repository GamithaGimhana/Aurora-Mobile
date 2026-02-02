import { auth } from "@/src/services/firebase"
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore"
import { db } from "./firebase"
import { UserProfile } from "@/src/types/user"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth"

// Get current user's profile
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("User profile not found")

  return snap.data() as UserProfile
}

// Create user profile (safe to call again)
export const createUserProfile = async (
  uid: string,
  name: string,
  email: string | null
) => {
  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      name,
      email,
      role: "user",
      createdAt: serverTimestamp()
    },
    { merge: true } // prevents overwrite
  )
}

// Update profile
export const updateUserProfile = async (name: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  await updateDoc(doc(db, "users", user.uid), {
    name
  })
}

export const reauthenticate = async (
  currentPassword: string
) => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  const credential = EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  await reauthenticateWithCredential(user, credential);
};

export const changePassword = async (
  newPassword: string
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  await updatePassword(user, newPassword);
};