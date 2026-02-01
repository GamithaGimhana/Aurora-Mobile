import { auth } from "@/src/services/firebase";
import { Note } from "@/src/types/note";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

const toIsoString = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (value.toDate && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};

const notesCollection = collection(db, "notes");

// Function to add a new note
export const addNote = async (
  title: string,
  content: string,
): Promise<Note> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const docRef = await addDoc(notesCollection, {
    title,
    content,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    title,
    content,
    userId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Function to get all notes for the current user
export const getAllNotes = async (): Promise<Note[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const q = query(
    notesCollection,
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      userId: data.userId,
      createdAt: toIsoString(data.createdAt),
      updatedAt: data.updatedAt ? toIsoString(data.updatedAt) : undefined,
    };
  });
};

// Function to get a single note by ID
export const getNoteById = async (id: string): Promise<Note> => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const ref = doc(db, "notes", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error("Note not found")

  const data = snap.data()

  if (data.userId !== user.uid) {
    throw new Error("Unauthorized")
  }

  return {
    id: snap.id,
    title: data.title,
    content: data.content,
    userId: data.userId,
    createdAt: toIsoString(data.createdAt),
    updatedAt: data.updatedAt
      ? toIsoString(data.updatedAt)
      : undefined,
  }
}

// Function to update a note
export const updateNote = async (
  id: string,
  title: string,
  content: string,
): Promise<Note> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const ref = doc(db, "notes", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Note not found");
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized");

  const data = snap.data();

  await updateDoc(ref, {
    title,
    content,
    updatedAt: serverTimestamp(),
  });

  return {
    id,
    title,
    content,
    userId: user.uid,
    createdAt: toIsoString(data.createdAt),
    updatedAt: new Date().toISOString(),
  };
};

// Function to delete a note
export const deleteNote = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const ref = doc(db, "notes", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Note not found");
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized");

  await deleteDoc(ref);
};
