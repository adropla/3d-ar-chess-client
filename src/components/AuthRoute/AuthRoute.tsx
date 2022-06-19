/* eslint-disable react/prop-types */
import { Navigate, Outlet, RouteProps } from 'react-router-dom'

import ROUTES from '../../constants/routes'
import { useAppDispatch } from '../../hooks/redux'
import { toogleLoginModalVisible } from '../../redux/reducers/loginModalSlice'

export interface IAuthRoute extends RouteProps {
  isAuthenticated: boolean
}

const AuthRoute = ({ isAuthenticated }: IAuthRoute) => {
  const dispatch = useAppDispatch()
  if (!isAuthenticated) {
    dispatch(toogleLoginModalVisible())
    return <Navigate to={ROUTES.main} />
  }
  return <Outlet />
}

export { AuthRoute }
