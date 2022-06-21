import React, { useEffect, useState } from 'react'
import { Avatar, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import classnames from 'classnames'

import {
  selectIsAuth,
  selectRating,
  selectUsername,
} from '../../redux/selectors/authSelectors'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'

import styles from './PlayersInfo.module.scss'
import { useGetUserDataMutation } from '../../services/serverApi'
import { selectOpponentId } from '../../redux/selectors/currentGameSelectors'
import { setUserInfo } from '../../redux/reducers/authSlice'

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
  const dispatch = useAppDispatch()
  const [opponentInfo, setOpponentInfo] = useState<{
    username: string
    rating: number
  }>()

  useEffect(() => {
    if (!isLobby && opponentId) {
      ;(async () => {
        const data = await getUserInfoTrigger(opponentId).unwrap()
        // console.log(data)
        setOpponentInfo({ username: data.name, rating: data.rating })
      })()
    }
  }, [isLobby, opponentId, getUserInfoTrigger])

  useEffect(() => {
    ;(async () => {
      const userInfo = await getUserInfoTrigger('x').unwrap()
      dispatch(setUserInfo({ ...userInfo }))
    })()
  }, [dispatch, getUserInfoTrigger])

  return (
    <div className={classnames(styles.sidesWrapper)}>
      <div
        className={classnames(
          styles.side,
          styles.topSide,
          isLobby && styles.hide,
        )}
      >
        <Avatar shape="square" size={64} icon={<UserOutlined />} />

        <div className={styles.info}>
          <Text className={styles.username}>{opponentInfo?.username}</Text>
          <Text className={styles.rating}>{opponentInfo?.rating}</Text>
        </div>
      </div>
      <div className={classnames(styles.side, styles.bottomSide)}>
        <Avatar shape="square" size={64} icon={<UserOutlined />} />

        <div className={styles.info}>
          <Text className={styles.username}>{username}</Text>
          {isAuth && <Text className={styles.rating}>{rating}</Text>}
        </div>
      </div>
    </div>
  )
}
