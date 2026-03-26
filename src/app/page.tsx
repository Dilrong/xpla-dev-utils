import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  Compass,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'
import LcdStatusWrapper from '@/components/feature/main/lcd-status-wrapper'
import { getNetworkConfig, Network } from '@/lib/config/block-chain'
import RpcStatusWrapper from '@/components/feature/main/rpc-status-wrapper'
import FcdStatusWrapper from '@/components/feature/main/fcd-status-wrapper'
import { menuConfig } from '@/lib/config/menu'
import packageJson from '../../package.json'

type SdkDependency = '@xpla/xpla.js' | '@xpla/wallet-provider'

function getDependencyVersion(packageName: SdkDependency) {
  return packageJson.dependencies[packageName].replace(/^[^\d]*/, '')
}

export default function Home() {
  const networkCards = [
    {
      title: 'Mainnet',
      description: 'dimension_37-1 production surface.',
      network: Network.mainnet,
      icon: ShieldCheck,
      defaultOpen: false,
    },
    {
      title: 'Testnet',
      description: 'cube_47-5 staging surface.',
      network: Network.testnet,
      icon: Sparkles,
      defaultOpen: true,
    },
  ]

  return (
    <PageShell>
      <PageHero
        eyebrow="Operator Grid"
        title="XPLA developer utilities built for fast technical decisions"
        description="Check endpoint health, inspect chain data, query contracts, and move between core XPLA workflows from one consistent operational surface."
        actions={
          <>
            <Link
              href="/contracts"
              className="inline-flex items-center gap-2 rounded-[calc(var(--radius)-0.2rem)] border border-primary bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open Contracts
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/blockchain"
              className="inline-flex items-center gap-2 rounded-[calc(var(--radius)-0.2rem)] border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
            >
              Open Chain Tools
              <Compass className="size-4" />
            </Link>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card className="overflow-hidden border-border bg-card">
          <CardHeader className="border-b border-border">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Start here
            </p>
            <CardTitle className="mt-3 flex items-center gap-2 text-3xl">
              <Compass className="size-5" />
              Fewer choices, faster starts
            </CardTitle>
            <CardDescription>
              Pick the work area first. Secondary flows stay hidden until you
              actually need them.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {menuConfig.groups.map((group) => {
              const primaryItem = group.items[0]
              const secondaryItems = group.items.slice(1)

              return (
                <div
                  key={group.title}
                  className="flex h-full flex-col rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background p-4"
                >
                  <div className="space-y-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {group.title}
                    </p>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-foreground">
                        {primaryItem.title}
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
                    <Link
                      href={primaryItem.href || group.href}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Open {primaryItem.title}
                      <ArrowRight className="size-4" />
                    </Link>
                    {secondaryItems.length ? (
                      <details className="group rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-3">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground">
                          More in {group.title}
                          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-3 space-y-2">
                          {secondaryItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href || group.href}
                              className="block rounded-[calc(var(--radius)-0.35rem)] border border-transparent bg-background/80 px-3 py-2 transition-colors hover:border-border hover:bg-background"
                            >
                              <p className="text-sm font-medium text-foreground">
                                {item.title}
                              </p>
                              {item.description ? (
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {item.description}
                                </p>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Environment
            </p>
            <CardTitle className="mt-3 flex items-center gap-2 text-3xl">
              <ScrollText className="size-5" />
              Keep the defaults visible
            </CardTitle>
            <CardDescription>
              Show only the baseline information that helps you orient quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/45 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Default flow
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Start with `Contracts` for smart contract work, `Chain` for
                inspection, and open the smaller tools only when the task calls
                for them.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  @xpla/xpla.js
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {getDependencyVersion('@xpla/xpla.js')}
                </p>
              </div>
              <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  @xpla/wallet-provider
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {getDependencyVersion('@xpla/wallet-provider')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Live status
          </p>
          <h2 className="text-3xl text-foreground">
            Endpoint checks on demand
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Keep the status surface folded by default. Expand a network only
            when you need endpoint-level detail.
          </p>
        </div>
        {networkCards.map(
          ({ title, description, network, icon: Icon, defaultOpen }) => (
            <details
              key={network}
              open={defaultOpen}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-[calc(var(--radius)-0.2rem)] border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Network band
                    </p>
                    <h3 className="text-2xl text-foreground">{title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    3 endpoint checks
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </div>
              </summary>
              <div className="border-t border-border/70 p-5">
                <div className="grid gap-4 xl:grid-cols-3">
                  <LcdStatusWrapper
                    title={`${title} LCD`}
                    url={getNetworkConfig(network).lcd}
                  />
                  <RpcStatusWrapper
                    title={`${title} RPC`}
                    url={getNetworkConfig(network).rpc}
                  />
                  <FcdStatusWrapper
                    title={`${title} FCD`}
                    url={getNetworkConfig(network).fcd}
                  />
                </div>
              </div>
            </details>
          ),
        )}
      </section>
    </PageShell>
  )
}
