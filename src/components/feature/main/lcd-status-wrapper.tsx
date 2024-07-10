'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import StatusBar from './status-bar'
import { useConfigStore } from '@/lib/store/config-store'
import { NodeStatusInterface } from '@/lib/types/node-status.interface'
import StatusCard from '@/components/feature/main/status-card'

interface Props {
  title: string
  url: string
}

const now = new Date()

export default function LcdStatusWrapper({ title, url }: Props) {
  const { blockTime } = useConfigStore()
  const [block, setBlock] = useState(0)
  const [timer, setTimer] = useState(0)
  const [date, setDate] = useState(now)
  const [history, setHistory] = useState<NodeStatusInterface[]>([])

  useEffect(() => {
    const intervalId = setInterval(getLatestBlock, timer)
    return () => clearInterval(intervalId)
  }, [timer])

  const getLatestBlock = async () => {
    setTimer(blockTime)
    const startTime = Date.now()
    try {
      const res = await axios.get(
        `${url}/cosmos/base/tendermint/v1beta1/blocks/latest`,
      )
      const endTime = Date.now()
      const responseTime = endTime - startTime
      setHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            height: res.data.block.header.height,
            success: true,
            timestamp: endTime,
            responseTime: responseTime,
          },
        ]
        return newHistory.slice(-90)
      })
      setBlock(res.data.block.header.height)
    } catch (error) {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      setHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            height: 0,
            success: false,
            timestamp: endTime,
            responseTime: responseTime,
          },
        ]
        console.error(error)
        return newHistory.slice(-90)
      })
    }
  }

  return (
    <StatusCard
      title={title}
      content={
        <section>
          <p className="mb-2 text-sm">Public</p>
          <StatusBar history={history} />
        </section>
      }
      footer={
        <div className="flex w-full justify-between">
          <p className="text-sm text-muted-foreground">{block}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(date).toLocaleTimeString()}
          </p>
        </div>
      }
    />
  )
}
