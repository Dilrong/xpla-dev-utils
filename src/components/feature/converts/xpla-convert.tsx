'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ChangeEvent, useState } from 'react'

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
    <>
      <div className="grid w-full items-center gap-1.5 space-y-2 py-4">
        <Label htmlFor="axpla">aXPLA</Label>
        <Input
          type="number"
          id="axpla"
          placeholder="aXPLA"
          onChange={handleChange}
          value={axpla}
        />
      </div>
      <div className="grid w-full items-center gap-1.5 space-y-2 py-4">
        <Label htmlFor="xpla">XPLA</Label>
        <Input
          type="number"
          id="xpla"
          placeholder="XPLA"
          onChange={handleChange}
          value={xpla}
        />
      </div>
    </>
  )
}

export default XplaConvert
