'use client'

import { useState, useEffect } from 'react'
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
import {
  Loader2,
  Search,
  Shield,
  ArrowUpRight,
  TrendingUp,
  Coins,
  User,
} from 'lucide-react'

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

  // 모든 검증자 정보 가져오기
  const fetchValidators = async () => {
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
  }

  // 검증자 세트 정보 가져오기
  const fetchValidatorSet = async () => {
    try {
      const response = await axios.get(
        `${lcd}/cosmos/base/tendermint/v1beta1/validatorsets/latest`,
      )
      setValidatorSet(response.data)
    } catch (error) {
      console.error('Failed to fetch validator set:', error)
    }
  }

  // 특정 검증자 검색
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

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchValidators()
    fetchValidatorSet()
    // 30초마다 업데이트
    const interval = setInterval(() => {
      fetchValidators()
      fetchValidatorSet()
    }, 30000)
    return () => clearInterval(interval)
  }, [lcd])

  const formatTokens = (tokens: string) => {
    const amount = parseInt(tokens) / 1000000 // 6 decimals
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
      {/* 검증자 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Search Validator
          </CardTitle>
          <CardDescription>
            Search for a specific validator by address.
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
                onKeyPress={(e) => e.key === 'Enter' && searchValidator()}
              />
            </div>
            <Button onClick={searchValidator} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 검색된 검증자 정보 */}
      {searchedValidator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Validator Details
            </CardTitle>
            <CardDescription>
              Detailed information about the searched validator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Moniker
                  </Label>
                  <p className="text-lg font-semibold">
                    {searchedValidator.description.moniker}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(searchedValidator.status)}`}
                  >
                    {getStatusText(searchedValidator.status)}
                  </span>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tokens
                  </Label>
                  <p className="text-lg font-semibold">
                    {formatTokens(searchedValidator.tokens)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
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
                <Label className="text-sm font-medium text-muted-foreground">
                  Operator Address
                </Label>
                <div className="flex items-center gap-2">
                  <p className="flex-1 rounded bg-muted px-2 py-1 font-mono text-sm">
                    {shortenAddress(searchedValidator.operator_address)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openExplorer(searchedValidator.operator_address)
                    }
                  >
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              </div>
              {searchedValidator.description.website && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Website
                  </Label>
                  <a
                    href={searchedValidator.description.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {searchedValidator.description.website}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검증자 세트 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Active Validators
          </CardTitle>
          <CardDescription>
            Currently active validators in the network.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Total Active Validators: {validators.length}
              </div>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {validators.slice(0, 20).map((validator, index) => (
                  <div
                    key={validator.operator_address}
                    className="flex items-center justify-between rounded-lg bg-muted p-3"
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
              {validators.length > 20 && (
                <p className="text-center text-sm text-muted-foreground">
                  Showing first 20 validators. Total: {validators.length}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
