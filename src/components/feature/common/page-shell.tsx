import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: ReactNode
  className?: string
}

interface PageHeroProps {
  title: string
  description: string
  eyebrow?: string
  actions?: ReactNode
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        'container relative max-w-screen-2xl py-8 md:py-12 xl:py-16',
        className,
      )}
    >
      <div className="space-y-10 md:space-y-12 xl:space-y-14">{children}</div>
    </div>
  )
}

export function PageHero({
  title,
  description,
  eyebrow,
  actions,
}: PageHeroProps) {
  return (
    <section className="surface-motion relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/[0.88] px-6 py-8 shadow-[0_24px_80px_-48px_hsl(var(--foreground)/0.28)] md:px-10 md:py-11 xl:px-12 xl:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_42%),linear-gradient(180deg,hsl(var(--background)/0.35),transparent)]" />
      <div
        className={cn(
          'grid gap-8 md:gap-10',
          actions ? 'lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.55fr)]' : '',
        )}
      >
        <div className="space-y-5 md:space-y-6">
          {eyebrow ? (
            <p className="type-reveal text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-4 md:space-y-5">
            <h1 className="type-reveal reveal-2 max-w-4xl scroll-m-20 text-4xl leading-[0.96] text-foreground md:text-5xl xl:text-6xl">
              {title}
            </h1>
            <p className="type-reveal reveal-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>
        </div>
        {actions ? (
          <div className="type-reveal reveal-4 flex flex-col justify-between gap-6 border-t border-border/70 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-10">
            <div className="space-y-3">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
                Start here
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Keep the first move obvious. Secondary controls can stay out of
                sight until the task needs them.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-5">{actions}</div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
