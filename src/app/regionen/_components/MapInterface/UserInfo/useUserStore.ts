import { create } from 'zustand'

export type User = {
  id: number
  displayName: string
  avatar: null | string
}

type Store = {
  currentUser: null | User
  setCurrentUser: (data: object) => void
  removeCurrentUser: () => void
}

export const useUserStore = create<Store>((set) => ({
  currentUser: null,
  setCurrentUser: (data) => set((state: any) => ({ ...state, currentUser: data })),
  removeCurrentUser: () => set((state: any) => ({ ...state, currentUser: null })),
}))
