import React from 'react'
import { selectIsAuth } from '../../redux/selectors/authSelectors'
import GameBoard from '../GameBoards2D/GameBoard/GameBoard'
import GameLobbyBoard from '../GameBoards2D/GameLobbyBoard/GameLobbyBoard'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import { PlayersInfo } from '../PlayersInfo/PlayersInfo'
import { useAppSelector } from '../../hooks/redux'
import styles from './GamePage2D.module.scss'

const GamePage2D = ({ isLobby = true }) => {
  const isAuth = useAppSelector(selectIsAuth)
  return (
    <div className={styles.gamePageWrapper}>
      {isAuth && <PlayersInfo isLobby={isLobby} isMy={false} />}
      {isLobby ? <GameLobbyBoard /> : <GameBoard />}
      {isAuth && <PlayersInfo isLobby={isLobby} isMy />}
      <GameOptionsContainer mode="2d" />
    </div>
  )
}

export default GamePage2D
