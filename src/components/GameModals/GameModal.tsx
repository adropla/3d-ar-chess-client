import { Button, Form, Typography } from 'antd'
import classnames from 'classnames'
import RoundModal from '../../styledComponents/RoundModal'

import styles from './GameModal.module.scss'

export type ModalProps = {
  toogleModal: any
  setModalVisible: any
  modalVisible: boolean
  text: string
}

const { Text } = Typography

export const GameModal = ({
  toogleModal,
  setModalVisible,
  modalVisible,
  text,
}: ModalProps) => {
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
      </Form>
    </RoundModal>
  )
}
