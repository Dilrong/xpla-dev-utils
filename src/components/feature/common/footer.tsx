'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { formatWithCommas } from '@/lib/utils'
import Link from 'next/link'

const Footer = () => {
  const { lcd, explorer, network } = useConfigStore()

  const [height, setHeight] = useState(0)
  const [status, setStatus] = useState(false)

  const getLatestBlock = useCallback(async () => {
    try {
      const res = await axios.get(
        `${lcd}/cosmos/base/tendermint/v1beta1/blocks/latest`,
      )
      setHeight(Number(res.data.block.header.height))
      setStatus(true)
    } catch (err) {
      setStatus(false)
    }
  }, [lcd])

  useEffect(() => {
    getLatestBlock()
    const intervalId = setInterval(() => {
      getLatestBlock()
    }, 6000)

    return () => clearInterval(intervalId)
  }, [getLatestBlock])

  return (
    <footer className="border-t border-border/70 bg-background/85">
      <div className="container flex max-w-screen-2xl flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
        <a
          href={`${explorer}block/${height}`}
          target="_blank"
          rel="noreferrer"
          className="underline-motion inline-flex items-center gap-3 py-1 text-sm tracking-[-0.02em] text-foreground transition-colors hover:text-foreground/[0.76]"
        >
          {status
            ? `${formatWithCommas(height)} on ${network}`
            : `Offline on ${network}`}
        </a>
        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground md:items-end">
          <Link
            href="https://github.com/Dilrong/xpla-dev-utils/issues"
            target="_blank"
            rel="noreferrer"
            className="underline-motion font-medium text-foreground transition-colors hover:text-foreground/[0.76]"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
