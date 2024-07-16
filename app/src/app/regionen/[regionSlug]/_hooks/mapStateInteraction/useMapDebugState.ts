import { isDev, isStaging } from 'src/app/_components/utils/isEnv'
import { create } from 'zustand'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

export type Store = StoreDebugInfo & StoreUseDebugLayer & StoreUseDebugCachelessTiles

type StoreDebugInfo = {
  showDebugInfo: boolean
  setShowDebugInfo: (showDebugInfo: Store['showDebugInfo']) => void
  toggleShowDebugInfo: () => void
}

type StoreUseDebugLayer = {
  useDebugLayerStyles: boolean
  setUseDebugLayerStyles: (useDebugLayerStyles: Store['useDebugLayerStyles']) => void
}

type StoreUseDebugCachelessTiles = {
  useDebugCachelessTiles: boolean
  setUseDebugCachelessTiles: (useDebugCachelessTiles: Store['useDebugCachelessTiles']) => void
}

export const useMapDebugState = create<Store>((set, get) => ({
  showDebugInfo: isDev || isStaging,
  setShowDebugInfo: (showDebugInfo) => set({ showDebugInfo }),
  toggleShowDebugInfo: () => {
    const { showDebugInfo } = get()
    set({ showDebugInfo: !showDebugInfo })
  },

  useDebugLayerStyles: false,
  setUseDebugLayerStyles: (useDebugLayerStyles) => set({ useDebugLayerStyles }),

  useDebugCachelessTiles: false,
  setUseDebugCachelessTiles: (useDebugCachelessTiles) => set({ useDebugCachelessTiles }),
}))
