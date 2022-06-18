import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Layout, Menu, MenuProps } from 'antd'
import classNames from 'classnames'

import {
  UserAddOutlined,
  LoginOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import styles from './SideMenu.module.scss'
import logo from '../../assets/logo.png'

const { Sider } = Layout

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
  return isCollapsed ? <LoginOutlined /> : <>Login</>
}

const RegistrationBtnInner = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return isCollapsed ? <UserAddOutlined /> : <>Registration</>
}

const SideMenu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const onCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [setIsCollapsed])

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
          <Button type="primary" className={classNames(styles.loginBtn)}>
            <LoginBtnInner isCollapsed={isCollapsed} />
          </Button>
          <Button>
            <RegistrationBtnInner isCollapsed={isCollapsed} />
          </Button>
        </div>
      </div>
    </Sider>
  )
}

export default SideMenu
