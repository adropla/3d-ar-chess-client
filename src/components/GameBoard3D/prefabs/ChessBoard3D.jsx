/* eslint-disable no-restricted-syntax */
import React from 'react'

// Hooks
import { useTexture } from '@react-three/drei'

// Components
import { Piece } from './Piece'
import { Square } from './Square'
// Constants
const blackTextureRoot = '/textures/wood/white/'
const whiteTextureRoot = '/textures/wood/black/'

const boardColor = '#50504e'
const whiteColor = 'white'
const blackColor = '#50504e'

const edgeOffset = 4.25
const edgeDefaultLength = 8
const edgeDefaultHeight = 0.2
const edgeDefaultWidth = 0.5

const commonMaterialProps = {
  metalness: 0,
  roughness: 0.3,
  opacity: 1,
  transparent: true,
}

/**
 * Компонент рендера 3д шахматной доски и фигур
 * @param {array} board Состояние доски
 * @param {array} possibleMoves Возможные ходы для выбранной фигуры
 * @param {function} setSelectedObject Set selected piece function.
 * @param {function} moveTo Функция отвечающая за передвижение фигуры
 * @param {boolean} isMatchOver Закончен ли матч
 * @param {boolean} isWhiteTurn Ходят ли сейчас белый фигуры
 */
export const ChessBoard3D = ({
  board,
  possibleMoves,
  setSelectedObject,
  moveTo,
  isMatchOver,
  currentTurn,
}) => {
  const [wColorT, wDisplT, wNormalT, wRoughT] = useTexture([
    `${whiteTextureRoot}color.jpg`,
    `${whiteTextureRoot}displacement.jpg`,
    `${whiteTextureRoot}normal.jpg`,
    `${whiteTextureRoot}roughness.jpg`,
  ])

  const [bColorT, bDisplT, bNormalT, bRoughT] = useTexture([
    `${blackTextureRoot}color.jpg`,
    `${blackTextureRoot}displacement.jpg`,
    `${blackTextureRoot}normal.jpg`,
    `${blackTextureRoot}roughness.jpg`,
  ])

  // console.log('BOARD', board)
  // console.log('POSSIBLE MOVES', possibleMoves)
  // console.log('moveTo', moveTo)
  // console.log('isWhiteTurn', currentTurn)

  return (
    <>
      {/* Рендерим края доски */}
      {[0, 1, 2, 3].map((index) => {
        // Массив с координатами
        let position = []

        // Поворот
        let rotation = [0, 0, 0]

        // Размеры боксов
        const args = [edgeDefaultLength, edgeDefaultHeight, edgeDefaultWidth]

        switch (index) {
          // Первым двум углам добавляем длины больше на 1, чтобы они закрывали углы
          // Вторые две поворачиваем перпендикулярно
          case 0:
            position = [0, 0, -edgeOffset]
            args[0] += 1
            break
          case 1:
            position = [0, 0, edgeOffset]
            args[0] += 1
            break
          case 2:
            position = [-edgeOffset, 0, 0]
            rotation = [0, Math.PI / 2, 0]
            break
          case 3:
            position = [edgeOffset, 0, 0]
            rotation = [0, Math.PI / 2, 0]
            break
          default:
        }

        return (
          <mesh key={index} position={position} rotation={rotation}>
            <boxBufferGeometry args={args} />
            <meshStandardMaterial
              {...commonMaterialProps}
              color={boardColor}
              oughnessMap={wRoughT}
              normalMap={wNormalT}
              map={wColorT}
              bumpMap={wDisplT}
              opacity={1}
            />
          </mesh>
        )
      })}
      {/* Рендерим фигуры */}
      {/* Для создания шахматной доски нам нужен массив 8*8 */}
      {new Array(64).fill(0).map((_, index) => {
        let possible = false
        const i = Math.floor(index / 8)
        const j = index % 8
        const piece = board[j][i]

        for (const possibleMove of possibleMoves) {
          if (possibleMove[0] === j && possibleMove[1] === i) {
            possible = true
            break
          }
        }

        if (piece) {
          return (
            <Piece
              key={piece.id}
              id={piece.id}
              type={piece.type}
              color={piece.color}
              position={[j - 3.5, 0.1, i - 3.5]}
              onSelect={({ ref }) => {
                console.log('on select run', ref)
                if (
                  possible &&
                  ((piece.color === 'b' && currentTurn === 'b') ||
                    (piece.color === 'w' && currentTurn === 'w'))
                ) {
                  moveTo([j, i])
                } else if (
                  !isMatchOver &&
                  ((piece.color === 'w' && currentTurn === 'w') ||
                    (piece.color === 'b' && currentTurn === 'b'))
                ) {
                  setSelectedObject([{ ref, position: [j, i] }])
                }
              }}
            />
          )
        }
        return undefined
      })}
      {/* Possible moves */}
      <group>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
          [0, 1, 2, 3, 4, 5, 6, 7].map((j) => {
            let possible = false
            const hasPiece = board[j][i]
            for (const possibleMove of possibleMoves) {
              if (possibleMove[0] === j && possibleMove[1] === i) {
                possible = true
                break
              }
            }

            return (
              <group key={i * 8 + j}>
                {possible &&
                  (hasPiece ? (
                    // Possible move with enemy piece.
                    [0, 1, 2, 3].map((index) => {
                      const position = [i - 3.5, 0.11, j - 3.5]
                      switch (index) {
                        case 0:
                          position[0] += 0.45
                          position[2] += 0.45
                          break
                        case 1:
                          position[0] -= 0.45
                          position[2] -= 0.45
                          break
                        case 2:
                          position[0] += 0.45
                          position[2] -= 0.45
                          break
                        case 3:
                          position[0] -= 0.45
                          position[2] += 0.45
                          break
                        default:
                      }

                      return (
                        <mesh
                          key={index}
                          position={position}
                          rotation={[-Math.PI / 2, 0, 0]}
                          scale={[1, 1, 1]}
                        >
                          <planeBufferGeometry args={[0.1, 0.1]} />
                          <meshStandardMaterial color="#28a745" roughness={1} />
                        </mesh>
                      )
                    })
                  ) : (
                    // Possible move without enemy piece.
                    <mesh
                      position={[i - 3.5, 0.1, j - 3.5]}
                      scale={[1, 0.1, 1]}
                    >
                      <sphereBufferGeometry args={[0.15, 32, 32]} />
                      <meshStandardMaterial color="#28a745" roughness={1} />
                    </mesh>
                  ))}

                {/* Рендер квадратов шахматной доски */}
                <Square
                  i={i}
                  j={j}
                  possible={possible}
                  moveTo={moveTo}
                  wColorT={wColorT}
                  wDisplT={wDisplT}
                  wNormalT={wNormalT}
                  wRoughT={wRoughT}
                  bColorT={bColorT}
                  bDisplT={bDisplT}
                  bNormalT={bNormalT}
                  bRoughT={bRoughT}
                  whiteColor={whiteColor}
                  blackColor={blackColor}
                  commonMaterialProps={commonMaterialProps}
                />
              </group>
            )
          }),
        )}
      </group>
    </>
  )
}
