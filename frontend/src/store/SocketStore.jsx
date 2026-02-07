import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useSocketStore = create(
  devtools((set, get) => ({
    socket: null,
    setSocket: (incomingSocket) => {
      if (get().socket) return

      set({ socket: incomingSocket })
    },
  })),
)
