'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Network } from '@/lib/config/block-chain'
import { useConfigStore } from '@/lib/store/config-store'
import { summarizeAddress } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const REFRESH_INTERVAL_MS = 60_000
const AXPLA_PER_XPLA = BigInt(1_000_000)

interface ValidatorApiResponse {
  validators: ValidatorResponse[]
}

interface ValidatorResponse {
  operator_address: string
  consensus_pubkey?: {
    '@type'?: string
    key?: string
  }
  jailed: boolean
  status: string
  tokens: string
  description: {
    moniker: string
    identity: string
    website: string
    details: string
  }
  commission: {
    commission_rates: {
      rate: string
    }
  }
}

interface LatestBlockApiResponse {
  block: {
    header: {
      chain_id: string
      height: string
      time: string
    }
  }
}

interface UpgradePlanApiResponse {
  plan?: {
    name?: string
    height?: string
    info?: string
    time?: string
  }
}

interface ValidatorRow {
  operatorAddress: string
  consensusKeyType: string
  moniker: string
  identity: string
  website: string
  details: string
  tokens: string
  commissionRate: string
  jailed: boolean
  status: string
}

interface UpgradePlan {
  name: string
  height: string
  info: string
  time: string | null
}

interface ConsensusSnapshot {
  chainId: string
  latestBlockHeight: string
  latestBlockTime: string
  validators: ValidatorRow[]
  totalBondedTokens: string
  plan: UpgradePlan | null
  refreshedAt: string
}

function normalizeUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

async function getJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, { cache: 'no-store' })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

function compareBigIntDesc(a: string, b: string) {
  const left = BigInt(a)
  const right = BigInt(b)

  if (left === right) {
    return 0
  }

  return left > right ? -1 : 1
}

async function fetchConsensusSnapshot(lcd: string): Promise<ConsensusSnapshot> {
  const baseUrl = normalizeUrl(lcd)
  const [validatorData, latestBlockData, planData] = await Promise.all([
    getJson<ValidatorApiResponse>(
      `${baseUrl}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=200`,
    ),
    getJson<LatestBlockApiResponse>(
      `${baseUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`,
    ),
    getJson<UpgradePlanApiResponse>(
      `${baseUrl}/cosmos/upgrade/v1beta1/current_plan`,
    ),
  ])

  if (!validatorData || !latestBlockData) {
    throw new Error('Unable to load validator snapshot.')
  }

  const validators = [...validatorData.validators]
    .sort((left, right) => compareBigIntDesc(left.tokens, right.tokens))
    .map((validator) => ({
      operatorAddress: validator.operator_address,
      consensusKeyType:
        validator.consensus_pubkey?.['@type']?.split('.').pop() ?? '-',
      moniker: validator.description.moniker || 'Unnamed validator',
      identity: validator.description.identity,
      website: validator.description.website,
      details: validator.description.details,
      tokens: validator.tokens,
      commissionRate: validator.commission.commission_rates.rate,
      jailed: validator.jailed,
      status: validator.status,
    }))

  const totalBondedTokens = validators.reduce(
    (total, validator) => total + BigInt(validator.tokens),
    BigInt(0),
  )

  const normalizedPlan = normalizeUpgradePlan(planData?.plan)

  return {
    chainId: latestBlockData.block.header.chain_id,
    latestBlockHeight: latestBlockData.block.header.height,
    latestBlockTime: latestBlockData.block.header.time,
    validators,
    totalBondedTokens: totalBondedTokens.toString(),
    plan: normalizedPlan,
    refreshedAt: new Date().toISOString(),
  }
}

function normalizeUpgradePlan(plan?: UpgradePlanApiResponse['plan']) {
  if (!plan) {
    return null
  }

  const hasName = Boolean(plan.name?.trim())
  const hasHeight = Boolean(plan.height && plan.height !== '0')

  if (!hasName && !hasHeight) {
    return null
  }

  const hasValidTime =
    Boolean(plan.time) && !plan.time?.startsWith('0001-01-01T00:00:00')

  return {
    name: plan.name?.trim() || 'Scheduled upgrade',
    height: plan.height || '0',
    info: plan.info?.trim() || '',
    time: hasValidTime ? plan.time ?? null : null,
  }
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatCommissionRate(value: string) {
  const numeric = Number.parseFloat(value)

  if (Number.isNaN(numeric)) {
    return '-'
  }

  const percentage = numeric * 100
  const fractionDigits = percentage >= 10 ? 1 : 2

  return `${percentage.toFixed(fractionDigits).replace(/\.0$/, '').replace(/\.00$/, '')}%`
}

function formatAxpla(value: string, fractionDigits = 2) {
  const amount = BigInt(value)
  const whole = amount / AXPLA_PER_XPLA
  const fraction = amount % AXPLA_PER_XPLA

  if (fractionDigits === 0) {
    return `${whole.toLocaleString()} XPLA`
  }

  const precision = BigInt(Math.pow(10, 6 - fractionDigits))
  const trimmedFraction = (fraction / precision)
    .toString()
    .padStart(fractionDigits, '0')
    .replace(/0+$/, '')

  if (!trimmedFraction) {
    return `${whole.toLocaleString()} XPLA`
  }

  return `${whole.toLocaleString()}.${trimmedFraction} XPLA`
}

function shortenText(value: string, maxLength = 120) {
  if (!value) {
    return '-'
  }

  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
}

function getNetworkLabel(network: Network) {
  return network === Network.mainnet ? 'Mainnet' : 'Testnet'
}

function getUpgradeEta(
  plan: UpgradePlan | null,
  latestBlockHeight: string,
  blockTime: number,
) {
  if (!plan) {
    return null
  }

  if (plan.time) {
    return {
      label: formatDateTime(plan.time),
      description: 'Using the scheduled upgrade time from chain data.',
    }
  }

  const targetHeight = BigInt(plan.height || '0')
  const currentHeight = BigInt(latestBlockHeight || '0')

  if (targetHeight <= currentHeight) {
    return {
      label: 'Upgrade height reached',
      description: 'The scheduled height is already at or behind the current block.',
    }
  }

  const remainingBlocks = targetHeight - currentHeight
  const safeRemainingBlocks = Number(remainingBlocks)

  if (!Number.isFinite(safeRemainingBlocks)) {
    return {
      label: `${remainingBlocks.toLocaleString()} blocks remaining`,
      description: 'Too large to estimate a wall-clock time safely in the browser.',
    }
  }

  const estimatedAt = new Date(Date.now() + safeRemainingBlocks * blockTime)

  return {
    label: formatDateTime(estimatedAt.toISOString()),
    description: `${remainingBlocks.toLocaleString()} blocks remaining`,
  }
}

function statusLabel(value: string) {
  return value.replace('BOND_STATUS_', '').replaceAll('_', ' ')
}

export default function ValidatorConsensus() {
  const { blockTime, lcd, network } = useConfigStore()
  const [search, setSearch] = useState('')
  const [snapshot, setSnapshot] = useState<ConsensusSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const requestIdRef = useRef(0)

  const loadSnapshot = useCallback(
    async (showLoadingState: boolean) => {
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId

      if (showLoadingState) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      setErrorMessage('')

      try {
        const nextSnapshot = await fetchConsensusSnapshot(lcd)
        if (requestId !== requestIdRef.current) {
          return
        }
        setSnapshot(nextSnapshot)
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return
        }
        console.error(error)
        setErrorMessage(
          'Failed to load validator data. Please check the selected network endpoint.',
        )
      } finally {
        if (requestId !== requestIdRef.current) {
          return
        }
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [lcd],
  )

  useEffect(() => {
    setSearch('')
    setSnapshot(null)
    setErrorMessage('')
    setIsLoading(true)
    void loadSnapshot(true)

    const intervalId = window.setInterval(() => {
      void loadSnapshot(false)
    }, REFRESH_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadSnapshot, network])

  const normalizedQuery = search.trim().toLowerCase()
  const filteredValidators =
    snapshot?.validators.filter((validator) => {
      if (!normalizedQuery) {
        return true
      }

      const searchableValue = [
        validator.moniker,
        validator.operatorAddress,
        validator.identity,
        validator.website,
      ]
        .join(' ')
        .toLowerCase()

      return searchableValue.includes(normalizedQuery)
    }) ?? []

  const upgradeEta = snapshot
    ? getUpgradeEta(snapshot.plan, snapshot.latestBlockHeight, blockTime)
    : null

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-3xl text-sm text-muted-foreground">
          Mintscan-style overview for the currently selected network. This
          page uses the public LCD endpoint, so it can show the active
          validator set and on-chain upgrade plan, but not each validator&apos;s
          binary version rollout.
        </p>
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search validators"
            className="w-full lg:w-64"
          />
          <Button
            variant="outline"
            onClick={() => void loadSnapshot(false)}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{getNetworkLabel(network)}</p>
            <p className="text-sm text-muted-foreground">
              {snapshot?.chainId || 'Loading chain ID...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest Block</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">
              {snapshot
                ? BigInt(snapshot.latestBlockHeight).toLocaleString()
                : '-'}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(snapshot?.latestBlockTime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bonded Stake</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">
              {snapshot ? formatAxpla(snapshot.totalBondedTokens, 0) : '-'}
            </p>
            <p className="text-sm text-muted-foreground">
              {snapshot?.validators.length ?? 0} bonded validators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upgrade Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-lg font-semibold">
              {snapshot?.plan?.name || 'No scheduled upgrade'}
            </p>
            <p className="text-sm text-muted-foreground">
              {snapshot?.plan
                ? `Height ${BigInt(snapshot.plan.height).toLocaleString()}`
                : 'No active plan from the upgrade module.'}
            </p>
            <p className="text-sm text-muted-foreground">
              {upgradeEta?.label || '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {errorMessage ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{errorMessage}</p>
          </CardContent>
        </Card>
      ) : null}

      {snapshot?.plan ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upgrade Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{upgradeEta?.description || 'Upgrade timing is available.'}</p>
            <p>{shortenText(snapshot.plan.info)}</p>
            <p>Last synced: {formatDateTime(snapshot.refreshedAt)}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Consensus Validators</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !snapshot ? (
            <p className="text-sm text-muted-foreground">
              Loading validator set...
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {filteredValidators.length.toLocaleString()} validator
                  {filteredValidators.length === 1 ? '' : 's'}
                </p>
                <p>Auto refresh every 60 seconds</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 font-medium text-muted-foreground">
                        #
                      </th>
                      <th className="p-3 font-medium text-muted-foreground">
                        Validator
                      </th>
                      <th className="p-3 font-medium text-muted-foreground">
                        Stake
                      </th>
                      <th className="p-3 font-medium text-muted-foreground">
                        Commission
                      </th>
                      <th className="p-3 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="p-3 font-medium text-muted-foreground">
                        Jailed
                      </th>
                      <th className="p-3 font-medium text-muted-foreground">
                        Operator
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredValidators.map((validator, index) => (
                      <tr key={validator.operatorAddress} className="border-b">
                        <td className="px-3 py-4 align-top text-muted-foreground">
                          {(index + 1).toLocaleString()}
                        </td>
                        <td className="px-3 py-4 align-top">
                          <div className="space-y-1">
                            <p className="font-medium">{validator.moniker}</p>
                            <p className="text-xs text-muted-foreground">
                              {validator.identity ||
                                validator.website ||
                                shortenText(validator.details, 80)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {validator.consensusKeyType}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-4 align-top">
                          {formatAxpla(validator.tokens)}
                        </td>
                        <td className="px-3 py-4 align-top">
                          {formatCommissionRate(validator.commissionRate)}
                        </td>
                        <td className="px-3 py-4 align-top">
                          {statusLabel(validator.status)}
                        </td>
                        <td className="px-3 py-4 align-top">
                          {validator.jailed ? 'Yes' : 'No'}
                        </td>
                        <td className="px-3 py-4 align-top font-mono text-xs text-muted-foreground">
                          {summarizeAddress(validator.operatorAddress, 12, 8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!filteredValidators.length ? (
                <p className="text-sm text-muted-foreground">
                  No validators matched the current search query.
                </p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
