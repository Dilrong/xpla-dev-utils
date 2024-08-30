'use client'

import { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'

const IpfsConvert = () => {
  const { ipfs } = useConfigStore()
  const [input, setInput] = useState('')
  const [http, setHttp] = useState('')

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setInput(value)
    let ipfsHash = value

    if (value.startsWith('ipfs://')) {
      ipfsHash = value.replace('ipfs://', '')
    }

    try {
      console.log(ipfsHash)
      const res = await axios.get(`${ipfs}${ipfsHash}`)

      setHttp(res.request.responseURL)
    } catch (error) {
      console.error(`IPFS convert error:`, error)
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid w-full items-center gap-1.5 space-y-2 py-4">
        <Label htmlFor="epoch">IPFS URL</Label>
        <Input
          type="string"
          id="ipfs"
          placeholder="ipfs://..."
          onChange={handleChange}
          value={input}
        />
      </div>
      <div className="space-y-2 pt-4">
        <p>
          <b>IPFS URL</b>: {http}
        </p>
        {http && <Image src={http} alt={http} width={500} height={500} />}
      </div>
    </div>
  )
}

export default IpfsConvert
