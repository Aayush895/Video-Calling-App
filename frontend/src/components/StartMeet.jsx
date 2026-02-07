import { useNavigate } from 'react-router'
import { useSocketStore } from '../store/SocketStore'

function StartMeet() {
  const { socket } = useSocketStore()
  const navigate = useNavigate()

  function createRoom() {
    if (socket) {
      socket.emit('create-room')
      socket.on('room-created', ({ roomId }) => {
        navigate(`/room/${roomId}`)
      })
    }
  }

  return (
    <button className="btn rounded-full btn-secondary" onClick={createRoom}>
      Click here to join a room and start a call!!!
    </button>
  )
}
export default StartMeet
