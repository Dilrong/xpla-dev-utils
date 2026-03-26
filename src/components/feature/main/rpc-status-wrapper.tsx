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

export default function RpcStatusWrapper({ title, url }: Props) {
  const { blockTime } = useConfigStore()

  const request = useCallback(async () => {
    const response = await axios.post(url, {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
    })
    const height = Number.parseInt(response.data.result.number, 16)

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
      serviceLabel="Public RPC"
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
