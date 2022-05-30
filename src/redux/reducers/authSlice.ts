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
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { accessToken, name, email } }: PayloadAction<IUser>,
    ) => {
      state.accessToken = accessToken
      state.name = name
      state.email = email
      state.isAuth = true
    },
    clearCredentials: (state) => {
      state.accessToken = null
      state.name = ''
      state.email = ''
      state.isAuth = false
    },
    setUsername: (state, { payload: username }: PayloadAction<string>) => {
      state.name = username
    },
  },
})

export const { setCredentials, clearCredentials, setUsername } =
  authSlice.actions
export default authSlice.reducer
