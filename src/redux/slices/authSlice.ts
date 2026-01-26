import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  user: null | {
    uid: string
    email: string | null
    name?: string | null
  }
  isAuthenticated: boolean
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false, // important for auth bootstrapping
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    setAuthLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setUser, clearUser, setAuthLoading } = authSlice.actions
export default authSlice.reducer
