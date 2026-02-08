import { Routes, Route } from 'react-router'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import Home from './components/Home'
import { useSocketStore } from './store/SocketStore'
import Room from './components/Room'

function App() {
  const { socket, setSocket } = useSocketStore()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (!socket) {
      const socketInstance = io(`${backendUrl}/video-call`)
      setSocket(socketInstance)
    }
  }, [socket, setSocket, backendUrl])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:id" element={<Room />} />
    </Routes>
  )
}
export default App
