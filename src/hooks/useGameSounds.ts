import { ChessInstance } from 'chess.js'
import { useEffect } from 'react'

export const useGameSounds = (chess: ChessInstance) => {
  useEffect(() => {
    if (chess.in_check()) {
      // Play audio
      console.log('play check')
    } else {
      console.log('play move')
    }
  }, [chess])
}
