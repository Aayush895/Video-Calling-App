import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Peer from 'peerjs'
import { v4 as UUIDv4 } from 'uuid'
import { usePeerStore } from '../store/PeerStore'
import { useSocketStore } from '../store/SocketStore'
import { userPeersStore } from '../store/PeersStores'
import UserFeed from './UserFeed'
import {
  fetchLocalMediaStream,
  handleGetUsers,
  handleIncomingCall,
  handleUserJoined,
} from '../utils/fetchLocalMediaStream'

function Room() {
  const [peerStream, setPeerStream] = useState(null)
  const { id } = useParams()
  const { peer, setPeer } = usePeerStore()
  const { socket } = useSocketStore()
  const { peers, addPeerStream, removePeerStream } = userPeersStore()

  useEffect(() => {
    console.log('New peer in new room')
    const userId = UUIDv4()
    const newPeer = new Peer(userId, {
      host: 'localhost',
      port: 9000,
      path: '/peerjs',
      secure: false,
    })

    newPeer.on('open', () => {
      setPeer(newPeer)
      fetchLocalMediaStream(setPeerStream)
    })

    return () => {
      newPeer.destroy()
    }
  }, [setPeer])

  useEffect(() => {
    if (!peer || !socket || !id) {
      return
    }

    // Notify server that we're joining this room with our peer ID
    const currentSocket = socket
    currentSocket.emit('join-room', { joinedrRoomId: id, peerId: peer.id })

    // Listen for server response with current participants in the room
    currentSocket.on('get-users', ({ rooms, participants }) => {
      handleGetUsers({ rooms, participants })
    })

    return () => {
      if (currentSocket && typeof currentSocket.off === 'function') {
        currentSocket.off('get-users', handleGetUsers)
      } else {
        console.log('Skipped cleanup - socket not available')
      }
    }
  }, [peer, socket, id])

  useEffect(() => {
    if (!peer || !peerStream || !socket) return

    const onUserJoined = ({ peerId }) => {
      // Below function is responsible for initiating a call when a new user joins
      handleUserJoined(
        peer,
        peerId,
        peerStream,
        addPeerStream,
        removePeerStream,
      )
    }

    // Listen for when new users join the room (server notifies us)
    socket.on('user-joined', onUserJoined)

    // Handle incoming calls from newly joined users when we join the room
    function onCall(call) {
      handleIncomingCall(call, peerStream, addPeerStream, removePeerStream)
    }

    peer.on('call', onCall)
    socket.emit('ready')

    return () => {
      if (socket && typeof socket.off === 'function') {
        socket.off('user-joined', onUserJoined)
      }
    }
  }, [peer, peerStream, socket, addPeerStream, removePeerStream])

  return (
    <div>
      room : {id}
      <br />
      Your own user feed:
      <UserFeed stream={peerStream} />
      <div>
        Other Users feed:
        {Object.keys(peers).map((peerId) => (
          <>
            <UserFeed key={peerId} stream={peers[peerId]} />
          </>
        ))}
      </div>
    </div>
  )
}

export default Room
