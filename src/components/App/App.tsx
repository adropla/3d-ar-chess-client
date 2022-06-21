import { Routes, Route, useParams } from 'react-router-dom'
import { Layout } from 'antd'

import { AuthRoute } from '../AuthRoute/AuthRoute'
import { useAppSelector } from '../../hooks/redux'

import SideMenu from '../SideMenu/SideMenu'

import 'antd/dist/antd.min.css'
import styles from './App.module.scss'
import GamePage2D from '../pages/GamePage2D'
import GamePage3D from '../pages/GamePage3D'
import GamePageAr from '../pages/GamePageAr'
import { selectIsAuth } from '../../redux/selectors/authSelectors'
import ROUTES from '../../constants/routes'
import AccountSetting from '../AccountSetting/AccountSetting'

const { Content } = Layout

const App = (): JSX.Element => {
  const isAuth = useAppSelector(selectIsAuth)
  const { roomIdParam } = useParams()
  const wrapperStyle = roomIdParam ? { padding: '20px' } : {}
  return (
    <Layout className={styles.layoutWrapper}>
      <SideMenu />
      <Content className={styles.contentWrapper} style={wrapperStyle}>
        <Routes>
          <Route path="/" element={<GamePage2D isLobby />} />
          <Route
            path="/game/:roomIdParam"
            element={<GamePage2D isLobby={false} />}
          />

          <Route path="/3d" element={<GamePage3D isLobby />} />
          <Route
            path="/3d/game/:roomIdParam"
            element={<GamePage3D isLobby={false} />}
          />

          <Route path="/ar" element={<GamePageAr isLobby />} />
          <Route
            path="/ar/game/:roomIdParam"
            element={<GamePageAr isLobby={false} />}
          />

          <Route element={<AuthRoute isAuthenticated={isAuth} />}>
            <Route path={ROUTES.settings} element={<AccountSetting />} />
          </Route>

          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>There`&apos;`s nothing here!</p>
              </main>
            }
          />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
