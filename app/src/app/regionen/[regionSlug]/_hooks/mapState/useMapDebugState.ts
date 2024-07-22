import { isDev, isStaging } from 'src/app/_components/utils/isEnv'
import { create } from 'zustand'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

export type Store = {
  showDebugInfo: boolean
  useDebugLayerStyles: boolean
  useDebugCachelessTiles: boolean
  actions: {
    setShowDebugInfo: (showDebugInfo: Store['showDebugInfo']) => void
    toggleShowDebugInfo: () => void
    setUseDebugLayerStyles: (useDebugLayerStyles: Store['useDebugLayerStyles']) => void
    setUseDebugCachelessTiles: (useDebugCachelessTiles: Store['useDebugCachelessTiles']) => void
  }
}

const useMapDebugState = create<Store>((set, get) => ({
  showDebugInfo: isDev || isStaging,
  useDebugLayerStyles: false,
  useDebugCachelessTiles: false,
  actions: {
    setShowDebugInfo: (showDebugInfo) => set({ showDebugInfo }),
    toggleShowDebugInfo: () => {
      const { showDebugInfo } = get()
      set({ showDebugInfo: !showDebugInfo })
    },
    setUseDebugLayerStyles: (useDebugLayerStyles) => set({ useDebugLayerStyles }),
    setUseDebugCachelessTiles: (useDebugCachelessTiles) => set({ useDebugCachelessTiles }),
  },
}))

export const useMapDebugShowDebugInfo = () => useMapDebugState((state) => state.showDebugInfo)
export const useMapDebugUseDebugLayerStyles = () =>
  useMapDebugState((state) => state.useDebugLayerStyles)
export const useMapDebugUseDebugCachelessTiles = () =>
  useMapDebugState((state) => state.useDebugCachelessTiles)

export const useMapDebugActions = () => useMapDebugState((state) => state.actions)
