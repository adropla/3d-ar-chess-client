import { Button, Card, Divider, Form, Input, message, Typography } from 'antd'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import useModalVisible from '../../hooks/useModalVisible'
import { setUsername } from '../../redux/reducers/authSlice'
import {
  selectEmail,
  selectUsername,
} from '../../redux/selectors/authSelectors'
import { useChangeUsernameMutation } from '../../services/serverApi'
import ChangePasswordModal from '../ChangePasswordModal/ChangePasswordModal'
// import ChangePasswordModal from '../ChangePasswordModal/ChangePasswordModal'

import styles from './AccountSetting.module.scss'

const { Text } = Typography

const AccountSetting = () => {
  const [form] = Form.useForm()
  const username = useAppSelector(selectUsername)
  const email = useAppSelector(selectEmail)
  const [changeUsernameTrigger] = useChangeUsernameMutation()

  const changePassworModaldVisible = useModalVisible(false)

  const dispatch = useAppDispatch()

  const [inputUsername, setInputUsername] = useState<string>(username)

  const onSave = async () => {
    try {
      const response: any = await changeUsernameTrigger({
        name: inputUsername,
      })
      message.success('Вы успешно поменяли имя!')
      dispatch(setUsername(response.data.name))
    } catch (error) {
      message.error('Что то пошло не так!')
    }
  }

  const onChangePassword = () => {
    changePassworModaldVisible.toogleModal()
  }

  return (
    <>
      <Card className={styles.card} title="Account Settings" bordered>
        <Form layout="vertical" form={form}>
          <Form.Item label="Username" className={styles.formItem}>
            <Input
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            className={styles.formItem}
            rules={[{ type: 'email' }]}
          >
            <Input value={email || ''} type="email" readOnly />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              className={`${styles.btn} ${styles.w100}`}
              onClick={onSave}
            >
              Сохранить
            </Button>
          </Form.Item>
        </Form>
        {/* <Divider />
        <div className={styles.footerWrapper}>
          <Text className={styles.footerText}>Password</Text>
          <Button
            type="ghost"
            htmlType="submit"
            className={styles.btn}
            onClick={onChangePassword}
          >
            Сменить пароль
          </Button>
        </div> */}
      </Card>
      {/* <ChangePasswordModal
        visible={changePassworModaldVisible.modalVisible}
        toogleChangePasswordModal={changePassworModaldVisible.toogleModal}
      /> */}
    </>
  )
}

export default AccountSetting
