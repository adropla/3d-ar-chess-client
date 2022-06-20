import React from 'react'
import { useContextBridge } from '@react-three/drei'
import { ReactReduxContext } from 'react-redux'
import { Canvas } from '@react-three/fiber'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

import { Hud } from '../GameBoard3D/hud/Hud'
import { DefaultChessScene } from '../GameBoard3D/scene/DefaultScene'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'

import { PlayersInfo } from '../PlayersInfo/PlayersInfo'
import { useAppSelector } from '../../hooks/redux'
import {
  selectGameOverData,
  selectIsWaiting,
} from '../../redux/selectors/currentGameSelectors'

import styles from './GamePage2D.module.scss'

const GamePage3D = ({ isLobby = true }) => {
  const ContextBridge = useContextBridge(ReactReduxContext)
  const handleFullScreen = useFullScreenHandle()
  const isWaiting = useAppSelector(selectIsWaiting)
  const gameIsOverData = useAppSelector(selectGameOverData)
  return (
    <>
      <div className={styles.canvasWrapper}>
        <FullScreen
          handle={handleFullScreen}
          className={styles.fullScreenCustom}
        >
          <Canvas>
            <ContextBridge>
              <DefaultChessScene isLobby={isLobby} ar={false} />
            </ContextBridge>
          </Canvas>
          <Hud handleFullScreen={handleFullScreen} />
          <PlayersInfo isLobby={isLobby} />

          <div
            className={
              isWaiting && !gameIsOverData ? styles.waiting : styles.hidden
            }
          >
            <div className={styles.waiting_inner}>
              Ожидаем подключение другого игрока...
            </div>
          </div>
          <div className={gameIsOverData ? styles.waiting : styles.hidden}>
            <div className={styles.waiting_inner}>
              {gameIsOverData?.isDraw}
              <br />
              {gameIsOverData?.winner}
            </div>
          </div>
        </FullScreen>
      </div>
      <GameOptionsContainer />
    </>
  )
}

export default GamePage3D
