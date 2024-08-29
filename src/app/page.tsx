import LcdStatusWrapper from '@/components/feature/main/lcd-status-wrapper'
import { getNetworkConfig, Network } from '@/lib/config/block-chain'
import RpcStatusWrapper from '@/components/feature/main/rpc-status-wrapper'
import FcdStatusWrapper from '@/components/feature/main/fcd-status-wrapper'

export default function Home() {
  return (
    <div className="container relative max-w-screen-2xl">
      <section className="py-6">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight"></h1>
        </div>
        <div className="space-y-2 pt-8">
          <LcdStatusWrapper
            title="Mainnet LCD"
            url={getNetworkConfig(Network.mainnet).lcd}
          />
          <RpcStatusWrapper
            title="Mainnet RPC"
            url={getNetworkConfig(Network.mainnet).rpc}
          />
          <FcdStatusWrapper
            title="Mainnet FCD"
            url={getNetworkConfig(Network.mainnet).fcd}
          />
          <LcdStatusWrapper
            title="Testnet LCD"
            url={getNetworkConfig(Network.testnet).lcd}
          />
          <RpcStatusWrapper
            title="Testnet RPC"
            url={getNetworkConfig(Network.testnet).rpc}
          />
          <FcdStatusWrapper
            title="Testnet FCD"
            url={getNetworkConfig(Network.testnet).fcd}
          />
        </div>
      </section>
    </div>
  )
}
