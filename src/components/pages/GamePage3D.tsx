import React from 'react'
import { useContextBridge } from '@react-three/drei'
import { ReactReduxContext } from 'react-redux'
import { Canvas } from 'react-three-fiber'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

import { Hud } from '../GameBoard3D/hud/Hud'
import { DefaultChessScene } from '../GameBoard3D/scene/DefaultScene'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'

import styles from './GamePage2D.module.scss'

const GamePage3D = ({ isLobby = true }) => {
  const ContextBridge = useContextBridge(ReactReduxContext)
  const handleFullScreen = useFullScreenHandle()
  return (
    <>
      <div className={styles.canvasWrapper}>
        <FullScreen handle={handleFullScreen}>
          <Canvas shadowMap>
            <ContextBridge>
              <DefaultChessScene isLobby={isLobby} />
            </ContextBridge>
          </Canvas>
          <Hud handleFullScreen={handleFullScreen} />
        </FullScreen>
      </div>
      <GameOptionsContainer />
    </>
  )
}

export default GamePage3D
