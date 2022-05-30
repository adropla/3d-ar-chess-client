import React, { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useCreateLinkGameMutation,
  useJoinLinkGameMutation,
} from '../../services/serverApi'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { selectUserId } from '../../redux/selectors/authSelectors'
import { setGame } from '../../redux/reducers/currentGameSlice'
import GameOptions from './GameOptions'
import { socket } from '../../Socket/WebSocket'

const GameOptionsContainer = () => {
  const navigate = useNavigate()
  const { roomIdParam } = useParams()

  const isGameRunning = useMemo(() => !!roomIdParam, [roomIdParam])

  const userIdFromStore = useAppSelector(selectUserId)

  const dispatch = useAppDispatch()
  const [createLinkGameTrigger, createLinkGameResult] =
    useCreateLinkGameMutation()
  const [joinLinkGameTrigger, joinLinkGameResult] = useJoinLinkGameMutation()

  const gameOptions = useMemo(
    () => ({
      timeMode: '5',
      userId: userIdFromStore,
    }),
    [userIdFromStore],
  )

  const playViaLink = useCallback(() => {
    createLinkGameTrigger(gameOptions)
  }, [createLinkGameTrigger, gameOptions])

  useEffect(() => {
    if (createLinkGameResult.error) {
      console.error(createLinkGameResult.data)
    } else if (createLinkGameResult.isSuccess) {
      const { url } = createLinkGameResult.data
      console.log(url)
      navigate(url)
    }
  }, [createLinkGameResult])

  useEffect(() => {
    if (roomIdParam && userIdFromStore) {
      joinLinkGameTrigger({ roomId: roomIdParam, userId: userIdFromStore })
    }
  }, [roomIdParam, userIdFromStore, joinLinkGameTrigger])

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
      socket.emit('joinRoom', { roomId, userId: userIdFromStore })
    }
  }, [joinLinkGameResult, userIdFromStore])

  return <GameOptions playViaLink={playViaLink} isGameRunning={isGameRunning} />
}

export default GameOptionsContainer
