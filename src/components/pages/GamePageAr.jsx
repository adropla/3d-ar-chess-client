import { useEffect } from 'react'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import { init, animate } from '../../chess/ThreeInitAR'

export const GamePageAr = () => {
  useEffect(() => {
    init()
    animate()
  }, [])
  return <> </>
}
