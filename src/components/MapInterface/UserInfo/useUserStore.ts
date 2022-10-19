import create from 'zustand'

interface User {
  id: number
  displayName: string
  avatar: null | string
}

interface Store {
  currentUser: null | User
  setCurrentUser: (data: object) => void
  removeCurrentUser: () => void
}

const useUserStore = create<Store>((set) => ({
  currentUser: null,
  setCurrentUser: (data) =>
    set((state: any) => ({ ...state, currentUser: data })),
  removeCurrentUser: () =>
    set((state: any) => ({ ...state, currentUser: null })),
}))

export default useUserStore
