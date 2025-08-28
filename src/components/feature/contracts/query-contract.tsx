'use client'

import { FormEvent, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { useContractStore } from '@/lib/store/contract-store'
import { Button } from '@/components/ui/button'
import JSONPretty from 'react-json-pretty'
import { bytesToBase64 } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Search, Copy, CheckCircle } from 'lucide-react'

const QueryContract = () => {
  const { lcd } = useConfigStore()
  const { address } = useContractStore()
  const { toast } = useToast()
  const [message, setMessage] = useState('{"balance":{"address":"xpla1..."}}')
  const [result, setResult] = useState({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget
    setMessage(value)
  }

  const handleSubmit = async () => {
    if (!address) {
      toast({
        title: 'No contract address',
        description: 'Please search for a contract first.',
        variant: 'destructive',
      })
      return
    }

    // 주소 형식 검증
    if (!address.startsWith('xpla1')) {
      toast({
        title: 'Invalid contract address',
        description: 'Contract address must be a valid XPLA address.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)
      setError('')

      // JSON 메시지 유효성 검증
      try {
        JSON.parse(message)
      } catch (parseError) {
        setError('Invalid JSON format. Please check your query message.')
        toast({
          title: 'Invalid JSON',
          description: 'Please check your query message format.',
          variant: 'destructive',
        })
        return
      }

      const utf8Bytes = new TextEncoder().encode(message)
      const base64Str = bytesToBase64(utf8Bytes)

      const res = await axios.get(
        `${lcd}/cosmwasm/wasm/v1/contract/${address}/smart/${base64Str}`,
      )

      if (res.data && res.data.data !== undefined) {
        setResult(res.data.data)
        toast({
          title: 'Query successful',
          description: 'Contract query completed successfully.',
        })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // 서버 에러 응답
          const errorMessage =
            err.response.data?.message ||
            err.response.data?.error ||
            'Query failed'
          setError(errorMessage)

          if (errorMessage.includes('decoding bech32 failed')) {
            setError(
              'Invalid contract address format. Please check the address.',
            )
          } else if (errorMessage.includes('contract not found')) {
            setError('Contract not found. Please verify the contract address.')
          } else {
            setError(errorMessage)
          }
        } else if (err.request) {
          // 네트워크 에러
          setError('Network error. Please check your connection.')
        } else {
          // 기타 에러
          setError('An error occurred while querying the contract.')
        }
      } else {
        setError('An unexpected error occurred.')
      }

      console.error('Query error:', err)

      toast({
        title: 'Query failed',
        description:
          'Failed to query the contract. Please check the error details.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      setCopied(true)
      toast({
        title: 'Copied to clipboard',
        description: 'Query result copied successfully.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const examples = [
    { name: 'Balance Query', query: '{"balance":{"address":"xpla1..."}}' },
    { name: 'Token Info', query: '{"token_info":{}}' },
    {
      name: 'All Accounts',
      query: '{"all_accounts":{"start_after":"xpla1...","limit":10}}',
    },
    { name: 'Owner Of', query: '{"owner_of":{"token_id":"1"}}' },
    { name: 'Nft Info', query: '{"nft_info":{"token_id":"1"}}' },
  ]

  const loadExample = (query: string) => {
    setMessage(query)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Contract Query
          </CardTitle>
          <CardDescription>
            Query smart contract state using JSON messages. The message will be
            automatically converted to base64.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contract-address">Contract Address</Label>
            <Input
              id="contract-address"
              value={address || ''}
              placeholder="Search for a contract first..."
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="query-message">Query Message (JSON)</Label>
            <Textarea
              id="query-message"
              placeholder="Enter your query message in JSON format..."
              value={message}
              onChange={handleChange}
              className="font-mono text-sm"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Quick Examples</Label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example.query)}
                  className="h-auto justify-start p-2 text-left"
                >
                  <div>
                    <div className="text-xs font-medium">{example.name}</div>
                    <div className="truncate font-mono text-xs text-muted-foreground">
                      {example.query}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading || !address}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Querying...
              </>
            ) : (
              <>
                <Search className="mr-2 size-4" />
                Submit Query
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {Object.keys(result).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Query Result
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="h-8"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 size-4 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 size-4" />
                    Copy
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4">
              <JSONPretty id="json-pretty" data={result} className="text-sm" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default QueryContract
