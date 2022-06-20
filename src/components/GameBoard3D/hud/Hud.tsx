import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { FullScreenHandle } from 'react-full-screen'
import Icon, { ExpandOutlined } from '@ant-design/icons'

import { ReactComponent as SoundOff } from '../../../assets/soundOff.svg'
import { ReactComponent as SoundOn } from '../../../assets/soundOn.svg'

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

const UpperLeft = styled.div`
  ${base}
  top: 40px;
  left: 50px;
  font-size: 2em;
  pointer-events: all;
  cursor: pointer;
  @media only screen and (max-width: 900px) {
    font-size: 1.5em;
  }
`

const UpperRight = styled.div`
  ${base}
  text-align: right;
  top: 40px;
  right: 50px;
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

const LowerRight = styled.div`
  ${base}
  text-align: right;
  bottom: 40px;
  right: 50px;
  font-size: 2em;
  pointer-events: all;
  background-color: rgba(59, 53, 53, 0.7);
  color: wheat;
  width: 250px;
  height: 300px;

  cursor: pointer;
  & > a {
    color: wheat;
    text-decoration: none;
  }
  @media only screen and (max-width: 900px) {
    font-size: 1.5em;
  }
`

const SoundOnIcon = () => (
  <Icon style={{ fontSize: '30px' }} component={SoundOn} />
)

const SoundOffIcon = () => (
  <Icon style={{ fontSize: '28px', fontWeight: '800' }} component={SoundOff} />
)

export const Hud = ({
  handleFullScreen,
}: {
  handleFullScreen: FullScreenHandle
}) => {
  const { enter, exit } = handleFullScreen
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isSound, setIsSound] = useState(true)
  const handleOnClick = () => {
    if (isFullScreen) {
      setIsFullScreen(false)
      return exit()
    }
    setIsFullScreen(true)
    return enter()
  }
  return (
    <>
      <UpperRight
        style={{ marginRight: '50px' }}
        onClick={() => setIsSound((prev) => !prev)}
      >
        {isSound ? <SoundOnIcon /> : <SoundOffIcon />}
      </UpperRight>
      <UpperRight onClick={handleOnClick}>
        <ExpandOutlined />
      </UpperRight>
      {/* <LowerRight>12312321</LowerRight> */}
    </>
  )
}
