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
    <footer className="border-t-2 border-foreground bg-card">
      <div className="container flex max-w-screen-2xl flex-col gap-5 py-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Chain footer
          </p>
          <a
            href={`${explorer}block/${height}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {status ? (
              <span className="flex size-2.5 animate-pulse rounded-full bg-emerald-500" />
            ) : (
              <span className="flex size-2.5 animate-pulse rounded-full bg-rose-500" />
            )}
            {status
              ? `${formatWithCommas(height)} on ${network}`
              : `Endpoint offline on ${network}`}
          </a>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground md:items-end">
          <p className="max-w-md leading-6">
            Built as a stark operational surface for day-to-day XPLA
            development.
          </p>
          <Link
            href="https://github.com/Dilrong/xpla-dev-utils/issues"
            target="_blank"
            rel="noreferrer"
            className="font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:opacity-70"
          >
            Report an issue on GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
