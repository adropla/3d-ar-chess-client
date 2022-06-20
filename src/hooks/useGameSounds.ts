import { ChessInstance } from 'chess.js'
import { useEffect } from 'react'
import useSound from 'use-sound'

import move from '../assets/sounds/move.mp3'
import check from '../assets/sounds/check.mp3'
import mate from '../assets/sounds/mate.mp3'
import { useAppSelector } from './redux'
import { selectIsSound } from '../redux/selectors/loginModalSelectors'

export const useGameSounds = (chess: ChessInstance) => {
  const isSound = useAppSelector(selectIsSound)
  const [playMove] = useSound(move)
  const [playCheck] = useSound(check)
  const [playMate] = useSound(mate)
  useEffect(() => {
    if (isSound) {
      if (chess.in_check()) {
        playCheck()
      } else if (chess.game_over()) {
        playMate()
      } else {
        playMove()
      }
    }
  }, [chess])
}
