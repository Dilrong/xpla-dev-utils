import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import Header from '@/components/feature/common/header'
import Footer from '@/components/feature/common/footer'
import { ThemeProvider } from '@/components/feature/common/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Analytics } from '@vercel/analytics/react'
import WalletInitializer from '@/components/feature/common/wallet-initializer'

export const metadata: Metadata = {
  metadataBase: new URL('https://xpla-dev-utils.vercel.app'),
  title: {
    default: 'XPLA DEV Utils',
    template: '%s | XPLA DEV Utils',
  },
  description: 'Web of utilities for XPLA blockchain development',
  openGraph: {
    title: 'XPLA DEV Utils',
    description: 'Web of utilities for XPLA blockchain development',
    url: 'https://xpla-dev-utils.vercel.app',
    images: ['/images/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'XPLA DEV Utils',
    description: 'Web of utilities for XPLA blockchain development',
    images: ['/images/og.png'],
    creator: 'XPLA DEV Utils',
    site: 'https://xpla-dev-utils.vercel.app',
  },
  icons: {
    icon: '/images/icons/apple-icon.png',
    apple: '/images/icons/apple-icon.png',
    other: {
      rel: 'apple-icon-precomposed.png',
      url: '/images/icons/apple-icon-precomposed.png',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const shouldRenderAnalytics = process.env.VERCEL === '1'

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="xpla-wallet" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletInitializer>
            <TooltipProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </TooltipProvider>
          </WalletInitializer>
        </ThemeProvider>
        {shouldRenderAnalytics ? <Analytics /> : null}
      </body>
    </html>
  )
}
