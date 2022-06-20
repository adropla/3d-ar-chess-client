import React from 'react'
import GameBoard from '../GameBoards2D/GameBoard/GameBoard'
import GameLobbyBoard from '../GameBoards2D/GameLobbyBoard/GameLobbyBoard'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import { PlayersInfo } from '../PlayersInfo/PlayersInfo'

const GamePage2D = ({ isLobby = true }) => {
  return (
    <>
      <PlayersInfo isLobby={isLobby} />
      {isLobby ? <GameLobbyBoard /> : <GameBoard />}
      <GameOptionsContainer />
    </>
  )
}

export default GamePage2D
