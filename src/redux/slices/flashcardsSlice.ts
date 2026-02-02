import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Flashcard } from "@/src/types/flashcard"
import {
  getAllFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcardById
} from "@/src/services/flashcardService"
import { RootState } from "@/src/redux/store"
import { logoutThunk } from "@/src/redux/slices/authSlice"

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

export const fetchFlashcardByIdThunk = createAsyncThunk<
  Flashcard,
  string
>("flashcards/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await getFlashcardById(id)
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const addFlashcardThunk = createAsyncThunk<
  Flashcard,
  { title: string; question: string; answer: string }
>("flashcards/add", async ({ title, question, answer }, { rejectWithValue }) => {
  try {
    return await addFlashcard(title, question, answer)
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const updateFlashcardThunk = createAsyncThunk<
  Flashcard,
  { id: string; title: string; question: string; answer: string }
>("flashcards/update", async ({ id, title, question, answer }, { rejectWithValue }) => {
  try {
    return await updateFlashcard(id, title, question, answer)
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
      .addCase(fetchFlashcardByIdThunk.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c.id === action.payload.id)
        if (index === -1) {
          state.cards.push(action.payload)
        } else {
          state.cards[index] = action.payload
        }
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
