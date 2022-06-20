import React, { useRef } from 'react'
import { useInteraction } from '@react-three/xr'

export const Square = ({
  i,
  j,
  possible,
  moveTo,
  wColorT,
  wDisplT,
  wNormalT,
  wRoughT,
  bColorT,
  bDisplT,
  bNormalT,
  bRoughT,
  whiteColor,
  blackColor,
  ...rest
}) => {
  const squareRef = useRef(null)

  useInteraction(squareRef, 'onSelect', (e) => {
    console.log('square', e)
    return possible && moveTo([j, i])
  })

  return (
    <mesh
      name="square"
      position={[i - 3.5, 0, j - 3.5]}
      scale={[1, 0.2, 1]}
      ref={squareRef}
      onClick={() => possible && moveTo([j, i])}
      onPointerDown={() => possible && moveTo([j, i])}
    >
      <boxBufferGeometry />
      <meshStandardMaterial
        {...rest}
        {...((i + j) % 2 === 0
          ? {
              color: whiteColor,
              roughnessMap: wRoughT,
              normalMap: wNormalT,
              map: wColorT,
              bumpMap: wDisplT,
            }
          : {
              color: blackColor,
              roughnessMap: bRoughT,
              normalMap: bNormalT,
              map: bColorT,
              bumpMap: bDisplT,
            })}
      />
    </mesh>
  )
}
