import React, { useEffect, useMemo, useState } from 'react'
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
import {
  useGetMyUserDataMutation,
  useGetUserDataMutation,
} from '../../services/serverApi'
import {
  selectIsWaiting,
  selectOpponentId,
} from '../../redux/selectors/currentGameSelectors'
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
  const isWaiting = useAppSelector(selectIsWaiting)

  const opponentId = useAppSelector(selectOpponentId)

  const [getUserInfoTrigger, getUserInfoResult] = useGetUserDataMutation()
  const [getMyUserInfoTrigger, getMyUserInfoResult] = useGetMyUserDataMutation()
  const dispatch = useAppDispatch()
  const [opponentInfo, setOpponentInfo] = useState<{
    username: string
    rating: number
  }>()

  const { width } = useWindowDimensions()

  useEffect(() => {
    if (!isLobby && opponentId && !isWaiting && !opponentInfo) {
      getUserInfoTrigger(opponentId)
    }
  }, [isLobby, opponentId, getUserInfoTrigger, isWaiting])

  useEffect(() => {
    if (getUserInfoResult.isSuccess) {
      const { data } = getUserInfoResult
      console.log(data)
      setOpponentInfo({ username: data.name, rating: data.rating })
      getUserInfoResult.reset()
    }
  }, [getUserInfoResult])

  // useEffect(() => {
  //   ;(async () => {
  //     if (!username || !rating) {
  //       const userInfo = await getMyUserInfoTrigger('x').unwrap()
  //       dispatch(setUserInfo({ ...userInfo }))
  //     }
  //   })()
  // }, [dispatch, getMyUserInfoResult, getMyUserInfoTrigger, rating, username])

  const endUsername = useMemo(
    () => (opponentInfo?.username ? opponentInfo?.username : ''),
    [opponentInfo?.username],
  )
  const endRating = useMemo(
    () => (opponentInfo?.rating !== 0 ? opponentInfo?.rating : 0),
    [opponentInfo?.rating],
  )

  const renderUsername = useMemo(
    () => (isMy ? username : endUsername),
    [isMy, username, endUsername],
  )
  const renderRating = useMemo(
    () => (isMy ? rating : endRating),
    [endRating, isMy, rating],
  )

  const avatarSize = useMemo(() => {
    if (width < 500) return 40
    if (width < 700) return 50
    if (width < 900) return 60
    return 64
  }, [width])

  return (
    <div
      className={classnames(
        styles.side,
        isMy && styles.bottomSide,
        !isMy && styles.topSide,
        isLobby && !isMy && styles.hide,
      )}
      style={{ zIndex: '999' }}
    >
      <Avatar
        className={styles.avatar}
        shape="square"
        size={avatarSize}
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
