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

// Function to add a new flashcard
// export const addFlashcard = async (
//   question: string,
//   answer: string
// ) => {
//   const user = auth.currentUser
//   if (!user) throw new Error("User not authenticated")

//   await addDoc(flashcardsCollection, {
//     question,
//     answer,
//     userId: user.uid,
//     createdAt: serverTimestamp(),
//     updatedAt: serverTimestamp(),
//   })
// }
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
    createdAt: serverTimestamp()
  })

  return {
    id: docRef.id,
    question,
    answer,
    userId: user.uid,
    createdAt: new Date().toISOString()
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
      createdAt: data.createdAt
    }
  })
}

// Function to read a single flashcard
export const getFlashcardById = async (id: string): Promise<Flashcard> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "flashcards", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Flashcard not found")
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized")

  const data = snap.data()
  return {
    id: snap.id,
    question: data.question,
    answer: data.answer,
    userId: data.userId,
    createdAt: data.createdAt
  }
}

// Function to update a flashcard
// export const updateFlashcard = async (
//   id: string,
//   question: string,
//   answer: string
// ) => {
//   const user = auth.currentUser
//   if (!user) throw new Error("User not authenticated")

//   const ref = doc(db, "flashcards", id)
//   const snap = await getDoc(ref)

//   if (!snap.exists()) throw new Error("Flashcard not found")
//   if (snap.data().userId !== user.uid) throw new Error("Unauthorized")

//   await updateDoc(ref, { question, answer })
// }
export const updateFlashcard = async (
  id: string,
  question: string,
  answer: string
): Promise<Flashcard> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  await updateDoc(doc(db, "flashcards", id), {
    question,
    answer
  })

  return {
    id,
    question,
    answer,
    userId: user.uid,
    createdAt: new Date().toISOString()
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
