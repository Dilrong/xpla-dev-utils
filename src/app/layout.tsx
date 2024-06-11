import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'
import Header from '@/components/feature/common/header'
import Footer from '@/components/feature/common/footer'
import React from 'react'
import { ThemeProvider } from '@/components/feature/common/theme-provider'

export const metadata: Metadata = {
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
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
