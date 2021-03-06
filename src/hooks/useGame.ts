import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Chess, ChessInstance, Square } from 'chess.js'

import { useAppDispatch, useAppSelector } from './redux'
import { selectUserId } from '../redux/selectors/authSelectors'
import {
  selectFen,
  selectMySide,
} from '../redux/selectors/currentGameSelectors'
import { addMove, clearGame } from '../redux/reducers/currentGameSlice'

import { socket } from '../Socket/WebSocket'
import { useGameSounds } from './useGameSounds'

export const useGame = (isLobby: boolean) => {
  // #region hook State
  const { roomIdParam } = useParams()
  const userIdFromStore = useAppSelector(selectUserId)
  const mySideFromStore = useAppSelector(selectMySide)
  const fenFromStore = useAppSelector(selectFen)
  const dispatch = useAppDispatch()

  const [game, setGame] = useState(
    new Chess(fenFromStore[fenFromStore.length - 1]),
  )
  const [currentTurn, setCurrentTurn] = useState<'w' | 'b'>()
  const [isWaiting, setIsWaiting] = useState(true)

  const currentGameFen = useMemo(() => game.fen(), [game])
  const isMatchOver = useMemo(() => game.game_over(), [game])
  // #endregion

  // #region methods
  const safeGameMutate = (modify: (gameInst: ChessInstance) => void) => {
    setGame((g) => {
      const update = { ...g }
      modify(update)
      return update
    })
  }

  const getPossibleMoves = useCallback(
    (square: Square) => {
      const moves = game.moves({
        square,
        verbose: true,
      })
      return moves
    },
    [game],
  )
  // #endregion

  // #region custom hooks
  useGameSounds(game)
  // #endregion

  // #region useEffects
  useEffect(() => {
    setCurrentTurn(game.turn())
  }, [game])

  useEffect(() => {
    if (!isLobby && currentGameFen !== fenFromStore[fenFromStore.length - 1]) {
      dispatch(addMove(currentGameFen))
    }
  }, [currentGameFen, fenFromStore, dispatch, isLobby])

  useEffect(() => {
    if (
      !isLobby &&
      roomIdParam &&
      userIdFromStore &&
      currentTurn &&
      currentTurn === mySideFromStore &&
      !isWaiting &&
      currentGameFen !== fenFromStore[fenFromStore.length - 1]
    ) {
      const obj = {
        roomId: roomIdParam,
        userId: userIdFromStore,
        message: Object.values(currentGameFen).join(''),
        messageTurn: currentTurn,
      }
      console.log('%c=====EMIT_NEW_MOVE=====', 'color: yellow')
      console.log(obj)
      console.log('%c=======================', 'color: yellow')
      socket.emit('newMove', obj)
    }
  }, [
    currentGameFen,
    roomIdParam,
    userIdFromStore,
    mySideFromStore,
    currentTurn,
    isWaiting,
    fenFromStore,
    isLobby,
  ])

  useEffect(() => {
    if (!isLobby) {
      socket.on('opponent move', (room: any) => {
        const { userId, message, messageTurn } = room
        console.log('%c=====ON OPPONENT MOVE=====', 'color: orange')
        console.log('%cuser id from socket', 'color: orange', userId)
        console.log('%cmy user id', 'color: orange', userIdFromStore)
        console.log('%cturn', 'color: orange', messageTurn)
        console.log('%cmy side', 'color: orange', mySideFromStore)
        console.log('%c==========================', 'color: orange')
        if (userIdFromStore !== userId && messageTurn !== mySideFromStore) {
          const msgFen = Object.values(message).join('')
          safeGameMutate((gameInst: ChessInstance) => {
            gameInst.load(msgFen)
          })
        }
      })
    }
  }, [mySideFromStore, userIdFromStore, isLobby])

  useEffect(() => {
    if (!isLobby) {
      socket.on('gameStart', () => {
        setIsWaiting(false)
      })
    }
  }, [isLobby])
  // #endregion

  // #region memos
  const boardOrientation = useMemo(
    () => (mySideFromStore === 'b' ? 'black' : 'white'),
    [mySideFromStore],
  )
  // #endregion

  return {
    boardOrientation,
    getPossibleMoves,
    currentGameFen,
    currentTurn,
    isWaiting,
    game,
    isMatchOver,
    mySideFromStore,
    setGame,
  }
}
