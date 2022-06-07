/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react'

// Three
import { Vector3 } from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from 'react-three-fiber'

// Constants
import pieceTypeToFile from '../../../constants/pieceModelsTypes.json'

const modelRoot = '/models/'

const pieceScale = [0.2, 0.2, 0.2]
const pieceWhiteRotation = [Math.PI / 2, 0, -Math.PI / 2]
const pieceBlackRotation = [Math.PI / 2, 0, Math.PI / 2]
const pieceWhiteColor = 'rgb(242, 250, 209)'
const pieceBlackColor = 'rgb(102, 101, 101)'

/**
 * Piece Component.
 * @param {string} type piece type.
 * @param {[number, number]} position piece position.
 * @param {string} color piece color.
 * @param {function} onSelect on piece select callback.
 */
export const Piece = ({ type, position, color, onSelect }) => {
  const { nodes } = useGLTF(modelRoot + pieceTypeToFile[type])

  const pieceRef = useRef(null)
  const targetPositionRef = useRef(null)
  const isLerpingRef = useRef(null)
  const isFirstRender = useRef(true)

  const isWhitePiece = color === 'w'

  // console.log(type, color, position)

  // Fist render.
  useEffect(() => {
    if (isFirstRender.current) {
      pieceRef.current.position.set(position[2], position[1], position[0])
      isFirstRender.current = false
    }
  }, [isFirstRender, position])

  // Lerp position.
  useEffect(() => {
    if (!isFirstRender.current) {
      targetPositionRef.current = position
      isLerpingRef.current = true
    }
  }, [position, targetPositionRef])

  // Actual Lerp.
  useFrame(() => {
    if (isLerpingRef.current && pieceRef.current) {
      const currentPos = pieceRef.current.position

      const targetPos = new Vector3(
        targetPositionRef.current[2],
        targetPositionRef.current[1],
        targetPositionRef.current[0],
      )

      if (targetPos.clone().sub(currentPos).length() <= 0.01) {
        pieceRef.current.position.set(targetPos.x, targetPos.y, targetPos.z)
        isLerpingRef.current = false
      } else {
        const stepPosition = currentPos.clone().lerp(targetPos, 0.05)
        pieceRef.current.position.set(
          stepPosition.x,
          stepPosition.y,
          stepPosition.z,
        )
      }
    }
  })

  // Activate shadows.
  useEffect(() => {
    if (nodes?.chessKitExport) {
      nodes.chessKitExport.traverse((node) => {
        if (node.isObject3D) {
          node.castShadow = true
          node.receiveShadow = true
        }
      })
    }
  }, [nodes])

  return (
    <mesh
      ref={pieceRef}
      onClick={() => {
        onSelect({ ref: pieceRef, position })
      }}
      geometry={nodes.chessKitExport.geometry}
      scale={pieceScale}
      rotation={isWhitePiece ? pieceWhiteRotation : pieceBlackRotation}
      castShadow
      receiveShadow
      onPointerUp={() => {
        onSelect({ ref: pieceRef, position })
      }}
    >
      <meshStandardMaterial
        color={isWhitePiece ? pieceWhiteColor : pieceBlackColor}
        metalness={0}
        roughness={0}
      />
    </mesh>
  )
}
