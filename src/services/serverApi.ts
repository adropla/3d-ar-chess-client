import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '../redux/store'
// eslint-disable-next-line import/no-cycle
import {
  clearCredentials,
  updateAccessToken,
} from '../redux/reducers/authSlice'

export interface IUser {
  accessToken: string | null
  email: string
  name: string
  isAuth: boolean
  userId: string
  rating: number
  games: string[]
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

const baseServerQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseServerQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseServerQuery(
      { url: 'auth/refresh', method: 'post' },
      api,
      extraOptions,
    )

    const data = refreshResult.data as { accessToken: string }

    // console.log(refreshResult)

    if (refreshResult.data) {
      api.dispatch(updateAccessToken(data.accessToken))

      // retry the initial query
      result = await baseServerQuery(args, api, extraOptions)
    } else {
      api.dispatch(clearCredentials())
    }
  }
  return result
}

export const serverApi = createApi({
  baseQuery: baseServerQueryWithReauth,
  endpoints: (build) => ({
    login: build.mutation<IUser, LoginRequest>({
      query: (body) => ({
        url: 'auth/login',
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
        method: 'post',
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
        url: 'users/changeUsername',
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
    getUserData: build.mutation({
      query: (userId?: string) => ({
        url: `users/info${userId && `/${userId}`}`,
        method: 'post',
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
  useGetUserDataMutation,
} = serverApi
