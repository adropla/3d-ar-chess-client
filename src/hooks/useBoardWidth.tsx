import React, { useEffect, useState } from 'react'
import useWindowDimensions from './useWindowDimension'

export const useBoardWidth = (
  wrapperRef: React.MutableRefObject<HTMLDivElement>,
) => {
  const [boardWidth, setBoardWidth] = useState<number>()
  const windowDimensions = useWindowDimensions()

  useEffect(() => {
    if (wrapperRef.current) {
      const wrapperWidth = wrapperRef.current.getBoundingClientRect().width
      const wrapperHeight = wrapperRef.current.getBoundingClientRect().height
      // console.log(wrapperHeight)
      // console.log(wrapperWidth)
      const boardWidthLocal =
        wrapperWidth > wrapperHeight ? wrapperHeight : wrapperWidth
      setBoardWidth(boardWidthLocal)
    }
  }, [wrapperRef, windowDimensions])
  return {
    boardWidth,
  }
}
