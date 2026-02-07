import { useEffect } from 'react'
import { useParams } from 'react-router'
import Peer from 'peerjs'
import { usePeerStore } from '../store/PeerStore'
import { useSocketStore } from '../store/SocketStore'

function Room() {
  const { id } = useParams()
  const { peer, setPeer } = usePeerStore()
  const { socket } = useSocketStore()

  useEffect(() => {
    const newPeer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/peerjs',
      secure: false,
    })

    console.log('LOGGIN NEW PEER: ', newPeer)
    newPeer.on('open', (peerId) => {
      setPeer(peerId)

      if (socket) {
        socket.emit('join-room', { roomId: id, peerId: peerId })
        socket.on('get-users', ({ roomId, participants }) => {
          console.log('Room id: ', roomId, ' & participants: ', participants)
        })
      }
    })

    return () => {
      newPeer.destroy()
    }
  }, [id, socket])

  return <div>User joined the room with id: {id}</div>
}

export default Room
