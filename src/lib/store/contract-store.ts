import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ContractSnapshot } from '@/lib/xpla/contract/metadata'
import { ContractProfile } from '@/lib/xpla/contract/profile'

type ContractStore = {
  address: string
  historyList: string[]
  favoriteList: string[]
  snapshot: ContractSnapshot | null
  profile: ContractProfile | null
  setAddress: (address: string) => void
  setSelectedContract: (params: {
    address: string
    snapshot: ContractSnapshot
    profile: ContractProfile
  }) => void
  clearSelectedContract: () => void
  setHistoryList: (address: string) => void
  setFavoriteList: (address: string) => void
  removeFromHistory: (address: string) => void
  removeFromFavorites: (address: string) => void
  clearHistory: () => void
  clearFavorites: () => void
}

type PersistedContractStore = Pick<
  ContractStore,
  'address' | 'historyList' | 'favoriteList'
>

const useContractStore = create(
  persist<ContractStore, [], [], PersistedContractStore>(
    (set, get) => ({
      address: '',
      historyList: [],
      favoriteList: [],
      snapshot: null,
      profile: null,
      setAddress: (address: string) => set({ address }),
      setSelectedContract: ({ address, snapshot, profile }) =>
        set({
          address,
          snapshot,
          profile,
        }),
      clearSelectedContract: () =>
        set({
          address: '',
          snapshot: null,
          profile: null,
        }),
      setHistoryList: (address: string) => {
        const state = get()
        const newHistoryList = [...state.historyList]

        // 이미 존재하는 주소라면 제거
        const existingIndex = newHistoryList.indexOf(address)
        if (existingIndex > -1) {
          newHistoryList.splice(existingIndex, 1)
        }

        // 새 주소를 맨 앞에 추가
        newHistoryList.unshift(address)

        // 최대 5개만 유지
        if (newHistoryList.length > 5) {
          newHistoryList.splice(5)
        }

        set({ historyList: newHistoryList })
      },
      setFavoriteList: (address: string) => {
        const state = get()
        const newFavoriteList = [...state.favoriteList]

        // 이미 존재하는 주소라면 제거
        const existingIndex = newFavoriteList.indexOf(address)
        if (existingIndex > -1) {
          newFavoriteList.splice(existingIndex, 1)
        }

        // 새 주소를 맨 앞에 추가
        newFavoriteList.unshift(address)

        // 최대 10개만 유지
        if (newFavoriteList.length > 10) {
          newFavoriteList.splice(10)
        }

        set({ favoriteList: newFavoriteList })
      },
      removeFromHistory: (address: string) => {
        const state = get()
        const newHistoryList = state.historyList.filter(
          (addr) => addr !== address,
        )
        set({ historyList: newHistoryList })
      },
      removeFromFavorites: (address: string) => {
        const state = get()
        const newFavoriteList = state.favoriteList.filter(
          (addr) => addr !== address,
        )
        set({ favoriteList: newFavoriteList })
      },
      clearHistory: () => set({ historyList: [] }),
      clearFavorites: () => set({ favoriteList: [] }),
    }),
    {
      name: 'contract-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        address: state.address,
        historyList: state.historyList,
        favoriteList: state.favoriteList,
      }),
    },
  ),
)

export { useContractStore }
