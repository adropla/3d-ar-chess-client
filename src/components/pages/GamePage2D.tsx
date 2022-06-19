import React from 'react'
import GameBoard from '../GameBoards2D/GameBoard/GameBoard'
import GameLobbyBoard from '../GameBoards2D/GameLobbyBoard/GameLobbyBoard'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'

import styles from './GamePage2D.module.scss'

const GamePage2D = ({ isLobby = true }) => {
  return (
    <div className={styles.pageWrapper}>
      {isLobby ? <GameLobbyBoard /> : <GameBoard />}
      <GameOptionsContainer />
    </div>
  )
}

export default GamePage2D
