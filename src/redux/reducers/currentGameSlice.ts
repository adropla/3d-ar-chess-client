/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ICurrentGame = {
  mySide: 'w' | 'b' | null
  roomId: string | null
  timeMode: '1' | '1|1' | '2|1' | '3' | '3|2' | '5' | '10' | '30' | null
  opponentId: string | null
  fen: string[]
  isWaiting?: boolean
  gameOverData?: any
}

const initialState: ICurrentGame = {
  mySide: null,
  roomId: null,
  timeMode: null,
  opponentId: null,
  fen: [],
  isWaiting: true,
  gameOverData: null,
}

const currentGameSlice = createSlice({
  name: 'currentGameSlice',
  initialState,
  reducers: {
    setGame: (state, { payload }: PayloadAction<ICurrentGame>) => {
      state.mySide = payload.mySide
      state.roomId = payload.roomId
      state.timeMode = payload.timeMode
      state.opponentId = payload.opponentId
      state.fen = payload.fen
    },
    clearGame: (state) => {
      state.mySide = null
      state.roomId = null
      state.timeMode = null
      state.opponentId = null
      state.fen = []
      state.isWaiting = true
      state.gameOverData = null
    },
    addMove: (state, { payload }: PayloadAction<string>) => {
      state.fen.push(payload)
    },
    loadFen: (state, { payload }: PayloadAction<string[]>) => {
      state.fen = payload
    },
    setIsWaitingStore: (state, { payload }: PayloadAction<boolean>) => {
      state.isWaiting = payload
    },
    setGameOverData: (state, { payload }: PayloadAction<any>) => {
      state.gameOverData = payload
    },
  },
})

export const {
  setGame,
  clearGame,
  addMove,
  loadFen,
  setIsWaitingStore,
  setGameOverData,
} = currentGameSlice.actions
export default currentGameSlice.reducer
