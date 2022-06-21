import React, { useEffect } from 'react'
import { useAppDispatch } from '../../hooks/redux'
import { clearGame } from '../../redux/reducers/currentGameSlice'
import GameBoard from '../GameBoards2D/GameBoard/GameBoard'
import GameLobbyBoard from '../GameBoards2D/GameLobbyBoard/GameLobbyBoard'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import { PlayersInfo } from '../PlayersInfo/PlayersInfo'

const GamePage2D = ({ isLobby = true }) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(clearGame())
  }, [])
  return (
    <>
      <PlayersInfo isLobby={isLobby} />
      {isLobby ? <GameLobbyBoard /> : <GameBoard />}
      <GameOptionsContainer mode="2d" />
    </>
  )
}

export default GamePage2D
