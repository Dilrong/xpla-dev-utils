'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
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
import {
  getContractFamilyLabel,
  getContractStandardLabel,
} from '@/lib/xpla/contract/profile'
import { isValidXplaAddress } from '@/lib/xpla/contract/metadata'

const QueryContract = () => {
  const { lcd } = useConfigStore()
  const { address, profile } = useContractStore()
  const { toast } = useToast()
  const [message, setMessage] = useState('{}')
  const [result, setResult] = useState({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const lastAutoMessageRef = useRef('{}')

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

    if (!isValidXplaAddress(address)) {
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

      try {
        JSON.parse(message)
      } catch {
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
          const errorMessage =
            err.response.data?.message ||
            err.response.data?.error ||
            'Query failed'

          if (errorMessage.includes('decoding bech32 failed')) {
            setError('Invalid contract address format. Please check the address.')
          } else if (errorMessage.includes('contract not found')) {
            setError('Contract not found. Please verify the contract address.')
          } else {
            setError(errorMessage)
          }
        } else if (err.request) {
          setError('Network error. Please check your connection.')
        } else {
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
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const examples = useMemo(() => profile?.queryExamples ?? [], [profile])
  const defaultExample = examples[0]

  useEffect(() => {
    const nextAutoMessage = examples[0]?.payload ?? '{}'

    setMessage(nextAutoMessage)
    lastAutoMessageRef.current = nextAutoMessage
    setResult({})
    setError('')
  }, [address, examples])

  const loadExample = (query: string) => {
    setMessage(query)
    lastAutoMessageRef.current = query
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
          <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
            <Label htmlFor="contract-address">Contract Address</Label>
            <Input
              id="contract-address"
              value={address || ''}
              placeholder="Search for a contract first..."
              disabled
              className="bg-background"
            />
            <p className="text-sm text-muted-foreground">
              The address is populated from the contract search panel above.
            </p>
            {profile ? (
              <p className="text-sm text-muted-foreground">
                Detected profile: {getContractStandardLabel(profile.standard)}{' '}
                {getContractFamilyLabel(profile.family).toLowerCase()}.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="query-message">Query Message (JSON)</Label>
            <Textarea
              id="query-message"
              placeholder="Enter your query message in JSON format..."
              value={message}
              onChange={handleChange}
              className="font-mono text-sm"
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Write the raw JSON query message exactly as the contract expects.
            </p>
            {defaultExample ? (
              <p className="text-sm text-muted-foreground">
                The first live example, {defaultExample.name.toLowerCase()}, is
                already loaded.
              </p>
            ) : null}
          </div>

          {examples.length ? (
            <details className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background">
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    Change prefilled example
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {examples.length} live examples
                  </p>
                </div>
              </summary>
              <div className="grid grid-cols-1 gap-2 border-t border-border p-4 md:grid-cols-2">
                {examples.map((example) => (
                  <Button
                    key={example.name}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example.payload)}
                    className="h-auto justify-start rounded-[calc(var(--radius)-0.2rem)] p-3 text-left"
                  >
                    <div>
                      <div className="text-sm font-medium">{example.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {example.description}
                      </div>
                      <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
                        {example.payload}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </details>
          ) : (
            <div className="rounded-[calc(var(--radius)-0.2rem)] border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
              No standard query examples were inferred for this contract. Use
              the raw JSON message field directly.
            </div>
          )}

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
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
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
            <div className="max-h-[28rem] overflow-auto rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
              <JSONPretty id="json-pretty" data={result} className="text-sm" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default QueryContract
