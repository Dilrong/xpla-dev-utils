'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Clock } from 'lucide-react'

dayjs.extend(utc)

const EpochConvert = () => {
  const [current, setCurrent] = useState(dayjs().unix())
  const [epoch, setEpoch] = useState('')
  const [gmt, setGmt] = useState<any>(null)
  const [tz, setTz] = useState<any>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrent(dayjs().unix())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const datetime = dayjs.unix(Number(value))

    setEpoch(value)
    setGmt(dayjs(datetime).utc().format('YYYY-MM-DD HH:mm:ss Z'))
    setTz(dayjs(datetime).format('YYYY-MM-DD HH:mm:ss Z'))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Epoch Time Converter
        </CardTitle>
        <CardDescription>
          Convert Unix epoch timestamps to human-readable dates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm">
            Current Unix epoch time:{' '}
            <span className="font-mono font-bold">{current}</span>
          </p>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="epoch">Epoch Timestamp</Label>
          <Input
            type="number"
            id="epoch"
            placeholder="1704067200"
            onChange={handleChange}
            value={epoch}
          />
        </div>

        {gmt && tz && (
          <div className="space-y-2 rounded-lg bg-muted p-4">
            <p className="text-sm">
              <span className="font-semibold">GMT:</span>{' '}
              <span className="font-mono">{gmt}</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Local:</span>{' '}
              <span className="font-mono">{tz}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EpochConvert
