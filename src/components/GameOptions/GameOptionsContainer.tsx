import { useGameOptions } from '../../hooks/useGameOptions'
import GameOptions from './GameOptions'

const GameOptionsContainer = () => {
  const {
    playViaLink,
    isGameRunning,
    navigateTo2D,
    navigateTo3D,
    navigateToAR,
  } = useGameOptions()

  return (
    <GameOptions
      playViaLink={playViaLink}
      isGameRunning={isGameRunning}
      navigateTo2D={navigateTo2D}
      navigateTo3D={navigateTo3D}
      navigateToAR={navigateToAR}
    />
  )
}

export default GameOptionsContainer
