/* eslint-disable no-plusplus */
import { Suspense, useEffect, useRef, useState } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Group, sRGBEncoding } from 'three'
import { ARCanvas, useHitTest } from '@react-three/xr'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useContextBridge, useAspect } from '@react-three/drei'

import { DefaultChessScene } from '../GameBoard3D/scene/DefaultScene'

import { useGame } from '../../hooks/useGame'
import { PlayersInfo } from '../PlayersInfo/PlayersInfo'

import styles from './GamePage2D.module.scss'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import { useAppSelector } from '../../hooks/redux'
import {
  selectGameOverData,
  selectIsWaiting,
} from '../../redux/selectors/currentGameSelectors'
import { selectIsAuth } from '../../redux/selectors/authSelectors'

const ARApp = ({
  isLobby,
  gameProps,
}: {
  isLobby: boolean
  gameProps: any
}) => {
  const ref = useRef<Group>(null)
  const [isPlaced, setIsPlaced] = useState(false)

  useHitTest((hitMatrix) => {
    if (!ref.current || isPlaced) {
      return
    }

    const { position, quaternion, scale } = ref.current
    hitMatrix.decompose(position, quaternion, scale)
    const { x, y, z } = position

    setIsPlaced(true)
    // console.log(ref.current)
    // console.log(hitMatrix)
  })

  return (
    <group ref={ref}>
      <OrbitControls />
      <DefaultChessScene isLobby={isLobby} ar gameProps={gameProps} />
    </group>
  )
}

// extend({ TextGeometry })
// const Text3d = () => {
//   const font = new FontLoader().parse(myFont)
//   const textOptions = {
//     font,
//     size: 5,
//     height: 1,
//   }
//   return (
//     <mesh>
//       <textGeometry attach="geometry" args={['three.js', textOptions]} />
//       <meshStandardMaterial attach="material" color="hotpink" />
//     </mesh>
//   )
// }

const isXrSupport = async () => {
  let isSupported = false
  if (navigator.xr) {
    isSupported = await navigator.xr.isSessionSupported('immersive-vr')
  }
  return isSupported
}

const GamePageAr = ({ isLobby }: { isLobby: boolean }) => {
  const ContextBridge = useContextBridge(ReactReduxContext)
  const isWaiting = useAppSelector(selectIsWaiting)
  const gameIsOverData = useAppSelector(selectGameOverData)
  const [arSupport, setArSupport] = useState(false)
  const isAuth = useAppSelector(selectIsAuth)

  useEffect(() => {
    ;(async () => {
      setArSupport(await isXrSupport())
    })()
  }, [])

  const gameProps = useGame(isLobby)

  return (
    <div className={styles.arWrapper}>
      {arSupport && (
        <>
          <ARCanvas sessionInit={{ requiredFeatures: ['hit-test'] }}>
            <ContextBridge>
              <Suspense fallback={null}>
                <ARApp isLobby={isLobby} gameProps={gameProps} />
              </Suspense>
            </ContextBridge>
          </ARCanvas>
          {isAuth && (
            <>
              <PlayersInfo isLobby={isLobby} isMy />
              <PlayersInfo isLobby={isLobby} isMy={false} />
            </>
          )}
          <GameOptionsContainer mode="ar" />
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
        </>
      )}
      <div
        className={!arSupport ? styles.waiting : styles.hidden}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0',
        }}
      >
        <div className={styles.waiting_inner}>
          Дополненная реальность не поддерживается на вашем устройстве
        </div>
      </div>
    </div>
  )
}
export default GamePageAr
