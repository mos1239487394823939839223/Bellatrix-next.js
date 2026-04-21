/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api to the bellatrix backend (replaces Vite proxy)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.bellatrixinc.com/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://www.bellatrixinc.com/uploads/:path*',
      },
    ]
  },
  images: {
    // Serve AVIF first (best compression), fall back to WebP, then original
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'www.bellatrixinc.com' },
      { protocol: 'https', hostname: 'bellatrixinc.com' },
      { protocol: 'http', hostname: '68.178.169.236' },
    ],
    // Widen the responsive breakpoints for better srcset coverage
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Cache optimized images on the CDN/server for 24 hours
    minimumCacheTTL: 86400,
  },
  // Remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Tree-shake heavy packages to only the imports actually used.
    // @mui/icons-material alone is ~6 MB raw; this can cut it by 90%+.
    optimizePackageImports: [
      'framer-motion',
      '@mui/icons-material',
      '@mui/material',
      '@heroicons/react',
    ],
  },
}

export default nextConfig
