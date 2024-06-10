import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'
import Header from '@/components/feature/common/header'
import Footer from '@/components/feature/common/footer'
import React from 'react'
import { ThemeProvider } from '@/components/feature/common/theme-provider'

export const metadata: Metadata = {
  title: 'XPLA DEV Utils',
  description: 'XPLA Dev Utils',
  openGraph: {},
  twitter: {},
  icons: {},
  alternates: {},
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
