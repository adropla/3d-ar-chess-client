import { io } from 'socket.io-client'

const URL = 'http://localhost:5005/chess-room'

export const socket = io(URL)

export const mySocket = { id: undefined }

socket.on('hostJoined', (statusUpdate) => {
  console.log(
    `A new game has been created! UserId: ${statusUpdate.userId}, Game id: ${statusUpdate.roomId} Socket id: ${statusUpdate.mySocketId}`,
  )
  mySocket.id = statusUpdate.mySocketId
})
