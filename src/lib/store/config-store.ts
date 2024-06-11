import { create } from 'zustand'
import { Lcd, Network } from '@/lib/types/config'

type ConfigStore = {
  net: Network
  lcd: Lcd
  setNet: (net: Network, lcd: Lcd) => void
}

const useConfigStore = create<ConfigStore>((set) => ({
  net: 'testnet',
  lcd: Lcd.testnet,
  setNet: (net, lcd) => set(() => ({ net: net, lcd: lcd })),
}))

export { useConfigStore }
