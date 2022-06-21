import { Button, Tabs } from 'antd'
import styled, { css } from 'styled-components'

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

const base = css`
  font-family: 'Teko', sans-serif;
  position: absolute;
  text-transform: uppercase;
  font-weight: 900;
  font-variant-numeric: slashed-zero tabular-nums;
  line-height: 1em;
  pointer-events: none;
  color: black;
`

const LowerRight = styled.div`
  ${base}
  text-align: right;
  bottom: 10px;
  left: 20px;
  font-size: 2em;
  pointer-events: all;
  color: wheat;
  width: max-content;
  height: max-content;
  z-index: 1000;

  cursor: pointer;
  & > a {
    color: wheat;
    text-decoration: none;
  }
  @media only screen and (max-width: 900px) {
    font-size: 1.5em;
  }
`

const UpperRight = styled.div`
  ${base}
  text-align: right;
  top: 10px;
  right: 10px;
  font-size: 2em;
  pointer-events: all;
  cursor: pointer;
  & > a {
    color: indianred;
    text-decoration: none;
  }
  @media only screen and (max-width: 900px) {
    font-size: 1.5em;
  }
`

const SecondaryButton = styled(Button)`
  &&& {
    background-color: rgba(27, 126, 151, 0.466);
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
  giveUp: () => void
  offerDraw: () => void
  isGameRunning: boolean
}

export const GameOptionsAR: React.FC<TGameOptions> = ({
  playViaLink,
  giveUp,
  offerDraw,
  isGameRunning,
}) => {
  return (
    <UpperRight>
      {isGameRunning && (
        <>
          <SecondaryButton onClick={giveUp}>Сдаться</SecondaryButton>
          <SecondaryButton onClick={offerDraw}>
            Предложить ничью
          </SecondaryButton>
        </>
      )}
      {!isGameRunning && (
        <>
          {/* <SecondaryButton>Играть с компьютером</SecondaryButton> */}
          <SecondaryButton onClick={playViaLink}>
            Играть с другом по ссылке
          </SecondaryButton>
        </>
      )}
    </UpperRight>
  )
}
