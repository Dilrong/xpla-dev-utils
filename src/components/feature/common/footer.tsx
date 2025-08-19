'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { formatWithCommas } from '@/lib/utils'

const Footer = () => {
  const { lcd, explorer, network } = useConfigStore()

  const [height, setHeight] = useState(0)
  const [status, setStatus] = useState(false)

  const getLatestBlock = useCallback(async () => {
    try {
      const res = await axios.get(
        `${lcd}/cosmos/base/tendermint/v1beta1/blocks/latest`,
      )
      setHeight(res.data.block.last_commit.height)
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
    <footer className="container flex max-w-screen-2xl justify-center py-6">
      <div className="flex-col items-center justify-between md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          <a
            href={`${explorer}block/${height}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center font-medium"
          >
            {status ? (
              <span className="me-2 flex size-3 animate-pulse rounded-full bg-green-500" />
            ) : (
              <span className="me-2 flex size-3 animate-pulse rounded-full bg-red-500" />
            )}
            {formatWithCommas(height).toLocaleString()} in {network}
          </a>
        </p>
        <p className="text-balance text-sm leading-loose text-muted-foreground md:text-left">
          If you have an issue?{' '}
          <a
            href="https://github.com/Dilrong/xpla-dev-utils/issues"
            target="_blank"
            rel="noreferrer"
            className="flex items-center font-medium hover:font-bold"
          >
            Visit GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
