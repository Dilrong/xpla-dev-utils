'use client'

import { useCallback } from 'react'
import axios from 'axios'
import StatusBar from './status-bar'
import { useConfigStore } from '@/lib/store/config-store'
import StatusCard from '@/components/feature/main/status-card'
import { formatWithCommas } from '@/lib/utils'
import { useNodeStatusPoller } from './use-node-status-poller'

interface Props {
  title: string
  url: string
}

export default function LcdStatusWrapper({ title, url }: Props) {
  const { blockTime } = useConfigStore()

  const request = useCallback(async () => {
    const response = await axios.get(
      `${url}/cosmos/base/tendermint/v1beta1/blocks/latest`,
    )
    const height = Number(response.data.block.header.height)

    return {
      historyHeight: height,
      metric: height,
    }
  }, [url])

  const { history, lastUpdated, metric } = useNodeStatusPoller({
    pollMs: blockTime,
    request,
  })

  return (
    <StatusCard
      title={title}
      content={
        <section>
          <p className="mb-2 text-sm text-muted-foreground">Public endpoint</p>
          <StatusBar history={history} />
        </section>
      }
      footer={
        <div className="flex w-full justify-between">
          <p className="text-sm text-muted-foreground">
            {metric !== null ? `${formatWithCommas(metric)} blocks` : 'Waiting for data'}
          </p>
          <p className="text-sm text-muted-foreground">
            {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '-'}
          </p>
        </div>
      }
    />
  )
}
