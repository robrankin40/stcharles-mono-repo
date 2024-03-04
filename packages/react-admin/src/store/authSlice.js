import { createSlice } from '@reduxjs/toolkit'
import { authApi } from './api/authApi';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (_, action) => {
        
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = {
          email: action.payload.data.email,
          firstName: action.payload.data.firstName,
          lastName: action.payload.data.lastName,
        }
        state.isAuthenticated = true
        state.token = action.payload.data.token
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (_, action) => initialState)
  },
})

export const { logout } = slice.actions
export default slice.reducer

export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated