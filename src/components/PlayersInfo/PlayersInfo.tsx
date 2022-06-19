import React from 'react'
import { Avatar, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import classnames from 'classnames'

import {
  selectIsAuth,
  selectRating,
  selectUsername,
} from '../../redux/selectors/authSelectors'
import { useAppSelector } from '../../hooks/redux'

import styles from './PlayersInfo.module.scss'

const { Text } = Typography

type IPlayerInfo = {
  isLobby: boolean
}

export const PlayersInfo: React.FC<IPlayerInfo> = (props) => {
  const { isLobby } = props
  const isAuth = useAppSelector(selectIsAuth)
  const username = useAppSelector(selectUsername)
  const rating = useAppSelector(selectRating)
  return (
    <div className={classnames(styles.sidesWrapper)}>
      <div className={classnames(styles.opponentSide, !true && styles.hide)}>
        <Avatar shape="square" size={64} icon={<UserOutlined />} />

        <div className={styles.info}>
          <Text className={styles.username}>{username}</Text>
          <Text className={styles.rating}>{rating}</Text>
        </div>
      </div>
      <div className={styles.mySide}>
        <Avatar shape="square" size={64} icon={<UserOutlined />} />

        <div className={styles.info}>
          <Text className={styles.username}>{username}</Text>
          <Text className={styles.rating}>{rating}</Text>
        </div>
      </div>
    </div>
  )
}
