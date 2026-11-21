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
  // Static media in /public (videos are 3–20 MB) was served with max-age=0, so every
  // visit revalidated it. Cache for a day and serve stale while refreshing for a week;
  // replaced files still appear within a day (images also carry a ?v= cache-buster).
  async headers() {
    const media = 'public, max-age=86400, stale-while-revalidate=604800'
    return [
      { source: '/Videos/:path*', headers: [{ key: 'Cache-Control', value: media }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: media }] },
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
