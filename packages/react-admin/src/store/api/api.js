import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_BACKEND_SERVER}/`,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = getState().auth.token
    if (token) {
      headers.set('Authorization', token)
    }
    return headers
  },
})

export const api = createApi({
  reducerPath: 'scheduleManagerApi',
  baseQuery,
  tagTypes: ['Auth', 'Users'],
  endpoints: () => ({}),
})
