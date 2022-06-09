import { Suspense, useEffect, useRef, useState } from 'react'
import { ReactReduxContext } from 'react-redux'
import { Group, Vector3 } from 'three'
import { ARCanvas, useHitTest, useXR } from '@react-three/xr'
import { useContextBridge } from '@react-three/drei'
import { DefaultChessScene } from '../GameBoard3D/scene/DefaultScene'

const ARApp = () => {
  const ref = useRef<Group>(null)
  const [isPlaced, setIsPlaced] = useState(false)

  useHitTest((hitMatrix) => {
    if (!ref.current || isPlaced) {
      return
    }
    const { position, quaternion, scale } = ref.current
    // FIXME: Following comment does not work.
    hitMatrix.decompose(position, quaternion, scale)
    // hitMatrix.decompose(
    //   new Vector3(0, 0, 0),
    //   new Quaternion(0, -100, 0, 0),
    //   new Vector3(1, 1, 1),
    // )
    const { x, y, z } = position

    setIsPlaced(true)
    console.log(ref.current)
    console.log(hitMatrix)
  })

  const { isPresenting, player } = useXR()

  useEffect(() => {
    if (isPresenting) {
      player.position.x = 60
      player.position.y = 60
      player.position.z = 60
    }
  }, [isPresenting])

  return (
    <group
      ref={ref}
      scale={new Vector3(0.5, 0.5, 0.5)}
      position={new Vector3(0, -20, -10)}
    >
      <DefaultChessScene ar />
    </group>
  )
}

const GamePageAr = () => {
  const ContextBridge = useContextBridge(ReactReduxContext)

  useEffect(() => {
    console.log('ar')
  }, [])
  return (
    <ARCanvas sessionInit={{ requiredFeatures: ['hit-test'] }}>
      <ContextBridge>
        <Suspense fallback={null}>
          <ARApp />
        </Suspense>
      </ContextBridge>
    </ARCanvas>
  )
}
export default GamePageAr
