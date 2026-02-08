import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const usePeerStore = create(
  devtools((set) => ({
    peer: null,
    setPeer: (incomingPeer) => {
      set({ peer: incomingPeer })
    },
  })),
)
