/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Modal = {
  visible: boolean
  isSound: boolean
}

const initialState: Modal = {
  visible: false,
  isSound: true,
}

const loginModalSlice = createSlice({
  name: 'loginModalSlice',
  initialState,
  reducers: {
    toogleLoginModalVisible: (state) => {
      state.visible = !state.visible
    },
    setIsSoundStore: (state, { payload }: PayloadAction<boolean>) => {
      state.isSound = payload
    },
  },
})

export const { toogleLoginModalVisible, setIsSoundStore } =
  loginModalSlice.actions
export default loginModalSlice.reducer
