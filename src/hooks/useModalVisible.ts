/* eslint-disable no-unused-vars */
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { Dispatch, SetStateAction, useState } from 'react'
import { Modal } from '../redux/reducers/loginModalSlice'
import { useAppDispatch } from './redux'

type IUseModalVisible = (
  init: boolean,
  toogleModalStore?: ActionCreatorWithoutPayload<string>,
) => {
  modalVisible: boolean
  toogleModal: () => boolean
  setModalVisible: Dispatch<SetStateAction<boolean>>
  toogleModalWithStore: () => void
}

const useModalVisible: IUseModalVisible = (init, toogleModalStore) => {
  const [modalVisible, setModalVisible] = useState(init)

  const dispatch = useAppDispatch()

  const toogleModal = () => {
    setModalVisible((prevState) => !prevState)
    return modalVisible
  }

  const toogleModalWithStore = () => {
    toogleModal()
    if (toogleModalStore) dispatch(toogleModalStore())
  }

  return {
    modalVisible,
    toogleModal,
    setModalVisible,
    toogleModalWithStore,
  }
}

export default useModalVisible
