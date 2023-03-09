import { isDev } from '@components/utils/isEnv'
import { create } from 'zustand'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

type Store = StoreDebugInfo & StoreUseDebugLayer

type StoreDebugInfo = {
  showDebugInfo: boolean
  setShowDebugInfo: (showDebugInfo: Store['showDebugInfo']) => void
}

type StoreUseDebugLayer = {
  useDebugLayerStyles: boolean
  setUseDebugLayerStyles: (
    useDebugLayerStyles: Store['useDebugLayerStyles']
  ) => void
}

export const useMapDebugState = create<Store>((set, _get) => ({
  showDebugInfo: isDev,
  setShowDebugInfo: (showDebugInfo) => set({ showDebugInfo }),

  useDebugLayerStyles: false,
  setUseDebugLayerStyles: (useDebugLayerStyles) => set({ useDebugLayerStyles }),
}))
