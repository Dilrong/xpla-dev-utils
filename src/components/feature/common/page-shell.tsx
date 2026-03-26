import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: ReactNode
  className?: string
}

interface PageHeroProps {
  title: string
  description?: string
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
            {description ? (
              <p className="type-reveal reveal-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="type-reveal reveal-4 flex flex-wrap gap-4 border-t border-border/70 pt-6 lg:items-end lg:justify-end lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-10">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  )
}
