'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

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
    <div className="space-y-2">
      <p className="py-4">
        The current Unix epoch time is <b>{current}</b>
      </p>
      <div className="grid w-full max-w-sm items-center gap-1.5 space-y-2 py-4">
        <Label htmlFor="epoch">Epoch</Label>
        <Input
          type="number"
          id="epoch"
          placeholder="Epoch"
          onChange={handleChange}
          value={epoch}
        />
      </div>
      <div className="space-y-2 pt-4">
        <p>
          <b>GMT</b>: {gmt}
        </p>
        <p>
          <b>LOCAL</b>: {tz}
        </p>
      </div>
    </div>
  )
}

export default EpochConvert
