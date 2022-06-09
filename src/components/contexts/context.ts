/* eslint-disable no-undef */
import { createContext } from 'react'
import { Object3D, Event } from 'three'

export const ArFuncContext = createContext<{
  ref: Object3D<Event> | undefined
}>({ ref: undefined })
