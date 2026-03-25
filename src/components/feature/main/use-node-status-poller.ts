'use client'

import { useCallback, useEffect, useState } from 'react'
import { NodeStatusInterface } from '@/lib/types/node-status.interface'

interface NodeStatusSnapshot<T> {
  metric: T
  historyHeight: number
}

interface UseNodeStatusPollerOptions<T> {
  pollMs: number
  request: () => Promise<NodeStatusSnapshot<T>>
}

export function useNodeStatusPoller<T>({
  pollMs,
  request,
}: UseNodeStatusPollerOptions<T>) {
  const [metric, setMetric] = useState<T | null>(null)
  const [history, setHistory] = useState<NodeStatusInterface[]>([])
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const poll = useCallback(async () => {
    const startTime = Date.now()

    try {
      const result = await request()
      const endTime = Date.now()

      setMetric(result.metric)
      setLastUpdated(endTime)
      setHistory((prev) => {
        const nextEntry: NodeStatusInterface = {
          height: result.historyHeight,
          success: true,
          timestamp: endTime,
          responseTime: endTime - startTime,
        }

        return [...prev, nextEntry].slice(-90)
      })
    } catch (error) {
      const endTime = Date.now()

      console.error(error)
      setLastUpdated(endTime)
      setHistory((prev) => {
        const nextEntry: NodeStatusInterface = {
          height: 0,
          success: false,
          timestamp: endTime,
          responseTime: endTime - startTime,
        }

        return [...prev, nextEntry].slice(-90)
      })
    }
  }, [request])

  useEffect(() => {
    void poll()

    const intervalId = window.setInterval(() => {
      void poll()
    }, pollMs)

    return () => window.clearInterval(intervalId)
  }, [poll, pollMs])

  return {
    history,
    lastUpdated,
    metric,
  }
}
