import Link from 'next/link'
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
      defaultOpen: false,
    },
    {
      title: 'Testnet',
      description: 'cube_47-5 staging surface.',
      network: Network.testnet,
      defaultOpen: true,
    },
  ]

  return (
    <PageShell>
      <PageHero
        eyebrow="XPLA operating surface"
        title="Developer utilities that stay quiet until the work needs detail"
        description="Move between contract work, chain inspection, and utility flows from one restrained surface. The first screen shows only the next decision, while deeper data stays collapsed."
        actions={
          <>
            <Link
              href="/contracts"
              className="underline-motion py-1 text-sm tracking-[-0.02em] text-foreground"
            >
              Launch contracts
            </Link>
            <Link
              href="/blockchain"
              className="underline-motion py-1 text-sm tracking-[-0.02em] text-foreground"
            >
              Open chain tools
            </Link>
          </>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <Card className="surface-motion overflow-hidden border-border/80 bg-card/[0.92]">
          <CardHeader className="gap-4 border-b border-border/70 p-6 md:p-7">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
              Start here
            </p>
            <CardTitle className="mt-3 text-3xl tracking-[-0.06em]">
              Fewer choices, faster starts
            </CardTitle>
            <CardDescription>
              Pick the work area first. Less-used flows stay folded until you
              intentionally open them.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 md:px-7 md:pb-7 md:pt-6 lg:grid-cols-3">
            {menuConfig.groups.map((group, index) => {
              const primaryItem = group.items[0]
              const secondaryItems = group.items.slice(1)

              return (
                <div
                  key={group.title}
                  className="surface-motion flex h-full flex-col rounded-[1.4rem] border border-border/70 bg-background/[0.86] p-5 md:p-6"
                >
                  <div className="space-y-4 md:space-y-5">
                    <div className="space-y-1">
                      <p className="text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground">
                        0{index + 1}
                      </p>
                      <p className="text-lg tracking-[-0.04em] text-foreground">
                        {group.title}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {group.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-1 flex-col justify-between gap-4">
                    <Link
                      href={primaryItem.href || group.href}
                      className="underline-motion py-1 text-sm tracking-[-0.02em] text-foreground"
                    >
                      Open {primaryItem.title}
                    </Link>
                    {secondaryItems.length ? (
                      <details className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm text-foreground">
                          More in {group.title}
                          <span className="text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground">
                            Open
                          </span>
                        </summary>
                        <div className="mt-4 space-y-2.5">
                          {secondaryItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href || group.href}
                              className="block rounded-[0.95rem] border border-transparent bg-background/85 p-3 transition-colors hover:border-border hover:bg-background"
                            >
                              <p className="text-sm tracking-[-0.02em] text-foreground">
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

        <Card className="surface-motion border-border/80 bg-card/[0.92]">
          <CardHeader className="gap-4 border-b border-border/70 p-6 md:p-7">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
              Environment
            </p>
            <CardTitle className="mt-3 text-3xl tracking-[-0.06em]">
              Keep the defaults visible
            </CardTitle>
            <CardDescription>
              The baseline information stays near the top so you can orient
              quickly without reading a dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6 md:px-7 md:pb-7 md:pt-6">
            <div className="rounded-[1.4rem] border border-border/70 bg-secondary/20 p-5 md:p-6">
              <p className="text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground">
                Default flow
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Start with Contracts for smart contract work, Chain for
                inspection, and open the smaller tools only when the task calls
                for them.
              </p>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-border/70 bg-background p-5">
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground">
                  @xpla/xpla.js
                </p>
                <p className="mt-2 text-2xl tracking-tight">
                  {getDependencyVersion('@xpla/xpla.js')}
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-border/70 bg-background p-5">
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground">
                  @xpla/wallet-provider
                </p>
                <p className="mt-2 text-2xl tracking-tight">
                  {getDependencyVersion('@xpla/wallet-provider')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-7">
        <div className="space-y-3">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
            Live status
          </p>
          <h2 className="text-3xl tracking-[-0.06em] text-foreground">
            Endpoint checks on demand
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Keep the status surface folded by default. Open a network only when
            endpoint-level detail matters.
          </p>
        </div>
        {networkCards.map(({ title, description, network, defaultOpen }) => (
          <details
            key={network}
            open={defaultOpen}
            className="surface-motion group overflow-hidden rounded-[1.6rem] border border-border/80 bg-card/[0.92] shadow-[0_22px_60px_-48px_hsl(var(--foreground)/0.3)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 md:p-6">
              <div className="min-w-0">
                <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Network band
                </p>
                <h3 className="mt-2 text-2xl tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm tracking-[-0.02em] text-foreground">
                  3 endpoint checks
                </p>
                <p className="mt-1 text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground">
                  Open
                </p>
              </div>
            </summary>
            <div className="border-t border-border/70 p-5 md:p-6">
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
        ))}
      </section>
    </PageShell>
  )
}
