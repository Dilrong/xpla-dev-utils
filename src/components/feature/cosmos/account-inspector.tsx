'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useConfigStore } from '@/lib/store/config-store'
import {
  decodeBech32Address,
  encodeBech32Prefix,
  formatWithCommas,
  normalizeUrl,
  summarizeAddress,
} from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CoinAmount {
  amount: string
  denom: string
}

interface BalanceResponse {
  balances?: CoinAmount[]
}

interface DelegationResponseItem {
  delegation?: {
    validator_address?: string
  }
  balance?: CoinAmount
}

interface DelegationResponse {
  delegation_responses?: DelegationResponseItem[]
}

interface RewardResponseItem {
  validator_address?: string
  reward?: CoinAmount[]
}

interface RewardsResponse {
  rewards?: RewardResponseItem[]
  total?: CoinAmount[]
}

interface AuthResponse {
  account?: Record<string, unknown>
}

interface AccountSnapshot {
  queryAddress: string
  accountType: string
  accountAddress: string
  accountNumber: string
  sequence: string
  balances: CoinAmount[]
  delegations: DelegationResponseItem[]
  rewardTotals: CoinAmount[]
  rewardBreakdown: RewardResponseItem[]
  raw: {
    account: AuthResponse
    balances: BalanceResponse
    delegations: DelegationResponse
    rewards: RewardsResponse
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getString(record: Record<string, unknown>, key: string) {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

function formatAmount(amount: string, denom: string) {
  if (denom === 'axpla') {
    const numeric = Number(amount) / 1_000_000

    if (Number.isFinite(numeric)) {
      return `${numeric.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      })} XPLA`
    }
  }

  const parsed = Number(amount)

  if (Number.isFinite(parsed)) {
    return `${formatWithCommas(parsed)} ${denom}`
  }

  return `${amount} ${denom}`
}

function sumByDenom(coins: CoinAmount[], denom: string) {
  return coins.reduce((total, coin) => {
    if (coin.denom !== denom) {
      return total
    }

    return total + BigInt(coin.amount.split('.')[0] || '0')
  }, BigInt(0))
}

function parseAccountResponse(response: AuthResponse) {
  const accountRecord = isRecord(response.account) ? response.account : {}
  const nestedBaseAccount = isRecord(accountRecord.base_account)
    ? accountRecord.base_account
    : accountRecord

  return {
    accountType: getString(accountRecord, '@type') || 'Unknown',
    accountAddress: getString(nestedBaseAccount, 'address'),
    accountNumber: getString(nestedBaseAccount, 'account_number'),
    sequence: getString(nestedBaseAccount, 'sequence'),
  }
}

async function getJson<T>(url: string) {
  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export default function AccountInspector() {
  const { lcd } = useConfigStore()
  const [inputValue, setInputValue] = useState('')
  const [queryAddress, setQueryAddress] = useState('')
  const [snapshot, setSnapshot] = useState<AccountSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshToken, setRefreshToken] = useState(0)

  const normalizedInput = useMemo(() => inputValue.trim(), [inputValue])

  const loadAccount = useCallback(
    async (address: string, signal?: AbortSignal) => {
      const decoded = decodeBech32Address(address)

      if (!decoded) {
        throw new Error('Enter a valid bech32 address.')
      }

      const normalizedAddress = encodeBech32Prefix(decoded.words, 'xpla')
      const baseUrl = normalizeUrl(lcd)

      const [account, balances, delegations, rewards] = await Promise.all([
        getJson<AuthResponse>(
          `${baseUrl}/cosmos/auth/v1beta1/accounts/${normalizedAddress}`,
        ),
        getJson<BalanceResponse>(
          `${baseUrl}/cosmos/bank/v1beta1/balances/${normalizedAddress}`,
        ),
        getJson<DelegationResponse>(
          `${baseUrl}/cosmos/staking/v1beta1/delegations/${normalizedAddress}`,
        ),
        getJson<RewardsResponse>(
          `${baseUrl}/cosmos/distribution/v1beta1/delegators/${normalizedAddress}/rewards`,
        ),
      ])

      if (signal?.aborted) {
        return
      }

      const baseAccount = parseAccountResponse(account)

      setSnapshot({
        queryAddress: normalizedAddress,
        accountType: baseAccount.accountType,
        accountAddress: baseAccount.accountAddress || normalizedAddress,
        accountNumber: baseAccount.accountNumber || '0',
        sequence: baseAccount.sequence || '0',
        balances: balances.balances ?? [],
        delegations: delegations.delegation_responses ?? [],
        rewardTotals: rewards.total ?? [],
        rewardBreakdown: rewards.rewards ?? [],
        raw: {
          account,
          balances,
          delegations,
          rewards,
        },
      })
    },
    [lcd],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!normalizedInput) {
      setError('Enter an address to inspect.')
      setSnapshot(null)
      return
    }

    setError(null)
    setQueryAddress(normalizedInput)
    setRefreshToken((current) => current + 1)
  }

  useEffect(() => {
    if (!queryAddress) {
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    loadAccount(queryAddress, controller.signal)
      .catch((requestError) => {
        if (controller.signal.aborted) {
          return
        }

        setSnapshot(null)
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to refresh the address snapshot.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [loadAccount, queryAddress, refreshToken])

  const liquidXpla = useMemo(() => {
    if (!snapshot) {
      return BigInt(0)
    }

    return sumByDenom(snapshot.balances, 'axpla')
  }, [snapshot])

  const delegatedXpla = useMemo(() => {
    if (!snapshot) {
      return BigInt(0)
    }

    return snapshot.delegations.reduce((total, delegation) => {
      if (!delegation.balance || delegation.balance.denom !== 'axpla') {
        return total
      }

      return total + BigInt(delegation.balance.amount)
    }, BigInt(0))
  }, [snapshot])

  const rewardXpla = useMemo(() => {
    if (!snapshot) {
      return BigInt(0)
    }

    return sumByDenom(snapshot.rewardTotals, 'axpla')
  }, [snapshot])

  return (
    <div className="space-y-4">
      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle>Account Inspector</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="flex flex-col gap-3 lg:flex-row"
            onSubmit={handleSubmit}
          >
            <Input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="xpla1..."
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Inspecting...' : 'Inspect'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!queryAddress || isLoading}
                onClick={() => setRefreshToken((current) => current + 1)}
              >
                Refresh
              </Button>
            </div>
          </form>

          <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
            LCD <span className="font-mono text-foreground">{lcd}</span>
          </div>

          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {!snapshot && !error ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-6 text-sm text-muted-foreground">
              Paste address.
            </div>
          ) : null}

          {snapshot ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="border-border/70 bg-background/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-mono text-foreground">
                      {summarizeAddress(snapshot.accountAddress, 10, 8)}
                    </p>
                    <p>Type: {snapshot.accountType}</p>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Account state</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p>Account #: {snapshot.accountNumber}</p>
                    <p>Sequence: {snapshot.sequence}</p>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Balances</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="text-xl font-semibold text-foreground">
                      {formatAmount(liquidXpla.toString(), 'axpla')}
                    </p>
                    <p>{snapshot.balances.length} denom entries</p>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Staking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="text-xl font-semibold text-foreground">
                      {formatAmount(delegatedXpla.toString(), 'axpla')}
                    </p>
                    <p>
                      Rewards: {formatAmount(rewardXpla.toString(), 'axpla')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                <Card className="border-border/70 bg-background/70 xl:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-base">Balances</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {snapshot.balances.length ? (
                      snapshot.balances.map((coin) => (
                        <div
                          key={`${coin.denom}-${coin.amount}`}
                          className="rounded-2xl border border-border/60 px-4 py-3"
                        >
                          <p className="font-medium text-foreground">
                            {formatAmount(coin.amount, coin.denom)}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            denom:{' '}
                            <span className="font-mono">{coin.denom}</span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No liquid balances found.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70 xl:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-base">Delegations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {snapshot.delegations.length ? (
                      snapshot.delegations.map((delegation) => (
                        <div
                          key={delegation.delegation?.validator_address}
                          className="rounded-2xl border border-border/60 px-4 py-3"
                        >
                          <p className="font-medium text-foreground">
                            {delegation.balance
                              ? formatAmount(
                                  delegation.balance.amount,
                                  delegation.balance.denom,
                                )
                              : '-'}
                          </p>
                          <p className="mt-1 break-all text-sm text-muted-foreground">
                            validator:{' '}
                            <span className="font-mono">
                              {delegation.delegation?.validator_address || '-'}
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No active delegations found.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70 xl:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-base">Rewards</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {snapshot.rewardBreakdown.length ? (
                      snapshot.rewardBreakdown.map((reward) => (
                        <div
                          key={reward.validator_address}
                          className="rounded-2xl border border-border/60 px-4 py-3"
                        >
                          <p className="font-medium text-foreground">
                            {reward.reward?.length
                              ? reward.reward
                                  .map((coin) =>
                                    formatAmount(coin.amount, coin.denom),
                                  )
                                  .join(', ')
                              : '0'}
                          </p>
                          <p className="mt-1 break-all text-sm text-muted-foreground">
                            validator:{' '}
                            <span className="font-mono">
                              {reward.validator_address || '-'}
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No staking rewards found.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <details className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
                  Raw LCD payloads
                </summary>
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {Object.entries(snapshot.raw).map(([key, value]) => (
                    <div
                      key={key}
                      className="overflow-hidden rounded-2xl border border-border/60 bg-card"
                    >
                      <div className="border-b border-border/60 px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {key}
                        </p>
                      </div>
                      <pre className="max-h-80 overflow-auto p-4 text-xs leading-6 text-muted-foreground">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
