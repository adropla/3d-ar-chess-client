import classNames from 'classnames'

import { Button, Select, Tabs } from 'antd'
import styled from 'styled-components'

import { v4 as uuidv4 } from 'uuid'

import styles from './GameOptions.module.scss'

const { Option } = Select
const { TabPane } = Tabs

const RightMenuTabs = styled(Tabs)`
  &&& {
    height: 100%;
    .ant-tabs-nav-list {
      width: 100%;
      .ant-tabs-nav {
        margin: 0;
      }
      .ant-tabs-tab {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: peru;
        width: 100%;
        font-weight: bold;
        &.ant-tabs-tab-active {
          background-color: #f0d9b5;
          .ant-tabs-tab-btn {
            color: black;
          }
        }
      }
    }
    .ant-tabs-content-holder .ant-tabs-content {
      height: 100%;
      .ant-tabs-tabpane {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
`

const PrimaryButton = styled(Button)`
  &&& {
    background-color: peru;
    margin-top: 16px;
    font-size: 20px;
    font-weight: bold;
    height: fit-content;
    &:hover {
      color: black;
      outline: none;
      border: 0;
    }
  }
`

const SecondaryButton = styled(Button)`
  &&& {
    background-color: rgba(122, 62, 2, 0.5);
    margin-top: 16px;
    font-size: 20px;
    font-weight: bold;
    height: fit-content;
    width: 100%;
    &:hover {
      color: black;
      outline: none;
      border: 0;
    }
  }
`

export type TGameOptions = {
  playViaLink: () => void
  navigateTo2D: () => void
  navigateTo3D: () => void
  navigateToAR: () => void
  isGameRunning: boolean
}

const GameOptions: React.FC<TGameOptions> = ({
  playViaLink,
  navigateTo2D,
  navigateTo3D,
  navigateToAR,
  isGameRunning,
}) => {
  return (
    <div className={classNames(styles.wrapper)}>
      <RightMenuTabs type="card">
        {isGameRunning && (
          <TabPane tab="Game" key={uuidv4()}>
            <div>12321321321</div>
          </TabPane>
        )}
        <TabPane tab="New Game" key={uuidv4()}>
          <div>
            <div style={{ padding: '16px' }}>
              <Select style={{ width: '100%' }} defaultValue="lucy">
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>

              <PrimaryButton block>Play with Opponent</PrimaryButton>
            </div>

            <div className={classNames(styles.middleContent)}>
              <SecondaryButton>Play with Computer</SecondaryButton>
              <SecondaryButton onClick={playViaLink}>
                Play with Friend via link
              </SecondaryButton>
            </div>
          </div>

          <div className={classNames(styles.bottomContent)}>
            <SecondaryButton onClick={navigateTo2D}>2D</SecondaryButton>
            <SecondaryButton onClick={navigateTo3D}>3D</SecondaryButton>
            <SecondaryButton onClick={navigateToAR}>AR</SecondaryButton>
          </div>
        </TabPane>
        <TabPane tab="Games" key={uuidv4()}>
          Games
        </TabPane>
        <TabPane tab="Players" key={uuidv4()}>
          Player
        </TabPane>
      </RightMenuTabs>
    </div>
  )
}

export default GameOptions
