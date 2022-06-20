import React, { useEffect, useState } from 'react'
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
import { useGetUserDataMutation } from '../../services/serverApi'
import { selectOpponentId } from '../../redux/selectors/currentGameSelectors'

const { Text } = Typography

type IPlayerInfo = {
  isLobby: boolean
}

export const PlayersInfo: React.FC<IPlayerInfo> = (props) => {
  const { isLobby } = props
  const isAuth = useAppSelector(selectIsAuth)
  const username = useAppSelector(selectUsername)
  const rating = useAppSelector(selectRating)

  const opponentId = useAppSelector(selectOpponentId)

  const [getUserInfoTrigger, getUserInfoResult] = useGetUserDataMutation()
  const [opponentInfo, setOpponentInfo] = useState<{
    username: string
    rating: number
  }>()

  useEffect(() => {
    if (!isLobby && opponentId) {
      ;(async () => {
        const data = await getUserInfoTrigger(opponentId).unwrap()
        console.log(data)
        setOpponentInfo({ username: data.name, rating: data.rating })
      })()
    }
  }, [isLobby, opponentId, getUserInfoTrigger])

  return (
    <div className={classnames(styles.sidesWrapper)}>
      <div className={classnames(styles.side, isLobby && styles.hide)}>
        <Avatar shape="square" size={64} icon={<UserOutlined />} />

        <div className={styles.info}>
          <Text className={styles.username}>{opponentInfo?.username}</Text>
          <Text className={styles.rating}>{opponentInfo?.rating}</Text>
        </div>
      </div>
      <div className={styles.side}>
        <Avatar shape="square" size={64} icon={<UserOutlined />} />

        <div className={styles.info}>
          <Text className={styles.username}>{username}</Text>
          <Text className={styles.rating}>{rating}</Text>
        </div>
      </div>
    </div>
  )
}
