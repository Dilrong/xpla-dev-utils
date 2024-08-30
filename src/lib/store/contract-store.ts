import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ContractStore = {
  address: string
  historyList: string[]
  favoriteList: string[]
  setAddress: (address: string) => void
  setHistoryList: (address: string) => void
  setFavoriteList: (address: string) => void
}

const useContractStore = create(
  persist<ContractStore>(
    (set) => ({
      address: '',
      historyList: [],
      favoriteList: [],
      setAddress: (address: string) => set(() => ({ address: address })),
      setHistoryList: (address: string) => set(() => ({ address: address })),
      setFavoriteList: (address: string) =>
        set((state) => ({
          favoriteList: [...state.favoriteList, address],
        })),
    }),
    {
      name: 'contract-storage',
    }
  )
)

export { useContractStore }