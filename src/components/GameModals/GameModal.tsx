import { Button, Form } from 'antd'
import RoundModal from '../../styledComponents/RoundModal'

import styles from './GameModal.module.scss'

export type ModalProps = {
  toogleModal: any
  setModalVisible: any
  modalVisible: boolean
  text: string
}

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
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.btn}>
            {text}
          </Button>
        </Form.Item>
        <Form.Item noStyle>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.btn}
            onClick={toogleModal}
          >
            Отмена
          </Button>
        </Form.Item>
      </Form>
    </RoundModal>
  )
}