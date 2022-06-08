import { Suspense, useEffect, useRef } from 'react'
import { ARCanvas, useHitTest } from '@react-three/xr'
import { Mesh, Vector3 } from 'three'
import { useGLTF } from '@react-three/drei'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'

const ARApp = () => {
  const ref = useRef < Mesh > null
  const { nodes } = useGLTF('/models/bishop.glb')

  useHitTest((hitMatrix) => {
    if (!ref.current) {
      return
    }
    const { position, quaternion, scale } = ref.current
    // FIXME: Following comment does not work.
    // hitMatrix.decompose(position, quaternion, scale);
    hitMatrix.decompose(position, quaternion, new Vector3(0.1, 0.1, 0.1))
  })

  return <primitive ref={ref} object={nodes} dispose={null} scale={0.1} />
}

const GamePageAr = () => {
  useEffect(() => {
    console.log('ar')
  }, [])
  return (
    <ARCanvas sessionInit={{ requiredFeatures: ['hit-test'] }}>
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <ARApp />
      </Suspense>
    </ARCanvas>
  )
}
export default GamePageAr
