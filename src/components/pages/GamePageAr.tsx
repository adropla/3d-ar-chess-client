import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ReactReduxContext } from 'react-redux'
import {
  ARCanvas,
  useHitTest,
  Interactive,
  useInteraction,
} from '@react-three/xr'
import { Group, Quaternion, Scene, Vector3 } from 'three'
import {
  useGLTF,
  Box,
  useContextBridge,
  OrbitControls,
} from '@react-three/drei'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import { ArFuncContext } from '../contexts/context'
import { DefaultChessScene } from '../GameBoard3D/scene/DefaultScene'

const ARApp = () => {
  const ref = useRef<Group>(null)
  const nodes = useGLTF('/models/bishop.glb')
  const [isPlaced, setIsPlaced] = useState(false)
  const [placement, setPlacement] = useState<Vector3>()
  const ArContext = useContext(ArFuncContext)

  useHitTest((hitMatrix) => {
    if (!ref.current || isPlaced) {
      return
    }
    const { position, quaternion, scale } = ref.current
    // FIXME: Following comment does not work.
    hitMatrix.decompose(position, quaternion, new Vector3(1, 1, 1))
    // hitMatrix.decompose(
    //   new Vector3(0, 0, 0),
    //   new Quaternion(0, -100, 0, 0),
    //   new Vector3(1, 1, 1),
    // )
    const { x, y, z } = position

    setPlacement(position)
    setIsPlaced(true)
    console.log(ref.current)
    console.log(hitMatrix)
  })

  useInteraction(ref, 'onSelect', (e) => {
    console.log(e)
    console.log(ArContext)
    const eventObjectUuid = e.intersection?.object.uuid || ''
    if (ref.current) {
      const object = ref.current.getObjectByProperty('uuid', eventObjectUuid)
      ArContext.ref = object
    }
  })

  return (
    <group ref={ref} scale={new Vector3(0.1, 0.1, 0.1)}>
      {/* <group ref={ref}> */}
      <DefaultChessScene ar />
      {/* <OrbitControls maxDistance={50} minDistance={1} /> */}
    </group>
  )
  // return <Box ref={ref} args={[0.1, 0.1, 0.1]} />

  // return (
  //   <mesh
  //     ref={ref}
  //     geometry={nodes.chessKitExport.geometry}
  //     dispose={null}
  //     scale={0.1}
  //   />
  // )
}

const GamePageAr = () => {
  const ContextBridge = useContextBridge(ReactReduxContext, ArFuncContext)

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
