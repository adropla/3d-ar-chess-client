/* eslint-disable no-plusplus */
import { Suspense, useEffect, useRef, useState } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Group, Vector3 } from 'three'
import { ARCanvas, useHitTest, useXR } from '@react-three/xr'
import {
  OrbitControls,
  useContextBridge,
  PerspectiveCamera,
  TransformControls,
} from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { LoadingOutlined } from '@ant-design/icons'
import { DefaultChessScene } from '../GameBoard3D/scene/DefaultScene'
import { useAppDispatch } from '../../hooks/redux'
import { clearGame } from '../../redux/reducers/currentGameSlice'
import { useGame } from '../../hooks/useGame'
import { PlayersInfo } from '../PlayersInfo/PlayersInfo'

import styles from './GamePage2D.module.scss'
/*
let tpCache: string | any[] = []

function handlePinchZoom(ev) {
  if (ev.targetTouches.length === 2 && ev.changedTouches.length === 2) {
    // Check if the two target touches are the same ones that started
    // the 2-touch
    let point1 = -1
    let point2 = -1
    for (let i = 0; i < tpCache.length; i++) {
      if (tpCache[i].identifier === ev.targetTouches[0].identifier) point1 = i
      if (tpCache[i].identifier === ev.targetTouches[1].identifier) point2 = i
    }
    if (point1 >= 0 && point2 >= 0) {
      // Calculate the difference between the start and move coordinates
      const diff1 = Math.abs(
        tpCache[point1].clientX - ev.targetTouches[0].clientX,
      )
      const diff2 = Math.abs(
        tpCache[point2].clientX - ev.targetTouches[1].clientX,
      )

      // This threshold is device dependent as well as application specific
      const PINCH_THRESHOLD = ev.target.clientWidth / 10
      if (diff1 >= PINCH_THRESHOLD && diff2 >= PINCH_THRESHOLD)
        ev.target.style.background = 'green'
    } else {
      // empty tpCache
      tpCache = []
    }
  }
}

function moveHandler(ev) {
  // Note: if the user makes more than one "simultaneous" touches, most browsers
  // fire at least one touchmove event and some will fire several touchmoves.
  // Consequently, an application might want to "ignore" some touchmoves.
  //
  // This function sets the target element's border to "dashed" to visually
  // indicate the target received a move event.
  //
  ev.preventDefault()
  console.log('touchMove', ev, false)
  // To avoid too much color flashing many touchmove events are started,
  // don't update the background if two touch points are active
  handlePinchZoom(ev)

  // // Set the target element's border to dashed to give a clear visual
  // // indication the element received a move event.
  // ev.target.style.border = 'dashed'

  // // Check this event for 2-touch Move/Pinch/Zoom gesture
}
*/

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
    console.log(ref.current)
    console.log(hitMatrix)
  })

  const gameProps = useGame(isLobby)

  return (
    <group ref={ref}>
      <OrbitControls />
      <DefaultChessScene isLobby={isLobby} ar gameProps={gameProps} />
    </group>
  )
}

const GamePageAr = ({ isLobby }: { isLobby: boolean }) => {
  const ContextBridge = useContextBridge(ReactReduxContext)
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log('ar')
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
    </div>
  )
}
export default GamePageAr
