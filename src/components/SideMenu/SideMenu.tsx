import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Button,
  Layout,
  Menu,
  MenuProps,
  message,
  Typography,
} from 'antd'
import classNames from 'classnames'

import {
  UserAddOutlined,
  LoginOutlined,
  PlayCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import styles from './SideMenu.module.scss'
import logo from '../../assets/logo.png'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import selectLoginModalVisible from '../../redux/selectors/loginModalSelectors'
import { toogleLoginModalVisible } from '../../redux/reducers/loginModalSlice'
import useModalVisible from '../../hooks/useModalVisible'
import LoginModal from '../LoginModal/LoginModal'
import SignUpModal from '../SignUpModal/SignUpModal'
import {
  selectIsAuth,
  selectUsername,
} from '../../redux/selectors/authSelectors'
import { useLogoutMutation } from '../../services/serverApi'
import { clearCredentials } from '../../redux/reducers/authSlice'
import ROUTES from '../../constants/routes'

const { Sider } = Layout
const { Text } = Typography

type MenuItem = Required<MenuProps>['items'][number]

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem(
    <Link to="/game">Play</Link>,
    'sider_play',
    <Link to="/game">
      <PlayCircleOutlined />
    </Link>,
  ),
  // getItem('Puzzles', 'sider_puzzles', <DesktopOutlined />),
]

const LoginBtnInner = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return isCollapsed ? <LoginOutlined /> : <>Войти</>
}

const RegistrationBtnInner = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return isCollapsed ? <UserAddOutlined /> : <>Регистрация</>
}

const SideMenu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const onCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [setIsCollapsed])

  const loginModalVisibleFromStore = useAppSelector(selectLoginModalVisible)
  const loginModalVisible = useModalVisible(false, toogleLoginModalVisible)
  const signupModalVisible = useModalVisible(false)
  const forgotPasswordModalVisible = useModalVisible(false)
  const isAuth = useAppSelector(selectIsAuth)

  const handelLogin = () => {
    loginModalVisible.toogleModalWithStore()
  }

  const handleSignup = () => {
    signupModalVisible.toogleModal()
  }

  useEffect(() => {
    loginModalVisible.setModalVisible(loginModalVisibleFromStore)
  }, [loginModalVisibleFromStore, loginModalVisible])

  const username = useAppSelector(selectUsername)
  const dispatch = useAppDispatch()

  const [logoutTrigger] = useLogoutMutation()

  const logout = () => {
    logoutTrigger('')
    dispatch(clearCredentials())
    loginModalVisible.setModalVisible(false)
    message.success({
      content: 'Вы успешно вышли из системы',
      icon: <LogoutOutlined />,
    })
  }

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={isCollapsed}
      onCollapse={onCollapse}
      collapsedWidth={0}
      breakpoint="lg"
    >
      <div className={styles.wrapper}>
        <div>
          <Link to="/">
            <div
              className={classNames(styles.logo, {
                [styles.collapsed]: isCollapsed,
              })}
            >
              <img className={styles.logoImg} src={logo} alt="" />
              <span>AR CHESS</span>
            </div>
          </Link>
          <Menu items={items} mode="vertical" selectable={false} />
        </div>
        <div className={classNames(styles.loginWrapper)}>
          {isAuth ? (
            <>
              <div className={styles.popoverWrapper}>
                <Link to={ROUTES.settings}>
                  <Avatar size={64} icon={<UserOutlined />} />
                </Link>
                <div className={styles.rightSide}>
                  <Link
                    to={ROUTES.settings}
                    style={{ width: '-webkit-fill-available' }}
                  >
                    <Text className={styles.username}>{username}</Text>
                  </Link>
                  <Link to={ROUTES.settings}>
                    <Text className={styles.view}>Профиль</Text>
                  </Link>
                </div>
              </div>
              <Button className={styles.btn} onClick={logout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                type="primary"
                className={classNames(styles.loginBtn)}
                onClick={handelLogin}
              >
                <LoginBtnInner isCollapsed={isCollapsed} />
              </Button>
              <Button onClick={handleSignup}>
                <RegistrationBtnInner isCollapsed={isCollapsed} />
              </Button>
            </>
          )}
        </div>
      </div>
      <LoginModal
        visible={loginModalVisible.modalVisible}
        toogleLoginModal={loginModalVisible.toogleModalWithStore}
        toogleSignUpModal={signupModalVisible.toogleModal}
        toogleForgotModal={forgotPasswordModalVisible.toogleModal}
      />
      <SignUpModal
        visible={signupModalVisible.modalVisible}
        toogleLoginModal={loginModalVisible.toogleModalWithStore}
        toogleSignUpModal={signupModalVisible.toogleModal}
      />
      {/* <ForgotPasswordModal
        visible={forgotPasswordModalVisible.modalVisible}
        toogleLoginModal={loginModalVisible.toogleModalWithStore}
        toogleForgotModal={forgotPasswordModalVisible.toogleModal}
      /> */}
    </Sider>
  )
}

export default SideMenu
