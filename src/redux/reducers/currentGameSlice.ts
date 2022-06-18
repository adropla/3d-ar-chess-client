/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ICurrentGame = {
  mySide: 'w' | 'b' | null
  roomId: string | null
  timeMode: '1' | '1|1' | '2|1' | '3' | '3|2' | '5' | '10' | '30' | null
  opponentId: string | null
  fen: string[]
}

const initialState: ICurrentGame = {
  mySide: null,
  roomId: null,
  timeMode: null,
  opponentId: null,
  fen: [],
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
    },
    addMove: (state, { payload }: PayloadAction<string>) => {
      state.fen.push(payload)
    },
    loadFen: (state, { payload }: PayloadAction<string[]>) => {
      state.fen = payload
    },
  },
})

export const { setGame, clearGame, addMove, loadFen } = currentGameSlice.actions
export default currentGameSlice.reducer
