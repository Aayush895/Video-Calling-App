import { useEffect } from 'react'
import { io } from 'socket.io-client'
import StartMeet from './StartMeet'
import { useSocketStore } from '../store/SocketStore'

function Home() {
  const { socket, setSocket } = useSocketStore()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (socket) {
      return
    }

    const socketInstance = io(`${backendUrl}/video-call`)
    setSocket(socketInstance)
  }, [])

  return (
    <div className="flex items-center justify-center bg-gray-800 h-screen">
      <StartMeet />
    </div>
  )
}
export default Home
