import { useCallback, useEffect, useMemo } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  generatePath,
} from 'react-router-dom'
import {
  useCreateLinkGameMutation,
  useGameIsOverMutation,
  useJoinLinkGameMutation,
} from '../services/serverApi'
import { useAppDispatch, useAppSelector } from './redux'
import { selectUserId } from '../redux/selectors/authSelectors'
import {
  clearGame,
  setDidRejoin,
  setGame,
} from '../redux/reducers/currentGameSlice'
import { socket } from '../Socket/WebSocket'

export const useGameOptions = () => {
  const navigate = useNavigate()
  const { roomIdParam } = useParams()

  const isGameRunning = useMemo(() => !!roomIdParam, [roomIdParam])

  const userIdFromStore = useAppSelector(selectUserId)

  const dispatch = useAppDispatch()
  const [createLinkGameTrigger, createLinkGameResult] =
    useCreateLinkGameMutation()
  const [joinLinkGameTrigger, joinLinkGameResult] = useJoinLinkGameMutation()
  const [gameIsOverTrigger, gameIsOverResult] = useGameIsOverMutation()

  const gameOptions = useMemo(
    () => ({
      timeMode: '5',
      userId: userIdFromStore,
    }),
    [userIdFromStore],
  )

  const playViaLink = useCallback(() => {
    createLinkGameTrigger(gameOptions)
    dispatch(clearGame())
  }, [createLinkGameTrigger, gameOptions, dispatch])

  useEffect(() => {
    if (createLinkGameResult.error) {
      console.error(createLinkGameResult.data)
    } else if (createLinkGameResult.isSuccess) {
      dispatch(clearGame())
      const { url, roomId } = createLinkGameResult.data
      navigate(`game/${url}`)
      gameIsOverTrigger(roomId)
    }
  }, [createLinkGameResult])

  useEffect(() => {
    if (roomIdParam && userIdFromStore) {
      dispatch(clearGame())
      joinLinkGameTrigger({ roomId: roomIdParam, userId: userIdFromStore })
    }
  }, [roomIdParam, userIdFromStore, joinLinkGameTrigger, dispatch])

  useEffect(() => {
    if (joinLinkGameResult.isSuccess) {
      const { roomId, side, timeMode, fen, opponentId } =
        joinLinkGameResult.data
      dispatch(
        setGame({
          mySide: side,
          roomId,
          timeMode,
          fen,
          opponentId,
        }),
      )
      if (fen.length > 0) {
        dispatch(setDidRejoin(true))
      }
      joinLinkGameResult.reset()
      socket.emit('joinRoom', { roomId, userId: userIdFromStore })
    }
    if (gameIsOverResult.isSuccess) {
      console.log(gameIsOverResult.data)
    }
    gameIsOverResult.reset()
  }, [joinLinkGameResult, userIdFromStore, roomIdParam, gameIsOverResult])

  return {
    playViaLink,
    isGameRunning,
  }
}
