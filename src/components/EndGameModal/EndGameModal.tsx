import { Button, Form } from 'antd'
import RoundModal from '../../styledComponents/RoundModal'

import styles from './EndGameModal.module.scss'

export type ModalProps = {
  toogleModal: any
  onClickBtn: any
  modalVisible: boolean
  text: string
}

export const EndGameModal = ({
  toogleModal,
  modalVisible,
  text,
  onClickBtn,
}: ModalProps) => {
  const onFinish = () => {
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
      <Form
        name="forgot_form"
        className={styles.form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item noStyle>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.btn}
            onClick={onClickBtn}
          >
            {text}
          </Button>
        </Form.Item>
      </Form>
    </RoundModal>
  )
}
