import { logoutThunk } from "@/src/redux/slices/authSlice";
import { RootState } from "@/src/redux/store";
import {
  addNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "@/src/services/noteService";
import { Note } from "@/src/types/note";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

// THUNKS

export const fetchNotesThunk = createAsyncThunk<Note[]>(
  "notes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllNotes();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchNoteByIdThunk = createAsyncThunk<
  Note,
  string
>("notes/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await getNoteById(id)
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const addNoteThunk = createAsyncThunk<
  Note,
  { title: string; content: string }
>("notes/add", async ({ title, content }, { rejectWithValue }) => {
  try {
    return await addNote(title, content);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateNoteThunk = createAsyncThunk<
  Note,
  { id: string; title: string; content: string }
>("notes/update", async ({ id, title, content }, { rejectWithValue }) => {
  try {
    return await updateNote(id, title, content);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteNoteThunk = createAsyncThunk<string, string>(
  "notes/delete",
  async (noteId, { rejectWithValue }) => {
    try {
      await deleteNote(noteId);
      return noteId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// SLICE

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNotes(state) {
      state.notes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchNotesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotesThunk.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNoteByIdThunk.fulfilled, (state, action) => {
        const index = state.notes.findIndex(n => n.id === action.payload.id)
        if (index === -1) {
          state.notes.push(action.payload)
        } else {
          state.notes[index] = action.payload
        }
      })

      // ADD
      .addCase(addNoteThunk.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateNoteThunk.fulfilled, (state, action) => {
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteNoteThunk.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n.id !== action.payload);
      })
      // LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.notes = [];
        state.error = null;
        state.loading = false;
      });
  },
});

export const selectNoteById = (state: RootState, id: string) =>
  state.notes.notes.find((n) => n.id === id);

export const { clearNotes } = notesSlice.actions;
export default notesSlice.reducer;
