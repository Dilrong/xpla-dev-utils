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
        'container relative max-w-screen-2xl py-8 md:py-12',
        className,
      )}
    >
      <div className="space-y-10">{children}</div>
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
    <section className="relative overflow-hidden border-2 border-foreground bg-card px-6 py-8 md:px-10 md:py-12">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div
        className={cn(
          'grid gap-8',
          actions ? 'lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)]' : '',
        )}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {eyebrow ? (
              <p className="border border-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-foreground">
                {eyebrow}
              </p>
            ) : null}
            <div className="flex flex-1 items-center gap-3">
              <div className="h-px flex-1 bg-foreground/20" />
              <div className="size-3 border border-foreground bg-background" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="max-w-5xl scroll-m-20 text-5xl leading-[0.92] text-foreground md:text-7xl xl:text-[5.6rem]">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>
        </div>
        {actions ? (
          <div className="flex flex-col justify-end gap-4 border-t border-foreground/15 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex flex-wrap gap-3">{actions}</div>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Strong contrast, no decorative accent colors, and direct
              utility-first actions for developers.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
