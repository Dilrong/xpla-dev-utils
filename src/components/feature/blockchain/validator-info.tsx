'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Validator {
  operator_address: string
  consensus_pubkey: {
    '@type': string
    key: string
  }
  jailed: boolean
  status: string
  tokens: string
  delegator_shares: string
  description: {
    moniker: string
    identity: string
    website: string
    security_contact: string
    details: string
  }
  unbonding_height: string
  unbonding_time: string
  commission: {
    commission_rates: {
      rate: string
      max_rate: string
      max_change_rate: string
    }
    update_time: string
  }
  min_self_delegation: string
}

interface ValidatorSet {
  block_height: string
  validators: Array<{
    address: string
    pub_key: {
      '@type': string
      key: string
    }
    voting_power: string
    proposer_priority: string
  }>
}

export function ValidatorInfo() {
  const { lcd, explorer } = useConfigStore()
  const { toast } = useToast()
  const [validators, setValidators] = useState<Validator[]>([])
  const [validatorSet, setValidatorSet] = useState<ValidatorSet | null>(null)
  const [searchAddress, setSearchAddress] = useState('')
  const [searchedValidator, setSearchedValidator] = useState<Validator | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const fetchValidators = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${lcd}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED`,
      )
      setValidators(response.data.validators)
    } catch (error) {
      console.error('Failed to fetch validators:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch validator information.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [lcd, toast])

  const fetchValidatorSet = useCallback(async () => {
    try {
      const response = await axios.get(
        `${lcd}/cosmos/base/tendermint/v1beta1/validatorsets/latest`,
      )
      setValidatorSet(response.data)
    } catch (error) {
      console.error('Failed to fetch validator set:', error)
    }
  }, [lcd])

  const searchValidator = async () => {
    if (!searchAddress.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a validator address.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSearching(true)
      const response = await axios.get(
        `${lcd}/cosmos/staking/v1beta1/validators/${searchAddress}`,
      )
      setSearchedValidator(response.data.validator)
      toast({
        title: 'Success',
        description: 'Validator found successfully.',
      })
    } catch (error) {
      console.error('Failed to search validator:', error)
      setSearchedValidator(null)
      toast({
        title: 'Error',
        description: 'Validator not found or invalid address.',
        variant: 'destructive',
      })
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    void fetchValidators()
    void fetchValidatorSet()
    const interval = setInterval(() => {
      void fetchValidators()
      void fetchValidatorSet()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchValidatorSet, fetchValidators])

  const formatTokens = (tokens: string) => {
    const amount = parseInt(tokens) / 1000000
    return `${amount.toLocaleString()} XPLA`
  }

  const formatPercentage = (rate: string) => {
    const percentage = (parseFloat(rate) * 100).toFixed(2)
    return `${percentage}%`
  }

  const shortenAddress = (address: string) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const openExplorer = (address: string) => {
    const url = `${explorer}validator/${address}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BOND_STATUS_BONDED':
        return 'text-green-600 bg-green-100'
      case 'BOND_STATUS_UNBONDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'BOND_STATUS_UNBONDED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'BOND_STATUS_BONDED':
        return 'Active'
      case 'BOND_STATUS_UNBONDING':
        return 'Unbonding'
      case 'BOND_STATUS_UNBONDED':
        return 'Inactive'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Validator</CardTitle>
          <CardDescription>
            Search for a validator operator address and inspect the most useful
            staking fields first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="validator-address" className="sr-only">
                Validator Address
              </Label>
              <Input
                id="validator-address"
                placeholder="Enter validator address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void searchValidator()}
              />
            </div>
            <Button onClick={searchValidator} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchedValidator && (
        <Card>
          <CardHeader>
            <CardTitle>Validator Summary</CardTitle>
            <CardDescription>
              Show the core staking fields first and keep the rest collapsed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Moniker
                  </Label>
                  <p className="text-lg font-semibold">
                    {searchedValidator.description.moniker}
                  </p>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Status
                  </Label>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(searchedValidator.status)}`}
                  >
                    {getStatusText(searchedValidator.status)}
                  </span>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Tokens
                  </Label>
                  <p className="text-lg font-semibold">
                    {formatTokens(searchedValidator.tokens)}
                  </p>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Commission Rate
                  </Label>
                  <p className="text-sm">
                    {formatPercentage(
                      searchedValidator.commission.commission_rates.rate,
                    )}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Operator Address
                </Label>
                <div className="flex items-center gap-2">
                  <p className="flex-1 rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background px-3 py-2 font-mono text-sm">
                    {shortenAddress(searchedValidator.operator_address)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openExplorer(searchedValidator.operator_address)}
                  >
                    View
                  </Button>
                </div>
              </div>

              <details className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background">
                <summary className="cursor-pointer list-none px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Validator details
                    </p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>
                </summary>
                <div className="grid gap-3 border-t border-border p-4 md:grid-cols-2">
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Delegator Shares
                    </Label>
                    <p className="mt-2 break-all text-sm text-foreground">
                      {searchedValidator.delegator_shares}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Min Self Delegation
                    </Label>
                    <p className="mt-2 break-all text-sm text-foreground">
                      {searchedValidator.min_self_delegation}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Jailed
                    </Label>
                    <p className="mt-2 text-sm text-foreground">
                      {searchedValidator.jailed ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Unbonding Time
                    </Label>
                    <p className="mt-2 break-all text-sm text-foreground">
                      {searchedValidator.unbonding_time || '-'}
                    </p>
                  </div>
                  {searchedValidator.description.website ? (
                    <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4 md:col-span-2">
                      <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Website
                      </Label>
                      <a
                        href={searchedValidator.description.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block break-all text-sm text-primary hover:underline"
                      >
                        {searchedValidator.description.website}
                      </a>
                    </div>
                  ) : null}
                  {searchedValidator.description.security_contact ? (
                    <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                      <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Security Contact
                      </Label>
                      <p className="mt-2 break-all text-sm text-foreground">
                        {searchedValidator.description.security_contact}
                      </p>
                    </div>
                  ) : null}
                  {searchedValidator.description.identity ? (
                    <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                      <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Identity
                      </Label>
                      <p className="mt-2 break-all text-sm text-foreground">
                        {searchedValidator.description.identity}
                      </p>
                    </div>
                  ) : null}
                  {searchedValidator.description.details ? (
                    <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4 md:col-span-2">
                      <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Notes
                      </Label>
                      <p className="mt-2 text-sm text-foreground">
                        {searchedValidator.description.details}
                      </p>
                    </div>
                  ) : null}
                </div>
              </details>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active Validators</CardTitle>
          <CardDescription>
            Network-wide validator counts first, with the loaded list collapsed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              Loading validators...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Active validators
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {validators.length}
                  </p>
                </div>
                <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Validator set height
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {validatorSet?.block_height || '-'}
                  </p>
                </div>
                <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Consensus validators
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {validatorSet?.validators.length || 0}
                  </p>
                </div>
              </div>

              <details className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background">
                <summary className="cursor-pointer list-none px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Browse loaded validator list
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Showing first {Math.min(validators.length, 10)}
                    </p>
                  </div>
                </summary>
                <div className="max-h-96 space-y-2 overflow-y-auto border-t border-border p-4">
                  {validators.slice(0, 10).map((validator, index) => (
                    <div
                      key={validator.operator_address}
                      className="flex items-center justify-between rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium">
                            {validator.description.moniker}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shortenAddress(validator.operator_address)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatTokens(validator.tokens)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPercentage(
                            validator.commission.commission_rates.rate,
                          )}{' '}
                          commission
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
