/* eslint-disable no-param-reassign */
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

// Three
import { extend } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { EffectComposer, Outline } from '@react-three/postprocessing'

// Custom hooks
import { useGame } from '../../../hooks/useGame'

// Prefabs
import { ChessBoard3D } from '../prefabs/ChessBoard3D'
import { Skybox } from '../prefabs/SkyBox'

// Utils
import {
  getCoordenatePositions,
  getNotatedPosition,
} from '../../../utils/notatedPosition'

extend({ OutlinePass })
export const DefaultChessScene = ({ isLobby = false, ar = false }) => {
  // Application state.
  const {
    boardOrientation,
    getPossibleMoves,
    currentTurn,
    isWaiting,
    game,
    mySideFromStore,
    isMatchOver,
    setGame,
  } = useGame(isLobby)
  const [selected, setSelected] = useState([])
  const [possibleMoves, setPossibleMoves] = useState([])

  // Начальное состояни доски
  const initialStateBoard = useMemo(() => {
    const board = game.board()
    board.forEach((column, columnIndex) => {
      column.forEach((row, rowIndex) => {
        if (row) {
          row.id = columnIndex.toString() + rowIndex.toString()
        }
      })
    })
    return board
  }, [game])

  const [board, setBoard] = useState(initialStateBoard)

  /**
   * Обновление состояния доски
   * @param {[number, number]} targetPosition Позиция на которую перемещать
   * @param {string} pieceId ID фигуры
   */
  const updateBoard = useCallback(
    (targetPosition, id) => {
      setSelected([])
      setPossibleMoves([])

      setBoard((currentBoard) => {
        const newBoard = game.board()

        newBoard.forEach((column, columnIndex) => {
          column.forEach((row, rowIndex) => {
            if (row) {
              if (
                targetPosition[0] === columnIndex &&
                targetPosition[1] === rowIndex
              ) {
                row.id = id
              } else {
                row.id = currentBoard[columnIndex][rowIndex].id
              }
            }
          })
        })

        return newBoard
      })
    },
    [setBoard, game],
  )

  /**
   * Передвижение выбранной фигуры на определенную позицию
   * @param {[number, number]} position Позиция на которую перемещать
   */
  const moveSelectedPieceTo = useCallback(
    (position) => {
      const originPosition = selected[0].position
      const targetPosition = position

      const originNPosition = getNotatedPosition(originPosition)
      const targetNPosition = getNotatedPosition(position)

      const movedPieceId = board[originPosition[0]][originPosition[1]].id

      const gameCopy = { ...game }
      const move = gameCopy.move({
        from: originNPosition,
        to: targetNPosition,
        promotion: 'q', // always promote to a queen for example simplicity
      })
      setGame(gameCopy)

      updateBoard(targetPosition, movedPieceId)
    },
    [updateBoard, game, board, selected, setGame],
  )

  // Обновление возможных позиций для хода во время селекта или деселекта фигуры
  useEffect(() => {
    if (selected.length !== 0) {
      const selectedPosition = getNotatedPosition(selected[0].position)
      const tempPossibleMoves = getPossibleMoves(selectedPosition)

      setPossibleMoves(
        tempPossibleMoves.map((pos) => getCoordenatePositions(pos.to)),
      )
    }
  }, [selected, getPossibleMoves])

  const defaultCameraPosition = useMemo(
    () => (boardOrientation === 'b' ? [0, 10, -10] : [0, 10, 10]),
    [boardOrientation],
  )

  return (
    <>
      {/* <EffectComposer multisampling={8}>
        <Outline
          selection={
            selected.length !== 0 ? selected.map((object) => object.ref) : []
          }
          edgeStrength={10}
        />
      </EffectComposer> */}

      <hemisphereLight color="white" groundColor="brown" intensity={0.4} />
      <directionalLight position={[2, 10, -10]} castShadow />
      <ambientLight intensity={0.1} />

      {/* {!ar ? (
        <>
          <Skybox />
        </>
      ) : null} */}
      <PerspectiveCamera makeDefault position={defaultCameraPosition} />
      <OrbitControls maxDistance={50} minDistance={1} />

      <Suspense fallback={<>Loading....</>}>
        <ChessBoard3D
          board={board}
          possibleMoves={possibleMoves}
          selected={selected}
          setSelectedObject={setSelected}
          moveTo={moveSelectedPieceTo}
          currentTurn={currentTurn}
          isMatchOver={isMatchOver}
        />
      </Suspense>
    </>
  )
}
