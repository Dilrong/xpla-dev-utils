import { create } from 'zustand'
import { Lcd, Network } from '@/lib/types/config'

type ConfigStore = {
  net: Network
  lcd: Lcd
  explorer: string
  setExplorer: (explorer: string) => void
  setNet: (net: Network, lcd: Lcd) => void
}

const useConfigStore = create<ConfigStore>((set) => ({
  net: 'testnet',
  lcd: Lcd.testnet,
  explorer: 'https://explorer.xpla.io/testnet/',
  setNet: (net, lcd) => set(() => ({ net: net, lcd: lcd })),
  setExplorer: (explorer: string) => set(() => ({ explorer })),
}))

export { useConfigStore }
