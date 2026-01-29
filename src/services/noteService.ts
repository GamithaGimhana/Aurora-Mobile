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
import { Note } from "@/src/types/note"

const auth = getAuth()
const notesCollection = collection(db, "notes")

// Function to add a new note
export const addNote = async (
  title: string,
  content: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  await addDoc(notesCollection, {
    title,
    content,
    userId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

// Function to get all notes for the current user
export const getAllNotes = async (): Promise<Note[]> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const q = query(
    notesCollection,
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  })
}
