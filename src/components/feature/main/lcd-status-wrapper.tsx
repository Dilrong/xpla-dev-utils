'use client'

import { useCallback } from 'react'
import axios from 'axios'
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
      serviceLabel="Public LCD"
      summary={
        metric !== null
          ? `${formatWithCommas(metric)} blocks`
          : 'Waiting for data'
      }
      url={url}
      history={history}
      lastUpdated={lastUpdated}
    />
  )
}
