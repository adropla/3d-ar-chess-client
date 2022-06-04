import { CSSProperties, useRef, useState } from 'react'
import { Chess, Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'

import { useBoardWidth } from '../../hooks/useBoardWidth'

import styles from './GameLobbyBoard.module.scss'

const GameLobbyBoard = () => {
  const [game, setGame] = useState(new Chess())

  const [moveFrom, setMoveFrom] = useState<Square>()

  const [rightClickedSquares, setRightClickedSquares] = useState<{
    [key in Square]: CSSProperties
  }>()
  const [optionSquares, setOptionSquares] = useState<{
    [key in Square]: CSSProperties
  }>()

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const { boardWidth } = useBoardWidth(wrapperRef)

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    })
    if (moves.length === 0) {
      return
    }

    const newSquares:
      | {
          [key in Square]: CSSProperties
        }
      | undefined = undefined
    moves.map((move) => {
      newSquares![move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)?.color !== game.get(square)?.color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      }

      return move
    })
    newSquares![square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    }
    setOptionSquares(newSquares)
  }

  const onSquareClick = (square: Square) => {
    setRightClickedSquares(undefined)

    const resetFirstMove = (squareInner: Square) => {
      setMoveFrom(squareInner)
      getMoveOptions(squareInner)
    }

    // from square
    if (!moveFrom) {
      resetFirstMove(square)
      return
    }

    // attempt to make move
    const gameCopy: typeof game = { ...game }
    const move = gameCopy.move({
      from: moveFrom,
      to: square,
      promotion: 'q', // always promote to a queen for example simplicity
    })
    setGame(gameCopy)

    // if invalid, setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square)
      return
    }

    setMoveFrom(undefined)
    setOptionSquares(undefined)
  }

  function onSquareRightClick(square: Square) {
    const colour = 'rgba(0, 0, 255, 0.4)'
    setRightClickedSquares({
      ...rightClickedSquares!,
      [square]:
        rightClickedSquares![square] &&
        rightClickedSquares![square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    })
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Chessboard
        animationDuration={500}
        arePiecesDraggable={false}
        boardWidth={boardWidth}
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
        }}
        customSquareStyles={{
          ...optionSquares,
          ...rightClickedSquares,
        }}
      />
    </div>
  )
}

export default GameLobbyBoard
