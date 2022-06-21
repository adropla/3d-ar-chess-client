/* eslint-disable no-plusplus */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Group, Vector3 } from 'three'
import { ARCanvas, useHitTest, useXR } from '@react-three/xr'
import {
  OrbitControls,
  useContextBridge,
  TransformControls,
} from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { LoadingOutlined } from '@ant-design/icons'
import { DefaultChessScene } from '../GameBoard3D/scene/DefaultScene'
import { useAppDispatch } from '../../hooks/redux'
import { clearGame } from '../../redux/reducers/currentGameSlice'
import { useGame } from '../../hooks/useGame'
import { PlayersInfo } from '../PlayersInfo/PlayersInfo'

import styles from './GamePage2D.module.scss'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import myFont from '../../assets/comic.ttf'

const ARApp = ({ isLobby }: { isLobby: boolean }) => {
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

  const gameProps = useGame(isLobby)

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

const GamePageAr = ({ isLobby }: { isLobby: boolean }) => {
  const ContextBridge = useContextBridge(ReactReduxContext)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearGame())
  }, [])

  return (
    <div className={styles.arWrapper}>
      <ARCanvas sessionInit={{ requiredFeatures: ['hit-test'] }}>
        <ContextBridge>
          <Suspense fallback={<LoadingOutlined style={{ fontSize: '30px' }} />}>
            <ARApp isLobby={isLobby} />
          </Suspense>
        </ContextBridge>
      </ARCanvas>
      <PlayersInfo isLobby={isLobby} />
      <GameOptionsContainer mode="3d" />
    </div>
  )
}
export default GamePageAr
