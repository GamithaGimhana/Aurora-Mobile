import { auth } from "@/src/services/firebase"
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
import { serverTimestamp } from "firebase/firestore"

const flashcardsCollection = collection(db, "flashcards")

// Helper function to convert Firestore timestamp to ISO string
const toIsoString = (timestamp: any): string => {
  return timestamp?.toDate?.()?.toISOString() ?? new Date().toISOString()
}

// Function to add a new flashcard
export const addFlashcard = async (
  question: string,
  answer: string
): Promise<Flashcard> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const docRef = await addDoc(flashcardsCollection, {
    question,
    answer,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const snap = await getDoc(docRef)
  const data = snap.data()!

  return {
    id: docRef.id,
    question: data.question,
    answer: data.answer,
    userId: data.userId,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
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
      createdAt: toIsoString(data.createdAt),
      updatedAt: data.updatedAt
        ? toIsoString(data.updatedAt)
        : undefined,
    }
  })
}

// Function to read a single flashcard
export const getFlashcardById = async (
  id: string
): Promise<Flashcard> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "flashcards", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Flashcard not found")

  const data = snap.data()

  if (data.userId !== user.uid) {
    throw new Error("Unauthorized")
  }

  return {
    id: snap.id,
    question: data.question,
    answer: data.answer,
    userId: data.userId,
    createdAt: toIsoString(data.createdAt),
    updatedAt: data.updatedAt
      ? toIsoString(data.updatedAt)
      : undefined,
  }
}

// Function to update a flashcard
export const updateFlashcard = async (
  id: string,
  question: string,
  answer: string
): Promise<Flashcard> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "flashcards", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Flashcard not found")

  const data = snap.data()
  if (data.userId !== user.uid) throw new Error("Unauthorized")

  await updateDoc(ref, {
    question,
    answer,
    updatedAt: serverTimestamp(),
  })

  const updatedSnap = await getDoc(ref)
  const updatedData = updatedSnap.data()!

  return {
    id,
    question: updatedData.question,
    answer: updatedData.answer,
    userId: updatedData.userId,
    createdAt: toIsoString(updatedData.createdAt),
    updatedAt: toIsoString(updatedData.updatedAt),
  }
}

// Function to delete a flashcard
export const deleteFlashcard = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "flashcards", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Flashcard not found")
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized")

  await deleteDoc(ref)
}
