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
import useWindowDimensions from '../../hooks/useWindowDimension'

const { Text } = Typography

type IPlayerInfo = {
  isLobby: boolean
  isMy: boolean
}

export const PlayersInfo: React.FC<IPlayerInfo> = (props) => {
  const { isLobby, isMy } = props
  const username = useAppSelector(selectUsername)
  const rating = useAppSelector(selectRating)

  const opponentId = useAppSelector(selectOpponentId)

  const [getUserInfoTrigger, getUserInfoResult] = useGetUserDataMutation()
  const dispatch = useAppDispatch()
  const [opponentInfo, setOpponentInfo] = useState<{
    username: string
    rating: number
  }>()

  const { width } = useWindowDimensions()

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

  const endUsername = opponentInfo?.username
    ? opponentInfo?.username
    : `Anonymous${Math.round(Math.random() * 100000)}`
  const endRating = opponentInfo?.rating !== 0 ? opponentInfo?.rating : 0

  const renderUsername = isMy ? username : endUsername
  const renderRating = isMy ? rating : endRating

  return (
    <div
      className={classnames(
        styles.side,
        isMy && styles.bottomSide,
        !isMy && styles.topSide,
        isLobby && !isMy && styles.hide,
      )}
      style={{ zIndex: '1000' }}
    >
      <Avatar
        className={styles.avatar}
        shape="square"
        size={width < 500 ? 40 : 64}
        icon={<UserOutlined />}
      />

      <div className={styles.info}>
        <Text className={styles.username}>{renderUsername}</Text>
        <Text className={styles.rating}>
          {renderRating === 0 ? '' : renderRating}
        </Text>
      </div>
    </div>
  )
}
