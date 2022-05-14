import React, { useState } from 'react'
import { Layout, Menu, MenuProps } from 'antd'

import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons'
import styles from './SideMenu.module.scss'

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
  getItem('Play', 'sider_play', <PieChartOutlined />),
  getItem('Puzzles', 'sider_puzzles', <DesktopOutlined />),
]

const SideMenu: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onCollapse = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <Sider
      theme="dark"
      collapsible
      collapsed={isCollapsed}
      onCollapse={onCollapse}
      className={styles.siderWrapper}
    >
      <div className={styles.logo}>типа лого</div>
      <Menu items={items} mode="vertical" selectable={false} />
      <Menu items={items} mode="vertical" selectable={false} />
    </Sider>
  )
}

export default SideMenu
