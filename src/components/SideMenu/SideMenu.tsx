import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import { v4 as uuidv4 } from 'uuid'
import Icon, {
  UserAddOutlined,
  LoginOutlined,
  PlayCircleOutlined,
  LogoutOutlined,
  UserOutlined,
  CodeSandboxOutlined,
} from '@ant-design/icons'
import styles from './SideMenu.module.scss'
import logo from '../../assets/logo.png'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { selectLoginModalVisible } from '../../redux/selectors/loginModalSelectors'
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

import { ReactComponent as ArSvg } from '../../assets/ar.svg'
import { selectRoomId } from '../../redux/selectors/currentGameSelectors'

const ArIcon = () => (
  <Icon style={{ fontSize: '28px', fontWeight: '800' }} component={ArSvg} />
)

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

const useItemWithCustomLink = (roomIdParam: string | null) => {
  const [stateItems, setStateItems] = useState<string>()

  useEffect(() => {
    const additionalLink = roomIdParam ? `game/${roomIdParam}` : ''
    setStateItems(additionalLink)
    console.log(additionalLink)
  }, [roomIdParam])

  const items: MenuItem[] = useMemo(
    () => [
      getItem(
        <Link to={`/${stateItems}`}>
          <Text
            style={{
              fontSize: '14px',
              marginBottom: '12px',
            }}
          >
            Играть 2D
          </Text>
        </Link>,
        'sider_play2d',
        <Link
          to={`/${stateItems}`}
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        >
          <PlayCircleOutlined style={{ fontSize: '25px' }} />
        </Link>,
      ),
      getItem(
        <Link to={`/3d/${stateItems}`}>
          {' '}
          <Text
            style={{
              fontSize: '14px',
              marginBottom: '12px',
            }}
          >
            3D
          </Text>
        </Link>,
        'sider_play3d',
        <Link
          to={`/3d/${stateItems}`}
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        >
          <CodeSandboxOutlined style={{ fontSize: '25px' }} />
        </Link>,
      ),
      getItem(
        <Link to={`/ar/${stateItems}`}>
          {' '}
          <Text
            style={{
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            AR
          </Text>
        </Link>,
        'sider_playAr',
        <Link
          to={`/ar/${stateItems}`}
          style={{
            display: ' inline-block',
            verticalAlign: 'middle',
          }}
        >
          <ArIcon />
        </Link>,
      ),
    ],
    [stateItems],
  )

  return items
}

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
  const roomIdParam = useAppSelector(selectRoomId)
  const items = useItemWithCustomLink(roomIdParam)

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
