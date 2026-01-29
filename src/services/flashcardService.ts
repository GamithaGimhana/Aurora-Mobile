import { getAuth } from "firebase/auth"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore"

import { db } from "./firebase"
import { Flashcard } from "@/src/types/flashcard"

const auth = getAuth()
const flashcardsCollection = collection(db, "flashcards")

// Function to add a new flashcard
export const addFlashcard = async (
  question: string,
  answer: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  await addDoc(flashcardsCollection, {
    question,
    answer,
    userId: user.uid,
    createdAt: new Date().toISOString()
  })
}

// Function to get all flashcards for the current user
export const getAllFlashcards = async (): Promise<Flashcard[]> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const q = query(
    flashcardsCollection,
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      question: data.question,
      answer: data.answer,
      userId: data.userId,
      createdAt: data.createdAt
    }
  })
}
