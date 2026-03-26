'use client'

import { useCallback, useEffect, useState } from 'react'
import { useConfigStore } from '@/lib/store/config-store'
import { formatDuration, normalizeUrl } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface LatestBlockResponse {
  block?: {
    header?: {
      chain_id?: string
      height?: string
      time?: string
    }
  }
}

interface StakingParamsResponse {
  params?: {
    bond_denom?: string
    max_validators?: number
    unbonding_time?: string
    max_entries?: number
  }
}

interface SlashingParamsResponse {
  params?: {
    signed_blocks_window?: string
    min_signed_per_window?: string
    downtime_jail_duration?: string
    slash_fraction_double_sign?: string
    slash_fraction_downtime?: string
  }
}

interface GovVotingParamsResponse {
  params?: {
    voting_period?: string
    quorum?: string
    threshold?: string
    veto_threshold?: string
    min_deposit?: Array<{
      denom?: string
      amount?: string
    }>
  }
}

interface GovProposalsResponse {
  proposals?: Array<{
    id?: string
    status?: string
    title?: string
    summary?: string
    voting_end_time?: string
  }>
}

interface ChainSnapshot {
  chainId: string
  latestHeight: string
  latestTime: string
  staking: NonNullable<StakingParamsResponse['params']>
  slashing: NonNullable<SlashingParamsResponse['params']>
  governance: NonNullable<GovVotingParamsResponse['params']>
  proposals: NonNullable<GovProposalsResponse['proposals']>
  fetchedAt: string
}

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatPercent(value?: string) {
  if (!value) {
    return '-'
  }

  const numeric = Number(value) * 100

  if (!Number.isFinite(numeric)) {
    return value
  }

  return `${numeric.toFixed(2).replace(/\.00$/, '')}%`
}

function formatProposalStatus(status?: string) {
  if (!status) {
    return 'UNKNOWN'
  }

  return status.replace(/^PROPOSAL_STATUS_/, '').replaceAll('_', ' ')
}

async function getJson<T>(url: string) {
  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export default function ChainOverview() {
  const { lcd } = useConfigStore()
  const [snapshot, setSnapshot] = useState<ChainSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshToken, setRefreshToken] = useState(0)

  const refresh = useCallback(() => {
    setRefreshToken((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const baseUrl = normalizeUrl(lcd)

    setIsLoading(true)
    setError(null)

    Promise.all([
      getJson<LatestBlockResponse>(
        `${baseUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`,
      ),
      getJson<StakingParamsResponse>(
        `${baseUrl}/cosmos/staking/v1beta1/params`,
      ),
      getJson<SlashingParamsResponse>(
        `${baseUrl}/cosmos/slashing/v1beta1/params`,
      ),
      getJson<GovVotingParamsResponse>(
        `${baseUrl}/cosmos/gov/v1/params/voting`,
      ),
      getJson<GovProposalsResponse>(
        `${baseUrl}/cosmos/gov/v1/proposals?pagination.limit=5`,
      ),
    ])
      .then(([latestBlock, staking, slashing, governance, proposals]) => {
        if (controller.signal.aborted) {
          return
        }

        setSnapshot({
          chainId: latestBlock.block?.header?.chain_id ?? '-',
          latestHeight: latestBlock.block?.header?.height ?? '0',
          latestTime: latestBlock.block?.header?.time ?? '',
          staking: staking.params ?? {},
          slashing: slashing.params ?? {},
          governance: governance.params ?? {},
          proposals: proposals.proposals ?? [],
          fetchedAt: new Date().toISOString(),
        })
      })
      .catch((requestError) => {
        if (controller.signal.aborted) {
          return
        }

        setSnapshot(null)
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load chain overview.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [lcd, refreshToken])

  return (
    <div className="space-y-4">
      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Chain Overview</CardTitle>
            <CardDescription className="mt-2">
              Surface the chain ID, staking boundaries, slashing thresholds, and
              current governance window from one screen.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={refresh}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
            Active LCD: <span className="font-mono text-foreground">{lcd}</span>
          </div>

          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {!snapshot && !error && isLoading ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-6 text-sm text-muted-foreground">
              Loading chain parameters and recent proposals...
            </div>
          ) : null}

          {snapshot ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="border-border/70 bg-background/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Chain ID</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-lg font-semibold text-foreground">
                      {snapshot.chainId}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Latest block</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="text-lg font-semibold text-foreground">
                      {Number(snapshot.latestHeight).toLocaleString()}
                    </p>
                    <p>{formatDateTime(snapshot.latestTime)}</p>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Validator cap</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="text-lg font-semibold text-foreground">
                      {snapshot.staking.max_validators ?? '-'}
                    </p>
                    <p>Bond denom: {snapshot.staking.bond_denom ?? '-'}</p>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Unbonding</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="text-lg font-semibold text-foreground">
                      {formatDuration(snapshot.staking.unbonding_time ?? '-')}
                    </p>
                    <p>Max entries: {snapshot.staking.max_entries ?? '-'}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <Card className="border-border/70 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">Slashing parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-border/60 px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Signed block window
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {snapshot.slashing.signed_blocks_window ?? '-'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Min signed ratio
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatPercent(snapshot.slashing.min_signed_per_window)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Downtime jail
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatDuration(
                          snapshot.slashing.downtime_jail_duration ?? '-',
                        )}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Double-sign slash
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatPercent(
                          snapshot.slashing.slash_fraction_double_sign,
                        )}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 px-4 py-3 md:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Downtime slash
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatPercent(
                          snapshot.slashing.slash_fraction_downtime,
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-background/70">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Governance parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-border/60 px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Voting period
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatDuration(
                          snapshot.governance.voting_period ?? '-',
                        )}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 px-4 py-3">
                      <p className="text-sm text-muted-foreground">Quorum</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatPercent(snapshot.governance.quorum)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 px-4 py-3">
                      <p className="text-sm text-muted-foreground">Threshold</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatPercent(snapshot.governance.threshold)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Veto threshold
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {formatPercent(snapshot.governance.veto_threshold)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 px-4 py-3 md:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Minimum deposit
                      </p>
                      <p className="mt-1 font-semibold text-foreground">
                        {snapshot.governance.min_deposit?.length
                          ? snapshot.governance.min_deposit
                              .map(
                                (coin) =>
                                  `${coin.amount ?? '0'} ${coin.denom ?? 'unknown'}`,
                              )
                              .join(', ')
                          : '-'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/70 bg-background/70">
                <CardHeader>
                  <CardTitle className="text-base">
                    Recent governance proposals
                  </CardTitle>
                  <CardDescription>
                    Updated {formatDateTime(snapshot.fetchedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {snapshot.proposals.length ? (
                    snapshot.proposals.map((proposal) => (
                      <div
                        key={proposal.id}
                        className="rounded-2xl border border-border/60 p-4"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Proposal #{proposal.id ?? '-'}
                            </p>
                            <p className="text-base font-semibold text-foreground">
                              {proposal.title || 'Untitled proposal'}
                            </p>
                            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                              {proposal.summary || 'No summary available.'}
                            </p>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground lg:text-right">
                            <p className="font-medium text-foreground">
                              {formatProposalStatus(proposal.status)}
                            </p>
                            <p>
                              Voting ends:{' '}
                              {proposal.voting_end_time
                                ? formatDateTime(proposal.voting_end_time)
                                : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent proposals returned by the endpoint.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
