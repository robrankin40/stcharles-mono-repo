import { api } from "./api";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query({
      query: () => "users/",
      transformResponse: (response, meta, args) => response.users,
      providesTags: (result) => {
        return [
          ...(result ?? []).map(({ _id }) => ({ type: 'Users', id: _id })),
          { type: 'Users', id: 'LIST' },
        ]
      },
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "users/",
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result) => [{ type: 'Users', id: result.userId }],
    }),
  })
})

export const { useListUsersQuery, useFetchUserQuery, useCreateUserMutation, useDeleteUserMutation } = usersApi;