'use client'

import { useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { decodeBech32Address, encodeBech32Prefix, bytesToHex } from '@/lib/utils'

const ADDRESS_VARIANTS = [
  { label: 'Account', prefix: 'xpla' },
  { label: 'Validator Operator', prefix: 'xplavaloper' },
  { label: 'Validator Consensus', prefix: 'xplavalcons' },
]

function OutputRow({
  label,
  value,
  onCopy,
}: {
  label: string
  value: string
  onCopy: (value: string) => void
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="break-all font-mono text-sm leading-6 text-muted-foreground">
            {value}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => onCopy(value)}
        >
          Copy
        </Button>
      </div>
    </div>
  )
}

export default function AddressLab() {
  const [value, setValue] = useState('')

  const decoded = useMemo(
    () => decodeBech32Address(value.trim()),
    [value],
  )

  const variants = useMemo(() => {
    if (!decoded) {
      return []
    }

    return ADDRESS_VARIANTS.map((variant) => ({
      ...variant,
      value: encodeBech32Prefix(decoded.words, variant.prefix),
    }))
  }, [decoded])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle>Address Lab</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="bech32-address"
              className="text-sm font-medium text-foreground"
            >
              Bech32 address
            </label>
            <Input
              id="bech32-address"
              placeholder="xpla1..."
              value={value}
              onChange={(event) => setValue(event.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          {!value.trim() ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-6 text-sm text-muted-foreground">
              Paste address.
            </div>
          ) : null}

          {value.trim() && !decoded ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              This value is not a valid bech32 address.
            </div>
          ) : null}

          {decoded ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <div className="space-y-3">
                {variants.map((variant) => (
                  <OutputRow
                    key={variant.prefix}
                    label={variant.label}
                    value={variant.value}
                    onCopy={handleCopy}
                  />
                ))}
              </div>

              <Card className="border-border/70 bg-background/70">
                <CardHeader>
                  <CardTitle className="text-base">Payload details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Detected prefix</p>
                    <p className="mt-1 font-mono">{decoded.prefix}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Byte length</p>
                    <p className="mt-1 font-mono">{decoded.bytes.length}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Hex payload</p>
                    <p className="mt-1 break-all font-mono leading-6">
                      {bytesToHex(decoded.bytes)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
