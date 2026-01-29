import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import notesReducer from "./slices/notesSlice"
import flashcardsReducer from "./slices/flashcardsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    flashcards: flashcardsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
