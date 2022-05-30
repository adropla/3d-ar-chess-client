import React from 'react'
import GameBoard from '../GameBoard/GameBoard'
import GameLobbyBoard from '../GameLobbyBoard/GameLobbyBoard'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'

const GamePage = ({ type }: { type: 'lobby' | 'game' }) => {
  return (
    <>
      {type === 'lobby' ? <GameLobbyBoard /> : <GameBoard />}
      <GameOptionsContainer />
    </>
  )
}

export default GamePage
