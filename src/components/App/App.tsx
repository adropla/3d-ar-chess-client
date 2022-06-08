import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'

import SideMenu from '../SideMenu/SideMenu'

import 'antd/dist/antd.min.css'
import styles from './App.module.scss'
import GamePage2D from '../pages/GamePage2D'
import GamePage3D from '../pages/GamePage3D'
import GamePageAr from '../pages/GamePageAr'

const { Content } = Layout

const App = (): JSX.Element => {
  return (
    <Layout className={styles.layoutWrapper}>
      <SideMenu />
      <Content className={styles.contentWrapper}>
        <Routes>
          <Route path="/" element={<GamePage2D isLobby />} />
          <Route
            path="/game/:roomIdParam"
            element={<GamePage2D isLobby={false} />}
          />

          <Route path="/3d" element={<GamePage3D isLobby />}>
            <Route
              path="/3d/game/:roomIdParam"
              element={<GamePage3D isLobby={false} />}
            />
          </Route>
          <Route path="/ar" element={<GamePageAr />} />
          {/* <Route
              path="*"
              element={
                <main style={{ padding: '1rem' }}>
                  <p>There`&apos;`s nothing here!</p>
                </main>
              }
            /> */}
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
