import { v4 as UUIDv4 } from 'uuid'

export function roomHandler(socket) {
  const rooms = {}
  const roomId = UUIDv4()

  function createRoom() {
    socket.join(roomId)
    console.log('Room is created with id: ', roomId)
    rooms[roomId] = []
    socket.emit('room-created', { roomId })
  }

  function joinRoom({ roomId, peerId }) {
    if (rooms[roomId]) {
      rooms[roomId].push(peerId)
      socket.join(roomId)

      socket.on('ready', () => {
        socket.to(roomId).emit('user-joined', { peerId })
      })

      console.log('Users in rooms: ', rooms)

      socket.emit('get-users', {
        roomId,
        participants: rooms[roomId],
      })
    }
  }

  socket.on('create-room', createRoom)
  socket.on('join-room', joinRoom)
}
