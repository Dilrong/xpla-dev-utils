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

const XplaConvert = () => {
  const [axpla, setAxpla] = useState(0)
  const [xpla, setXpla] = useState(0)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target
    const WEI = 10 ** 18

    switch (id) {
      case 'axpla':
        setAxpla(Number(value))
        setXpla(Number(value) / WEI)
        break
      case 'xpla':
        setAxpla(Number(value) * WEI)
        setXpla(Number(value))
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
          Convert between XPLA and aXPLA units (1 XPLA = 1,000,000 aXPLA)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="axpla">aXPLA</Label>
          <Input
            type="number"
            id="axpla"
            placeholder="1000000"
            onChange={handleChange}
            value={axpla}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="xpla">XPLA</Label>
          <Input
            type="number"
            id="xpla"
            placeholder="1"
            onChange={handleChange}
            value={xpla}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default XplaConvert
