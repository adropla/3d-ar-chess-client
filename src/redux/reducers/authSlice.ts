/* eslint-disable no-param-reassign */
import { v4 as uuidv4 } from 'uuid'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../services/serverApi'

const uuid = uuidv4()

const initialState: IUser = {
  accessToken: null,
  name: '',
  email: '',
  isAuth: false,
  userId: uuid,
  rating: 0,
  games: [],
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { accessToken, email } }: PayloadAction<IUser>,
    ) => {
      state.accessToken = accessToken
      state.email = email
      state.isAuth = true
    },
    clearCredentials: (state) => {
      state.accessToken = null
      state.name = ''
      state.email = ''
      state.rating = 0
      state.isAuth = false
    },
    setUsername: (state, { payload: username }: PayloadAction<string>) => {
      state.name = username
    },
    setUserInfo: (
      state,
      { payload: { name, rating, games, userId } }: PayloadAction<IUser>,
    ) => {
      state.name = name
      state.rating = rating
      state.games = games
      state.userId = userId
    },
    updateAccessToken: (
      state,
      { payload: accessToken }: PayloadAction<string>,
    ) => {
      state.accessToken = accessToken
    },
  },
})

export const {
  setCredentials,
  clearCredentials,
  setUsername,
  setUserInfo,
  updateAccessToken,
} = authSlice.actions
export default authSlice.reducer
