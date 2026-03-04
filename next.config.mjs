/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api to the bellatrix backend (replaces Vite proxy)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://bellatrixinc.com/api/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.bellatrixinc.com' },
      { protocol: 'https', hostname: 'bellatrixinc.com' },
    ],
  },
  // Remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
