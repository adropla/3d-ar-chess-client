import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'

import Simple3D from '../Simple3D'
import SideMenu from '../SideMenu/SideMenu'

import 'antd/dist/antd.min.css'
import styles from './App.module.scss'
import GamePage from '../pages/GamePage'

const { Content } = Layout

const App = (): JSX.Element => {
  return (
    <Layout className={styles.layoutWrapper}>
      <SideMenu />
      <Content className={styles.contentWrapper}>
        <Routes>
          <Route path="/" element={<GamePage type="lobby" />} />
          <Route path="/game/:roomIdParam" element={<GamePage type="game" />} />
          <Route path="/3d" element={<Simple3D />} />
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
