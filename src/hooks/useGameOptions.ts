import { useCallback, useEffect, useMemo } from 'react'
import { notification } from 'antd'
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
  setGameOverData,
  setIsWaitingStore,
} from '../redux/reducers/currentGameSlice'
import { socket } from '../Socket/WebSocket'

const openNotification = (roomId: string) => {
  const args = {
    message: 'Поделитесь ссылкой',
    description: `https://3d-ar-chess-client.vercel.app/game/${roomId}`,
    duration: 0,
    key: 'notif',
  }
  notification.open(args)
}

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
      openNotification(roomId)
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
      console.log(fen)
      if (fen.length > 0) {
        dispatch(setDidRejoin(true))
      }
      joinLinkGameResult.reset()

      socket.emit('joinRoom', { roomId, userId: userIdFromStore })
    }

    if (gameIsOverResult.isSuccess) {
      const { data } = gameIsOverResult
      if (data !== false) {
        dispatch(setIsWaitingStore(false))
      }
      dispatch(setGameOverData(data))
    }
    gameIsOverResult.reset()
  }, [joinLinkGameResult, userIdFromStore, roomIdParam, gameIsOverResult])

  return {
    playViaLink,
    isGameRunning,
  }
}
