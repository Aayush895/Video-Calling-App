import { v4 as UUIDv4 } from 'uuid'

export function roomHandler(socket) {
  const roomId = UUIDv4()

  function createRoom() {
    socket.join(roomId)
    console.log('Room is created with id: ', roomId)
    socket.emit('room-created', { roomId })
  }

  function joinRoom() {}

  socket.on('create-room', createRoom)
  socket.on('join-room', joinRoom)
}
