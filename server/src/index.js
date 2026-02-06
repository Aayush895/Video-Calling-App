import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'
import { serverPort } from '../src/config/serverConfig.js'
import { roomHandler } from './handlers/roomHandler.js'

const app = express()
const port = serverPort

app.use(
  cors({
    origin: ['http://localhost:5173'] ,
  }),
)

// Initial Setup for socket.io
const nodeServer = createServer(app)
const socketIO = new Server(nodeServer, {
  cors: {
    origin: ['http://localhost:5173'],
  },
})

// Creating a namespace for video call

const videoCallNamespace = socketIO.of('/video-call')

videoCallNamespace.on('connection', (socket) => {
  console.log('A new user connected')

  // Segregating the logic for rooms in a handler function
  roomHandler(socket)

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

nodeServer.listen(port, () => {
  console.log('Server is running on port: ', port)
})
