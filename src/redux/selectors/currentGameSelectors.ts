import { RootState } from '../store'

export const selectMySide = (state: RootState) => state.currentGameSlice.mySide
export const selectRoomId = (state: RootState) => state.currentGameSlice.roomId
export const selectTimeMode = (state: RootState) =>
  state.currentGameSlice.timeMode
export const selectFen = (state: RootState) => state.currentGameSlice.fen
export const selectCurrentGame = (state: RootState) => state.currentGameSlice
export const selectOpponentId = (state: RootState) =>
  state.currentGameSlice.opponentId
