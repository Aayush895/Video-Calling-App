export async function fetchLocalMediaStream(setPeerStream) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })
  setPeerStream(stream)
}

export const handleGetUsers = ({ rooms, participants }) => {
  console.log('Room: ', rooms)
  console.log('Participants: ', participants)
}

// This function initiates the call with the newly joined user
/**
 * handleUserJoined
 *
 * Called by: EXISTING users who are already in the room
 * When: A NEW user joins the room (triggered by 'user-joined' socket event)
 *
 * What it does:
 * - YOU (existing user) initiate a call to the newly joined user
 * - YOU send YOUR video/audio stream to them
 * - YOU wait to receive THEIR video/audio stream back
 * - When their stream arrives, add it to the store so you can see their video
 *
 * Think of it as: "Someone new joined, let me call them to start the video chat"
 */
export const handleUserJoined = (
  peer,
  peerId,
  peerStream,
  addPeerStream,
  removePeerStream,
) => {
  const intiatingOutgoingCall = peer.call(peerId, peerStream)
  console.log('Calling the newly joined peer: ', peerId)

  intiatingOutgoingCall.on('stream', (remoteStream) => {
    addPeerStream(peerId, remoteStream)
  })

  intiatingOutgoingCall.on('close', () => {
    console.log('Outgoing call closed with peer:', peerId)
    removePeerStream(peerId)
  })

  intiatingOutgoingCall.on('error', (err) => {
    console.error('Call error with peer:', peerId, err)
    removePeerStream(peerId)
  })
}

/**
 * handleIncomingCall
 *
 * Called by: NEW users who just joined the room
 * When: EXISTING users call you (triggered by 'call' peer event)
 *
 * What it does:
 * - EXISTING users call YOU when you join
 * - YOU answer their call by sending YOUR video/audio stream back
 * - YOU receive THEIR video/audio stream
 * - When their stream arrives, add it to the store so you can see their video
 *
 * Think of it as: "Someone is calling me, let me answer and start the video chat"
 */
export const handleIncomingCall = (
  call,
  peerStream,
  addPeerStream,
  removePeerStream,
) => {
  console.log('Receiving a call from other peers')

  // Answer the incoming call with our local stream
  call.answer(peerStream)

  // When we receive the caller's stream
  call.on('stream', (remoteStream) => {
    addPeerStream(call.peer, remoteStream)
  })

  // Handle when the call connection closes
  call.on('close', () => {
    console.log('Incoming call closed from peer:', call.peer)
    removePeerStream(call.peer)
  })

  // Handle call errors
  call.on('error', (err) => {
    console.error('Incoming call error from peer:', call.peer, err)
    removePeerStream(call.peer)
  })
}
