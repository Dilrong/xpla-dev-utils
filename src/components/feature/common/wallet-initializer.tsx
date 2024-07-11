'use client'

import { useEffect, useState } from 'react'
import { getChainOptions, WalletProvider } from '@xpla/wallet-provider'

interface Props {
  children?: React.ReactNode
}

const WalletInitializer = ({ children }: Props) => {
  const [renderComponent, setRenderComponent] = useState(<></>)

  useEffect(() => {
    getChainOptions().then((options) => {
      if (typeof window !== 'undefined') {
        setRenderComponent(
          <WalletProvider
            walletConnectChainIds={options.walletConnectChainIds}
            defaultNetwork={options.defaultNetwork}
          >
            {children}
          </WalletProvider>,
        )
      }
    })
  }, [])

  return renderComponent
}

export default WalletInitializer
