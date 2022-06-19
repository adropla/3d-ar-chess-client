type typeRoutes = {
  main: string
  play2d: string
  lobby3d: string
  play3d: string
  lobbyAR: string
  playAR: string
  settings: string
}

const ROUTES: typeRoutes = {
  main: '/',
  play2d: '/:roomId',
  lobby3d: '/3d',
  play3d: '/3d/:roomId',
  lobbyAR: '/ar',
  playAR: '/ar/:roomId',
  settings: '/settings',
}

export default ROUTES
