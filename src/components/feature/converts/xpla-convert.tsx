'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChangeEvent, useState } from 'react'
import { Coins } from 'lucide-react'

const MICRO_XPLA = 1_000_000

const XplaConvert = () => {
  const [axpla, setAxpla] = useState('1000000')
  const [xpla, setXpla] = useState('1')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target

    if (!value) {
      setAxpla('')
      setXpla('')
      return
    }

    const numericValue = Number(value)

    if (Number.isNaN(numericValue)) {
      return
    }

    switch (id) {
      case 'axpla':
        setAxpla(value)
        setXpla((numericValue / MICRO_XPLA).toString())
        break
      case 'xpla':
        setAxpla((numericValue * MICRO_XPLA).toString())
        setXpla(value)
        break
      default:
        break
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="size-5" />
          XPLA Unit Converter
        </CardTitle>
        <CardDescription>
          Convert between XPLA and aXPLA units. 1 XPLA equals 1,000,000 aXPLA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
          <Label htmlFor="axpla">aXPLA</Label>
          <Input
            type="number"
            id="axpla"
            placeholder="1000000"
            onChange={handleChange}
            value={axpla}
            inputMode="numeric"
          />
        </div>
        <div className="grid w-full items-center gap-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
          <Label htmlFor="xpla">XPLA</Label>
          <Input
            type="number"
            id="xpla"
            placeholder="1"
            onChange={handleChange}
            value={xpla}
            inputMode="decimal"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default XplaConvert
