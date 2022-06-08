import { useEffect } from 'react'
import GameOptionsContainer from '../GameOptions/GameOptionsContainer'
import { init, animate } from '../../chess/ThreeInitAR'

const GamePageAr = () => {
  useEffect(() => {
    init()
    animate()
    return () => {
      const arScript = document.querySelector('#ARButton')
      arScript.remove()
    }
  }, [])
  return <> </>
}
export default GamePageAr
