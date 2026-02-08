import { v4 as UUIDv4 } from 'uuid'

const rooms = {}
export function roomHandler(socket) {
  const roomId = UUIDv4()

  function createRoom() {
    socket.join(roomId)
    console.log('Room is created with id: ', roomId)
    rooms[roomId] = []
    socket.emit('room-created', { roomId })
  }

  function joinRoom({ joinedrRoomId, peerId }) {
    if (rooms[joinedrRoomId]) {
      rooms[joinedrRoomId].push(peerId)
      socket.join(joinedrRoomId)

      socket.on('ready', () => {
        socket.to(joinedrRoomId).emit('user-joined', { peerId })
      })

      console.log('Users in rooms: ', rooms)

      socket.emit('get-users', {
        rooms,
        participants: rooms[joinedrRoomId],
      })
    }
  }

  socket.on('create-room', createRoom)
  socket.on('join-room', joinRoom)
}
