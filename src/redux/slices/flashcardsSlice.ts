import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Flashcard } from "@/src/types/flashcard"
import {
  getAllFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard
} from "@/src/services/flashcardService"
import { RootState } from "@/src/redux/store"
import { logoutThunk } from "@/src/redux/slices/authSlice"
import { db } from "@/src/services/firebase"
import { doc, getDoc } from "firebase/firestore"

interface FlashcardsState {
  cards: Flashcard[]
  loading: boolean
  error: string | null
}

const initialState: FlashcardsState = {
  cards: [],
  loading: false,
  error: null
}

// THUNKS

export const fetchFlashcardsThunk = createAsyncThunk<Flashcard[]>(
  "flashcards/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllFlashcards()
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const addFlashcardThunk = createAsyncThunk<
  Flashcard,
  { question: string; answer: string }
>("flashcards/add", async ({ question, answer }, { rejectWithValue }) => {
  try {
    return await addFlashcard(question, answer)
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const updateFlashcardThunk = createAsyncThunk<
  Flashcard,
  { id: string; question: string; answer: string }
>("flashcards/update", async ({ id, question, answer }, { rejectWithValue }) => {
  try {
    return await updateFlashcard(id, question, answer)
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const deleteFlashcardThunk = createAsyncThunk<string, string>(
  "flashcards/delete",
  async (cardId, { rejectWithValue }) => {
    try {
      await deleteFlashcard(cardId)
      return cardId
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const getFlashcardById = async (id: string): Promise<Flashcard> => {
  const ref = doc(db, "flashcards", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    throw new Error("Flashcard not found")
  }

  return { id: snap.id, ...(snap.data() as Omit<Flashcard, "id">) }
}

// SLICE

const flashcardsSlice = createSlice({
  name: "flashcards",
  initialState,
  reducers: {
    clearFlashcards(state) {
      state.cards = []
    }
  },
  extraReducers: builder => {
    builder
      // FETCH
      .addCase(fetchFlashcardsThunk.pending, state => {
        state.loading = true
      })
      .addCase(fetchFlashcardsThunk.fulfilled, (state, action) => {
        state.cards = action.payload
        state.loading = false
      })
      .addCase(fetchFlashcardsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ADD
      .addCase(addFlashcardThunk.fulfilled, (state, action) => {
        state.cards.unshift(action.payload)
      })

      // UPDATE
      .addCase(updateFlashcardThunk.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.cards[index] = action.payload
        }
      })

      // DELETE
      .addCase(deleteFlashcardThunk.fulfilled, (state, action) => {
        state.cards = state.cards.filter(c => c.id !== action.payload)
      })
      // LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.cards = []
        state.error = null
        state.loading = false
      })
  }
})

export const selectFlashcardById = (state: RootState, id: string) =>
  state.flashcards.cards.find(c => c.id === id)

export const { clearFlashcards } = flashcardsSlice.actions
export default flashcardsSlice.reducer
