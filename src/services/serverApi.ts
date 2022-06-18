import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../redux/store'

export interface IUser {
  accessToken: string | null
  email: string
  name: string
  isAuth: boolean
  userId: string
}
export interface LoginRequest {
  email: string
  password: string
}

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://nest-chess-server.herokuapp.com/'
    : 'http://localhost:5005/'

const baseServerQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as RootState).authSlice

    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`)
    }

    return headers
  },
})

export const serverApi = createApi({
  baseQuery: baseServerQuery,
  endpoints: (build) => ({
    login: build.mutation<IUser, LoginRequest>({
      query: (body) => ({
        url: 'auth/authenticate',
        method: 'post',
        body,
      }),
    }),
    signup: build.mutation({
      query: (body) => ({
        url: 'auth/registration',
        method: 'post',
        body,
      }),
    }),
    forgot: build.mutation({
      query: (body) => ({
        url: 'user/update',
        method: 'post',
        body,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'get',
      }),
    }),
    refresh: build.mutation({
      query: (body) => ({
        url: 'auth/refresh',
        method: 'post',
        body,
      }),
    }),
    changeUsername: build.mutation({
      query: (body) => ({
        url: 'user/name',
        method: 'put',
        body,
      }),
    }),
    createLinkGame: build.mutation({
      query: (body) => ({
        url: 'game/create-link-game',
        method: 'post',
        body,
      }),
    }),
    joinLinkGame: build.mutation({
      query: (body) => ({
        url: `game/${body.roomId}`,
        method: 'post',
        body,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useRefreshMutation,
  useLogoutMutation,
  useChangeUsernameMutation,
  useCreateLinkGameMutation,
  useJoinLinkGameMutation,
} = serverApi
