import React from 'react'
import GameBoard from '../GameBoards2D/GameBoard/GameBoard'
import GameLobbyBoard from '../GameBoards2D/GameLobbyBoard/GameLobbyBoard'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import { PlayersInfo } from '../PlayersInfo/PlayersInfo'

import styles from './GamePage2D.module.scss'

const GamePage2D = ({ isLobby = true }) => {
  return (
    <div className={styles.gamePageWrapper}>
      <PlayersInfo isLobby={isLobby} isMy={false} />
      {isLobby ? <GameLobbyBoard /> : <GameBoard />}
      <PlayersInfo isLobby={isLobby} isMy />
      <GameOptionsContainer mode="2d" />
    </div>
  )
}

export default GamePage2D
