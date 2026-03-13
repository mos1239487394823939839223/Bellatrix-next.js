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
    remotePatterns: [
      { protocol: 'https', hostname: 'www.bellatrixinc.com' },
      { protocol: 'https', hostname: 'bellatrixinc.com' },
      { protocol: 'http', hostname: '68.178.169.236' },
    ],
  },
  // Remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
