import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser, logoutUser } from '@/src/services/authService'

interface AuthState {
  user: null | {
    uid: string
    email: string | null
    name?: string | null
  }
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Async thunks
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginUser(email, password)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, password }: { fullName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      return await registerUser(fullName, email, password)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await logoutUser()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.loading = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => { state.loading = true; state.error = null })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerThunk.pending, state => { state.loading = true; state.error = null })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.user = null
        state.isAuthenticated = false
      })
  }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
