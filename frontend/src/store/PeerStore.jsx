import { create } from 'zustand'

export const usePeerStore = create((set) => ({
  peer: null,
  setPeer: (incomingPeer) => {
    set({ peer: incomingPeer })
  },
}))
