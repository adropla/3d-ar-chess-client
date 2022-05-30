import { useRef, useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { selectUserId } from '../../redux/selectors/authSelectors'

import { useBoardWidth } from '../../hooks/useBoardWidth'

import { socket } from '../../Socket/WebSocket'
import {
  selectFen,
  selectMySide,
} from '../../redux/selectors/currentGameSelectors'

import styles from './GameBoard.module.scss'
import { addMove } from '../../redux/reducers/currentGameSlice'

const revertSides = (side) => (side === 'w' ? 'b' : 'w')

const GameBoard = () => {
  const { roomIdParam } = useParams()

  const userIdFromStore = useAppSelector(selectUserId)
  const mySideFromStore = useAppSelector(selectMySide)
  const fenFromStore = useAppSelector(selectFen)

  const dispatch = useAppDispatch()

  const [game, setGame] = useState(new Chess())

  const chessboardRef = useRef()
  const wrapperRef = useRef()

  const [moveFrom, setMoveFrom] = useState('')

  const [rightClickedSquares, setRightClickedSquares] = useState({})
  const [moveSquares, setMoveSquares] = useState({})
  const [optionSquares, setOptionSquares] = useState({})

  const [currentTurn, setCurrentTurn] = useState()
  const [isWaiting, setIsWaiting] = useState(true)

  const { boardWidth } = useBoardWidth(wrapperRef)

  const currentGameFen = useMemo(() => game.fen(), [game])

  useEffect(() => {
    if (currentGameFen !== fenFromStore[fenFromStore.length - 1]) {
      dispatch(addMove(currentGameFen))
    }
  }, [currentGameFen, fenFromStore, dispatch])

  useEffect(() => {
    setCurrentTurn(game.turn())
  }, [game])

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g }
      modify(update)
      return update
    })
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    })
    if (moves.length === 0) {
      return
    }

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

  useEffect(() => {
    if (
      roomIdParam &&
      userIdFromStore &&
      currentTurn &&
      currentTurn === mySideFromStore &&
      !isWaiting &&
      currentGameFen !== fenFromStore[fenFromStore.length - 1]
    ) {
      const obj = {
        roomId: roomIdParam,
        userId: userIdFromStore,
        message: Object.values(currentGameFen).join(''),
        messageTurn: currentTurn,
      }
      console.log('%c=====EMIT_NEW_MOVE=====', 'color: yellow')
      console.log(obj)
      console.log('%c=======================', 'color: yellow')
      socket.emit('newMove', obj)
    }
  }, [
    currentGameFen,
    roomIdParam,
    userIdFromStore,
    mySideFromStore,
    currentTurn,
    isWaiting,
    fenFromStore,
  ])

  useEffect(() => {
    socket.on('opponent move', (room) => {
      const { userId, message, messageTurn } = room
      console.log('%c=====ON OPPONENT MOVE=====', 'color: orange')
      console.log('%cuser id from socket', 'color: orange', userId)
      console.log('%cmy user id', 'color: orange', userIdFromStore)
      console.log('%cturn', 'color: orange', messageTurn)
      console.log('%cmy side', 'color: orange', mySideFromStore)
      console.log('%c==========================', 'color: orange')
      if (userIdFromStore !== userId && messageTurn !== mySideFromStore) {
        const msgFen = Object.values(message).join('')
        safeGameMutate((gameInst) => {
          gameInst.load(msgFen)
        })
      }
    })
  }, [mySideFromStore, userIdFromStore])

  useEffect(() => {
    socket.on('gameStart', () => {
      setIsWaiting(false)
    })
  }, [])

  const boardOrientation = useMemo(
    () => (mySideFromStore === 'b' ? 'black' : 'white'),
    [mySideFromStore],
  )

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
        animationDuration={200}
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
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        ref={chessboardRef}
      />
    </div>
  )
}

export default GameBoard
