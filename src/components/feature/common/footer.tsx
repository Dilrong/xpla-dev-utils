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
    <footer className="border-t border-border/50">
      <div className="container flex max-w-screen-2xl flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-loose text-muted-foreground">
          <a
            href={`${explorer}block/${height}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {status ? (
              <span className="flex size-2.5 animate-pulse rounded-full bg-emerald-500" />
            ) : (
              <span className="flex size-2.5 animate-pulse rounded-full bg-rose-500" />
            )}
            {status ? `${formatWithCommas(height)} on ${network}` : `Endpoint offline on ${network}`}
          </a>
        </p>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground md:items-end">
          <p>Built for day-to-day XPLA developer operations.</p>
          <Link
            href="https://github.com/Dilrong/xpla-dev-utils/issues"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Report an issue on GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
