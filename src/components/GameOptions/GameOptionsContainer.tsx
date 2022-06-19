import { useGameOptions } from '../../hooks/useGameOptions'
import GameOptions from './GameOptions'

const GameOptionsContainer = () => {
  const { playViaLink, isGameRunning } = useGameOptions()

  return <GameOptions playViaLink={playViaLink} isGameRunning={isGameRunning} />
}

export default GameOptionsContainer
