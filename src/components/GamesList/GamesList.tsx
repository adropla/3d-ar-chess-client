import { List } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import { selectGames } from '../../redux/selectors/authSelectors'
import {
  useGameIsOverMutation,
  useGetGamesMutation,
  useJoinLinkGameMutation,
} from '../../services/serverApi'

export const GamesList = () => {
  const gamesFromStore = useAppSelector(selectGames)
  const [getGamesTrigger, gatGamesResult] = useGetGamesMutation()
  const [gamesIds, setGamesIds] = useState<string[]>()
  const [gameIsOverTrigger, gameIsOverResult] = useGameIsOverMutation()
  const [joinLinkGameTrigger, joinLinkGameResult] = useJoinLinkGameMutation()
  const [gamesIsOverData, setGamesIsOverData] = useState<any[]>()
  useEffect(() => {
    getGamesTrigger('')
  }, [getGamesTrigger])
  useEffect(() => {
    if (gatGamesResult.isSuccess) {
      setGamesIds(gatGamesResult.data)
    }
  }, [gatGamesResult])

  return (
    <List
      size="small"
      bordered
      dataSource={gamesIds}
      renderItem={(item) => (
        <List.Item>
          <Link to={`/game/${item}`}>{item}</Link>
        </List.Item>
      )}
    />
  )
}
