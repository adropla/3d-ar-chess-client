import { Button, Form, Input, Typography, message } from 'antd'
import classNames from 'classnames'
import { useAppDispatch } from '../../hooks/redux'
import useAuthentification from '../../hooks/useAuthentification'
import { setCredentials, setUserInfo } from '../../redux/reducers/authSlice'
import { useGetUserDataMutation } from '../../services/serverApi'
import RoundModal from '../../styledComponents/RoundModal'
import { SignupModalProps } from '../../types/ModalProps'
import {
  validateMatchPasswords,
  validateRegexPassword,
} from '../../utils/validateForms'
import { inputPasswordIconRender } from '../LoginModal/LoginModal'

import styles from './SignUpModal.module.scss'

const { Text } = Typography

const SignUpModal = ({
  visible,
  toogleLoginModal,
  toogleSignUpModal,
}: SignupModalProps) => {
  const {
    email,
    password,
    error,
    errorMsg,
    handleEmail,
    handlePassword,
    signUpTrigger,
    setError,
    setErrorMsg,
  } = useAuthentification()

  const dispatch = useAppDispatch()
  const [getUserInfoTrigger, getUserInfoResult] = useGetUserDataMutation()

  const [form] = Form.useForm()

  const handleOk = () => {
    toogleSignUpModal()
  }

  const signUpModalOff = () => {
    toogleSignUpModal()
    form.resetFields()
  }

  const toLoginModal = () => {
    signUpModalOff()
    toogleLoginModal()
  }

  const onCancel = () => {
    signUpModalOff()
  }

  const onFinish = async () => {
    try {
      const dataSignUp = await signUpTrigger({ email, password }).unwrap()
      signUpModalOff()
      message.success('Вы успешно зарегистировались!')
      dispatch(setCredentials({ ...dataSignUp, email }))
      const userInfo = await getUserInfoTrigger('x').unwrap()
      dispatch(setUserInfo({ ...userInfo }))
      return null
    } catch (e) {
      setError(true)
      setErrorMsg(e)
      message.error('Что то пошло не так!')
      form.validateFields()
      return null
    }
  }

  return (
    <RoundModal
      radius="5px"
      centered
      visible={visible}
      wrapClassName={styles.modalWrapper}
      bodyStyle={{ borderRadius: '50px' }}
      onOk={handleOk}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        name="signup_form"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item noStyle>
          <Text style={{ fontSize: '25px', fontWeight: 'bold' }}>
            Регистрация
          </Text>
        </Form.Item>
        <Form.Item noStyle>
          <Form.Item>
            <Text style={{ fontSize: '14px', color: 'darkgray' }}>
              Уже есть аккаунт?
            </Text>
            <Button
              type="link"
              onClick={toLoginModal}
              style={{ fontSize: '14px', padding: '0 0 0 6px' }}
            >
              Войти!
            </Button>
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="email_signup"
          rules={[
            {
              type: 'email',
              message: 'Введите корректный email!',
              validateTrigger: 'onSubmit',
            },
            {
              required: true,
              message: 'Введите свой Email!',
              validateTrigger: 'onSubmit',
            },
          ]}
        >
          <Input placeholder="Email" onChange={handleEmail} />
        </Form.Item>
        <Form.Item
          name="password1"
          dependencies={['password2']}
          rules={[
            {
              required: true,
              message: 'Введите свой пароль!',
            },
            ({ getFieldValue }) =>
              validateMatchPasswords(getFieldValue, 'password2'),
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Пароль"
            iconRender={inputPasswordIconRender}
            onChange={handlePassword}
          />
        </Form.Item>
        <Form.Item
          name="password2"
          dependencies={['password1']}
          rules={[
            {
              required: true,
              message: 'Введите свой пароль!',
              validateTrigger: 'onSubmit',
            },
            ({ getFieldValue }) =>
              validateMatchPasswords(getFieldValue, 'password1'),
            ({ getFieldValue }) =>
              validateRegexPassword(getFieldValue, 'password1'),
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Пароль"
            iconRender={inputPasswordIconRender}
          />
        </Form.Item>

        <Form.Item name="error" style={{ display: error ? 'block' : 'none' }}>
          <div className={classNames(styles.error)}>
            {errorMsg?.data?.message}
          </div>
        </Form.Item>

        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.btn}>
            Зарегистироваться
          </Button>
        </Form.Item>
      </Form>
    </RoundModal>
  )
}

export default SignUpModal
