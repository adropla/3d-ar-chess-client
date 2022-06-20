import React, { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { CubeTextureLoader } from 'three'

export const Skybox = ({ isLobby }) => {
  const { scene } = useThree()

  const path = useMemo(
    () => (isLobby ? '/textures/skybox/' : '../../textures/skybox/'),
    [isLobby],
  )

  useEffect(() => {
    scene.background = new CubeTextureLoader()
      .setPath(path)
      .load([
        'left.jpg',
        'right.jpg',
        'top.jpg',
        'bottom.jpg',
        'back.jpg',
        'front.jpg',
      ])
  }, [scene])

  return <> </>
}
