import { useEffect } from 'react'
import { useParams } from 'react-router'
import Peer from 'peerjs'
import { v4 as UUIDv4 } from 'uuid'
import { usePeerStore } from '../store/PeerStore'
import { useSocketStore } from '../store/SocketStore'

function Room() {
  const { id } = useParams()
  const { peer, setPeer } = usePeerStore()
  const { socket } = useSocketStore()

  useEffect(() => {
    console.log('New peer in new room')
    const userId = UUIDv4()
    const newPeer = new Peer(userId, {
      host: 'localhost',
      port: 9000,
      path: '/peerjs',
      secure: false,
    })

    newPeer.on('open', (id) => {
      setPeer(id)
    })

    return () => {
      newPeer.destroy()
    }
  }, [setPeer])

  useEffect(() => {
    if (!peer || !socket || !id) {
      return
    }
    const currentSocket = socket
    currentSocket.emit('join-room', { joinedrRoomId: id, peerId: peer })

    const handleGetUsers = ({ rooms, participants }) => {
      console.log('Room: ', rooms)
      console.log('Participants: ', participants)
    }

    currentSocket.on('get-users', handleGetUsers)

    return () => {
      if (currentSocket && typeof currentSocket.off === 'function') {
        currentSocket.off('get-users', handleGetUsers)
      } else {
        console.log('Skipped cleanup - socket not available')
      }
    }
  }, [peer, socket, id])

  return <div>User joined the room with id: {id}</div>
}

export default Room
