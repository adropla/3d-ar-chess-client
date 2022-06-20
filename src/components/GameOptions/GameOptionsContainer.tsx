import { useState } from 'react'
import { useGameOptions } from '../../hooks/useGameOptions'
import useModalVisible from '../../hooks/useModalVisible'
import { GameModal } from '../GameModals/GameModal'
import GameOptions from './GameOptions'

const GameOptionsContainer = () => {
  const { playViaLink, isGameRunning } = useGameOptions()
  const { toogleModal, setModalVisible, modalVisible } = useModalVisible(false)
  const [text, setText] = useState<string>('')

  const giveUp = () => {
    setText('Вы хотите сдаться?')
    toogleModal()
  }

  const offerDraw = () => {
    setText('Предложить ничью?')
    toogleModal()
  }

  return (
    <>
      <GameOptions
        playViaLink={playViaLink}
        isGameRunning={isGameRunning}
        giveUp={giveUp}
        offerDraw={offerDraw}
      />
      <GameModal
        toogleModal={toogleModal}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        text={text}
      />
    </>
  )
}

export default GameOptionsContainer
