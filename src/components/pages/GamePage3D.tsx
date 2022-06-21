import React, { useEffect } from 'react'
import { useContextBridge } from '@react-three/drei'
import { ReactReduxContext } from 'react-redux'
import { Canvas } from '@react-three/fiber'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useParams } from 'react-router-dom'

import { Hud } from '../GameBoard3D/hud/Hud'
import { DefaultChessScene } from '../GameBoard3D/scene/DefaultScene'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'

import { PlayersInfo } from '../PlayersInfo/PlayersInfo'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import {
  selectGameOverData,
  selectIsWaiting,
} from '../../redux/selectors/currentGameSelectors'
import { useGame } from '../../hooks/useGame'

import styles from './GamePage2D.module.scss'
import { selectIsAuth } from '../../redux/selectors/authSelectors'

const GamePage3D = ({ isLobby = true }) => {
  const ContextBridge = useContextBridge(ReactReduxContext)
  const handleFullScreen = useFullScreenHandle()
  const isWaiting = useAppSelector(selectIsWaiting)
  const gameIsOverData = useAppSelector(selectGameOverData)

  const gameProps = useGame(isLobby)
  const isAuth = useAppSelector(selectIsAuth)

  return (
    <div className={styles.canvasWrapper}>
      <FullScreen handle={handleFullScreen} className={styles.fullScreenCustom}>
        <Canvas>
          <ContextBridge>
            <DefaultChessScene
              isLobby={isLobby}
              ar={false}
              gameProps={gameProps}
            />
          </ContextBridge>
        </Canvas>
        <Hud handleFullScreen={handleFullScreen} />
        {isAuth && (
          <>
            <PlayersInfo isLobby={isLobby} isMy />
            <PlayersInfo isLobby={isLobby} isMy={false} />
          </>
        )}

        <GameOptionsContainer mode="3d" />

        <div
          className={
            !isLobby && isWaiting && !gameIsOverData
              ? styles.waiting
              : styles.hidden
          }
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
          }}
        >
          <div className={styles.waiting_inner}>
            Ожидаем подключение другого игрока...
          </div>
        </div>
      </FullScreen>
    </div>
  )
}

export default GamePage3D
