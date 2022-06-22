import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks/redux'
import { useGameOptions } from '../../hooks/useGameOptions'
import useModalVisible from '../../hooks/useModalVisible'
import { selectIsAuth, selectUserId } from '../../redux/selectors/authSelectors'
import {
  selectGameOverData,
  selectRoomId,
} from '../../redux/selectors/currentGameSelectors'
import { socket } from '../../Socket/WebSocket'
import { EndGameModal } from '../EndGameModal/EndGameModal'
import { GameModal } from '../GameModals/GameModal'
import GameOptions from './GameOptions'
import { GameOptions3d } from './GameOptions3d'
import { GameOptionsAR } from './GameOptionsAR'

const GameOptionsContainer = ({ mode }: { mode: '2d' | '3d' | 'ar' }) => {
  const { playViaLink, isGameRunning } = useGameOptions()
  const { toogleModal, setModalVisible, modalVisible } = useModalVisible(false)
  const [text, setText] = useState<string>('')
  const gameIsOverFromStore = useAppSelector(selectGameOverData)
  const roomIdFromStore = useAppSelector(selectRoomId)
  const userIdFromStore = useAppSelector(selectUserId)
  const isAuth = useAppSelector(selectIsAuth)

  const giveUp = () => {
    if (!gameIsOverFromStore) {
      setText('Вы хотите сдаться?')
      toogleModal()
    }
  }

  const offerDraw = () => {
    if (!gameIsOverFromStore) {
      setText('Предложить ничью?')
      toogleModal()
    }
  }

  const wasDraw = () => {
    setText('Ничья')
    toogleModal()
  }

  const won = () => {
    setText(
      `Вы выиграли. ${
        gameIsOverFromStore?.text ? gameIsOverFromStore?.text : ''
      }`,
    )
    toogleModal()
  }

  const lose = () => {
    setText('Вы проиграли')
    toogleModal()
  }

  useEffect(() => {
    if (gameIsOverFromStore && userIdFromStore) {
      const { isDraw, winner } = gameIsOverFromStore
      if (isDraw) {
        wasDraw()
      } else if (userIdFromStore === winner) {
        won()
      } else {
        lose()
      }
    }
  }, [gameIsOverFromStore, userIdFromStore])

  return (
    <>
      {mode === '2d' && (
        <GameOptions
          playViaLink={playViaLink}
          isGameRunning={isGameRunning}
          giveUp={giveUp}
          offerDraw={offerDraw}
          disabled={!isAuth}
        />
      )}
      {mode === '3d' && (
        <GameOptions3d
          playViaLink={playViaLink}
          isGameRunning={isGameRunning}
          giveUp={giveUp}
          offerDraw={offerDraw}
          disabled={!isAuth}
        />
      )}

      {mode === 'ar' && (
        <GameOptionsAR
          playViaLink={playViaLink}
          isGameRunning={isGameRunning}
          giveUp={giveUp}
          offerDraw={offerDraw}
          disabled={!isAuth}
        />
      )}

      <GameModal
        toogleModal={toogleModal}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        text={text}
      />
      {/* <EndGameModal
        onClickBtn={onClickBtn}
        toogleModal={toogleModal}
        modalVisible={modalVisible}
        text={text}
      /> */}
    </>
  )
}

export default GameOptionsContainer
