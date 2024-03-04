import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({email, password}) => ({
        url: "auth/login",
        method: "POST",
        body: {email, password},
      }),
      invalidatesTags: ['Auth']
    }),
  })
})

export const { useLoginMutation } = authApi