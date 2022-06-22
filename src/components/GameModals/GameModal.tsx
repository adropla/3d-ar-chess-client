import { Button, Form, Typography } from 'antd'
import classnames from 'classnames'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/redux'
import { selectUserId } from '../../redux/selectors/authSelectors'
import { selectRoomId } from '../../redux/selectors/currentGameSelectors'
import { socket } from '../../Socket/WebSocket'
import RoundModal from '../../styledComponents/RoundModal'

import styles from './GameModal.module.scss'

export type ModalProps = {
  toogleModal: any
  setModalVisible: any
  modalVisible: boolean
  text: string
}

const SecondaryButton = styled(Button)`
  &&& {
    background-color: rgba(122, 62, 2, 0.5);
    margin-top: 16px;
    font-size: 20px;
    font-weight: bold;
    height: fit-content;
    width: 100%;
    &:hover {
      color: black;
      outline: none;
      border: 0;
    }
  }
`

const { Text } = Typography

export const GameModal = ({
  toogleModal,
  setModalVisible,
  modalVisible,
  text,
}: ModalProps) => {
  const roomIdFromStore = useAppSelector(selectRoomId)
  const userIdFromStore = useAppSelector(selectUserId)
  const handleOk = () => {
    toogleModal()
  }

  const onCancel = () => {
    toogleModal()
  }

  return (
    <RoundModal
      radius="5px"
      centered
      visible={modalVisible}
      bodyStyle={{ borderRadius: '50px' }}
      onCancel={onCancel}
      footer={null}
    >
      <Form name="forgot_form" className={styles.form}>
        <Form.Item>
          <Text
            className={classnames(
              styles.text,
              text === 'Вы выиграли' && styles.green,
              text === 'Вы проиграли' && styles.red,
            )}
          >
            {text}
          </Text>
        </Form.Item>
        {text === 'Вы хотите сдаться?' && (
          <Form.Item>
            <SecondaryButton
              onClick={(e) =>
                socket.emit('giveUp', {
                  roomId: roomIdFromStore,
                  userId: userIdFromStore,
                })
              }
            >
              Сдаться
            </SecondaryButton>
          </Form.Item>
        )}
      </Form>
    </RoundModal>
  )
}
