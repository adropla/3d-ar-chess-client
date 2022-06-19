import {
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { FocusEventHandler, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthentification from '../../hooks/useAuthentification'
import { useLoginMutation } from '../../services/serverApi'
import RoundModal from '../../styledComponents/RoundModal'
import { ChangePasswordModalProps } from '../../types/ModalProps'
import {
  validateMatchPasswords,
  validateRegexPassword,
} from '../../utils/validateForms'

import styles from './ChangePasswordModal.module.scss'

const { Text } = Typography

export const inputPasswordIconRender = (passVisible: boolean) =>
  passVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />

const ChangePasswordModal = ({
  visible,
  toogleChangePasswordModal,
}: ChangePasswordModalProps) => {
  const [form] = Form.useForm()

  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')

  const handleOk = () => {
    toogleChangePasswordModal()
  }

  const onFinish = () => {
    console.log('change password')
  }

  const onCancel = () => {
    toogleChangePasswordModal()
    form.resetFields()
  }

  return (
    <RoundModal
      radius="5px"
      centered
      visible={visible}
      bodyStyle={{ borderRadius: '50px' }}
      onOk={handleOk}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        name="forgot_form"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item noStyle>
          <Text
            style={{
              fontSize: '25px',
              fontWeight: 'bold',
            }}
          >
            Change password
          </Text>
        </Form.Item>
        <Form.Item noStyle>
          <Form.Item style={{ marginBottom: 0 }}>
            <Text style={{ fontSize: '14px', color: 'darkgray' }}>
              Enter old password
            </Text>
          </Form.Item>
        </Form.Item>
        <Form.Item
          noStyle
          name="old_password"
          rules={[
            {
              required: true,
              message: 'Please input your old password!',
              validateTrigger: 'onSubmit',
            },
          ]}
        >
          <Input.Password
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            iconRender={inputPasswordIconRender}
          />
        </Form.Item>
        <Form.Item noStyle>
          <Form.Item style={{ marginBottom: 0 }}>
            <Text style={{ fontSize: '14px', color: 'darkgray' }}>
              Enter new password
            </Text>
          </Form.Item>
        </Form.Item>
        <Form.Item
          noStyle
          name="new_password1"
          dependencies={['new_password2']}
          rules={[
            {
              required: true,
              message: 'Please input your new password!',
              validateTrigger: 'onSubmit',
            },
            ({ getFieldValue }) =>
              validateMatchPasswords(getFieldValue, 'new_password2'),
          ]}
        >
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            iconRender={inputPasswordIconRender}
          />
        </Form.Item>
        <Form.Item noStyle>
          <Form.Item style={{ marginBottom: 0 }}>
            <Text style={{ fontSize: '14px', color: 'darkgray' }}>
              Enter new password
            </Text>
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="new_password2"
          dependencies={['new_password1']}
          rules={[
            {
              required: true,
              message: 'Please input your new password!',
              validateTrigger: 'onSubmit',
            },
            ({ getFieldValue }) =>
              validateMatchPasswords(getFieldValue, 'new_password1'),
            ({ getFieldValue }) =>
              validateRegexPassword(getFieldValue, 'new_password1'),
          ]}
        >
          <Input.Password
            onChange={onFinish}
            iconRender={inputPasswordIconRender}
          />
        </Form.Item>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.btn}>
            Change password
          </Button>
        </Form.Item>
      </Form>
    </RoundModal>
  )
}

export default ChangePasswordModal
