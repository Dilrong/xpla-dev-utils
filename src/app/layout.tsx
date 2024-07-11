import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import Header from '@/components/feature/common/header'
import Footer from '@/components/feature/common/footer'
import { ThemeProvider } from '@/components/feature/common/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
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

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale}>
      <body>
        {/*<NextIntlClientProvider messages={messages}>*/}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletInitializer>
            <TooltipProvider>
              <Header />
              {children}
              <Footer />
              <Toaster />
            </TooltipProvider>
          </WalletInitializer>
        </ThemeProvider>
        {/*</NextIntlClientProvider>*/}
      </body>
    </html>
  )
}
