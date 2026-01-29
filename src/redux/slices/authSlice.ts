import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { loginUser, registerUser, logoutUser } from '@/src/services/authService'
import { AuthUser } from '@/src/types/AuthUser'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

export const loginThunk = createAsyncThunk<AuthUser, { email: string; password: string }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      return await loginUser(payload.email, payload.password)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const registerThunk = createAsyncThunk<AuthUser, { fullName: string; email: string; password: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      return await registerUser(payload.fullName, payload.email, payload.password)
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
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.loading = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => { state.loading = true })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })      

  },
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
