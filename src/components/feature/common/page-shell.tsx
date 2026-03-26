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
        'container relative max-w-screen-2xl py-8 md:py-10',
        className,
      )}
    >
      <div className="space-y-8">{children}</div>
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
    <section className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm md:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/80" />
      <div
        className={cn(
          'grid gap-6',
          actions ? 'lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]' : '',
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {eyebrow ? (
              <p className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-3">
            <h1 className="max-w-4xl scroll-m-20 text-4xl leading-tight text-foreground md:text-5xl xl:text-6xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {actions ? (
          <div className="flex flex-col justify-between gap-4 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/45 p-4">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Quick actions
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Start with the one or two actions that move the task forward
                first.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">{actions}</div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
