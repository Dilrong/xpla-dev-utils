import createNextIntlPlugin from 'next-intl/plugin'
// import withBundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

// Checking Bundle Size
// const withBundleAnalyzerConfig = withBundleAnalyzer({
//   enabled: 'true',
//   openAnalyzer: 'true',
// })

export default withNextIntl(nextConfig)
