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
import { serverTimestamp } from "firebase/firestore"

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
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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

// Function to get a single note by ID
export const getNoteById = async (id: string): Promise<Note> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "notes", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Note not found")

  const data = snap.data()
  if (data.userId !== user.uid) throw new Error("Unauthorized")

  return {
    id: snap.id,
    title: data.title,
    content: data.content,
    userId: data.userId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

// Function to update a note
export const updateNote = async (
  id: string,
  title: string,
  content: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "notes", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Note not found")
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized")

  await updateDoc(ref, {
    title,
    content,
    updatedAt: serverTimestamp(),
  })
}

// Function to delete a note
export const deleteNote = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "notes", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Note not found")
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized")

  await deleteDoc(ref)
}
