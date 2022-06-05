import { useRef, useState, useEffect, useMemo } from 'react'
import { Chessboard } from 'react-chessboard'

import { useBoardWidth } from '../../../hooks/useBoardWidth'
import { useGame } from '../../../hooks/useGame'

import styles from './GameBoard.module.scss'

const GameBoard2D = () => {
  const wrapperRef = useRef()

  const [moveFrom, setMoveFrom] = useState('')

  const [rightClickedSquares, setRightClickedSquares] = useState({})
  const [optionSquares, setOptionSquares] = useState({})

  const { boardWidth } = useBoardWidth(wrapperRef)

  const {
    boardOrientation,
    getPossibleMoves,
    currentGameFen,
    currentTurn,
    isWaiting,
    game,
    mySideFromStore,
    setGame,
  } = useGame()

  function getMoveOptions(square) {
    const moves = getPossibleMoves()
    const newSquares = {}
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      }
      return move
    })
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    }
    setOptionSquares(newSquares)
  }

  const onSquareClick = (square) => {
    setRightClickedSquares({})

    if (mySideFromStore !== currentTurn) {
      setMoveFrom(square)
      return
    }

    const resetFirstMove = (squareInner) => {
      setMoveFrom(squareInner)
      getMoveOptions(squareInner)
    }

    // from square
    if (!moveFrom) {
      resetFirstMove(square)
      return
    }

    // attempt to make move
    const gameCopy = { ...game }
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

    setMoveFrom('')
    setOptionSquares({})
  }

  function onSquareRightClick(square) {
    const colour = 'rgba(0, 0, 255, 0.4)'
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    })
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={isWaiting ? styles.waiting : styles.hidden}>
        <div className={styles.waiting_inner}>
          Ожидаем подключение другого игрока...
        </div>
      </div>
      <Chessboard
        id="ClickToMove"
        boardOrientation={boardOrientation}
        animationDuration={500}
        arePiecesDraggable={false}
        boardWidth={boardWidth}
        position={currentGameFen}
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

export default GameBoard2D
