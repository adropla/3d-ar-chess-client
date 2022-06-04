import React, { useEffect, useState } from 'react'

const getBoardWidth = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  set?: React.Dispatch<React.SetStateAction<number | undefined>>,
) => {
  if (ref.current) {
    const wrapperWidth = ref.current.getBoundingClientRect().width
    const wrapperHeight = ref.current.getBoundingClientRect().height
    const boardWidthLocal =
      wrapperWidth > wrapperHeight ? wrapperHeight : wrapperWidth
    if (set) {
      set(boardWidthLocal)
    }
  }
}

export const useBoardWidth = (
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>,
) => {
  const [boardWidth, setBoardWidth] = useState<number>()

  useEffect(() => {
    const eventFunc = () => getBoardWidth(wrapperRef, setBoardWidth)
    eventFunc()
    window.addEventListener('resize', eventFunc)
    return () => window.removeEventListener('resize', eventFunc)
  }, [wrapperRef])

  return {
    boardWidth,
  }
}
