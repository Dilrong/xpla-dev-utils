import { create } from 'zustand'

type ContractStore = {
  address: string
  setAddress: (address: string) => void
}

const useContractStore = create<ContractStore>((set) => ({
  address: '',
  setAddress: (address: string) => set(() => ({ address: address })),
}))

export { useContractStore }
