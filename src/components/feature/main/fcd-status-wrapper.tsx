'use client'

import { useCallback } from 'react'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import StatusCard from '@/components/feature/main/status-card'
import dayjs from 'dayjs'
import { formatWithCommas } from '@/lib/utils'
import { useNodeStatusPoller } from './use-node-status-poller'

interface Props {
  title: string
  url: string
}

export default function FcdStatusWrapper({ title, url }: Props) {
  const { blockTime } = useConfigStore()

  const request = useCallback(async () => {
    const response = await axios.get(`${url}txs/gas_prices`)

    return {
      historyHeight: dayjs().unix(),
      metric: Number(response.data.axpla),
    }
  }, [url])

  const { history, lastUpdated, metric } = useNodeStatusPoller({
    pollMs: blockTime,
    request,
  })

  return (
    <StatusCard
      title={title}
      serviceLabel="Public FCD"
      summary={
        metric !== null
          ? `${formatWithCommas(metric)} axpla`
          : 'Waiting for data'
      }
      url={url}
      history={history}
      lastUpdated={lastUpdated}
    />
  )
}
