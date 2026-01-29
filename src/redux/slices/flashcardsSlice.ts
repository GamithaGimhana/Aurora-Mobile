import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Flashcard } from "@/src/types/flashcard"
import {
  getAllFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard
} from "@/src/services/flashcardService"

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

// ---------------- THUNKS ----------------

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
  Omit<Flashcard, "id">
>("flashcards/add", async (cardData, { rejectWithValue }) => {
  try {
    return await createFlashcard(cardData)
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const updateFlashcardThunk = createAsyncThunk<
  Flashcard,
  Flashcard
>("flashcards/update", async (card, { rejectWithValue }) => {
  try {
    return await updateFlashcard(card)
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

// ---------------- SLICE ----------------

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
  }
})

export const { clearFlashcards } = flashcardsSlice.actions
export default flashcardsSlice.reducer
