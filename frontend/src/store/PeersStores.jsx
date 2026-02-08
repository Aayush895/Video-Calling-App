import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Peers Store
 *
 * Manages remote peer streams for the video call application.
 * Stores MediaStream objects from other participants in the room,
 * allowing the UI to display multiple video feeds.
 *
 * Store Structure:
 * peers: {
 *   'peer-id-1': MediaStream,
 *   'peer-id-2': MediaStream,
 *   ...
 * }
 */
export const userPeersStore = create(
  devtools((set) => ({
    // Object to store all remote peers' media streams, keyed by peer ID
    peers: {},

    /**
     * addPeerStream
     *
     * Purpose:
     * - Adds or updates a peer's media stream in the store
     *
     * When called:
     * - When we receive a remote peer's video/audio stream via WebRTC
     * - Triggered by the 'stream' event on PeerJS call objects
     *
     * Parameters:
     * @param {string} peerId - Unique identifier for the peer
     * @param {MediaStream} stream - The peer's video/audio MediaStream object
     *
     * Result:
     * - The peer's video feed becomes available for rendering in the UI
     */
    addPeerStream: (peerId, stream) => {
      set((state) => ({
        peers: { ...state.peers, [peerId]: stream },
      }))
    },

    /**
     * removePeerStream
     *
     * Purpose:
     * - Removes a peer's stream from the store when they disconnect
     *
     * When called:
     * - When a peer closes their connection (closes tab/browser)
     * - When a WebRTC call encounters an error or times out
     * - Triggered by 'close' or 'error' events on PeerJS call objects
     *
     * Parameters:
     * @param {string} peerId - Unique identifier of the peer to remove
     *
     * Result:
     * - The peer's video feed is removed from the UI
     * - React automatically unmounts the video component
     */
    removePeerStream: (peerId) => {
      set((state) => {
        const newPeers = { ...state.peers }
        delete newPeers[peerId]
        return { peers: newPeers }
      })
    },

    /**
     * clearPeers
     *
     * Purpose:
     * - Removes all peer streams at once
     *
     * When called:
     * - When leaving the room (component unmount)
     * - When resetting the call state
     *
     * Result:
     * - All remote video feeds are removed from the UI
     * - Store is reset to initial empty state
     */
    clearPeers: () => set({ peers: {} }),
  })),
)
