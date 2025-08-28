'use client'

import { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { Link } from 'lucide-react'

const IpfsConvert = () => {
  const { ipfs } = useConfigStore()
  const [input, setInput] = useState('')
  const [http, setHttp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setInput(value)
    let ipfsHash = value

    if (value.startsWith('ipfs://')) {
      ipfsHash = value.replace('ipfs://', '')
    }

    if (!ipfsHash) return

    try {
      setIsLoading(true)
      const res = await axios.get(`${ipfs}${ipfsHash}`)
      setHttp(res.request.responseURL)
    } catch (error) {
      console.error(`IPFS convert error:`, error)
      setHttp('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="size-5" />
          IPFS Gateway Converter
        </CardTitle>
        <CardDescription>
          Convert IPFS hashes to HTTP URLs using IPFS gateway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="ipfs">IPFS Hash or URL</Label>
          <Input
            type="string"
            id="ipfs"
            placeholder="ipfs://QmHash... or QmHash..."
            onChange={handleChange}
            value={input}
          />
        </div>

        {isLoading && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Converting...</p>
          </div>
        )}

        {http && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                <span className="font-semibold">HTTP URL:</span>
              </p>
              <p className="break-all font-mono text-sm">{http}</p>
            </div>

            <div className="rounded-lg border p-4">
              <Image
                src={http}
                alt="IPFS Content"
                width={500}
                height={500}
                className="h-auto max-w-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default IpfsConvert
