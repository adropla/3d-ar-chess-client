import React from 'react'
import GameBoard from '../GameBoards2D/GameBoard/GameBoard'
import GameLobbyBoard from '../GameBoards2D/GameLobbyBoard/GameLobbyBoard'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'

const GamePage2D = ({ isLobby = true }) => {
  return (
    <>
      {isLobby ? <GameLobbyBoard /> : <GameBoard />}
      <GameOptionsContainer />
    </>
  )
}

export default GamePage2D
