import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/src/services/authService"
import { AuthUser } from "@/src/types/AuthUser"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: true, 
  error: null,
}


export const loginThunk = createAsyncThunk<
  AuthUser,
  { email: string; password: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await loginUser(payload.email, payload.password)
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const registerThunk = createAsyncThunk<
  AuthUser,
  { fullName: string; email: string; password: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    return await registerUser(
      payload.fullName,
      payload.email,
      payload.password,
    )
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    await logoutUser()
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload
      state.loading = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => {
        state.loading = true
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerThunk.pending, state => {
        state.loading = true
      })
      .addCase(registerThunk.fulfilled, state => {
        state.loading = false
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.user = null
        state.loading = false
        state.error = null
      })
  }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
