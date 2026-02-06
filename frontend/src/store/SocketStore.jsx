import { create } from 'zustand'

export const useSocketStore = create((set, get) => ({
  socket: null,
  setSocket: (incomingSocket) => {
    if (get().socket) return

    set({ incomingSocket })
  },
}))
