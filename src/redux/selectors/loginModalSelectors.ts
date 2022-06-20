import { RootState } from '../store'

export const selectLoginModalVisible = (state: RootState) =>
  state.loginModalSlice.visible
export const selectIsSound = (state: RootState) => state.loginModalSlice.isSound
