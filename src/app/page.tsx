import Link from 'next/link'
import {
  Card,
  CardContent,
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
      network: Network.mainnet,
      defaultOpen: false,
    },
    {
      title: 'Testnet',
      network: Network.testnet,
      defaultOpen: true,
    },
  ]

  return (
    <PageShell>
      <PageHero
        title="XPLA Dev Utils"
        actions={
          <>
            <Link
              href="/contracts"
              className="underline-motion py-1 text-sm tracking-[-0.02em] text-foreground"
            >
              Contracts
            </Link>
            <Link
              href="/blockchain"
              className="underline-motion py-1 text-sm tracking-[-0.02em] text-foreground"
            >
              Blockchain
            </Link>
          </>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <Card className="surface-motion overflow-hidden border-border/80 bg-card/[0.92]">
          <CardHeader className="gap-4 border-b border-border/70 p-6 md:p-7">
            <CardTitle className="text-3xl tracking-[-0.06em]">Tools</CardTitle>
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
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground">
                        0{index + 1}
                      </p>
                      <p className="text-lg tracking-[-0.04em] text-foreground">
                        {group.title}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-1 flex-col justify-between gap-4">
                    <Link
                      href={primaryItem.href || group.href}
                      className="underline-motion py-1 text-sm tracking-[-0.02em] text-foreground"
                    >
                      Open
                    </Link>
                    {secondaryItems.length ? (
                      <details className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm text-foreground">
                          More
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
            <CardTitle className="text-3xl tracking-[-0.06em]">Versions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-7">
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
        <h2 className="text-3xl tracking-[-0.06em] text-foreground">Status</h2>
        {networkCards.map(({ title, network, defaultOpen }) => (
          <details
            key={network}
            open={defaultOpen}
            className="surface-motion group overflow-hidden rounded-[1.6rem] border border-border/80 bg-card/[0.92] shadow-[0_22px_60px_-48px_hsl(var(--foreground)/0.3)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 md:p-6">
              <div className="min-w-0">
                <h3 className="text-2xl tracking-tight text-foreground">{title}</h3>
              </div>
              <div className="text-right">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground">
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
