import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Bellatrix | Expert ERP Solutions & Consultancy',
  description: 'Bellatrix provides next-gen enterprise software solutions, specializing in NetSuite, Odoo, and Oracle implementation and strategic business transformation.',
  keywords: ['ERP solutions', 'NetSuite implementation', 'Odoo consulting', 'Oracle ERP', 'business consultancy', 'Bellatrix'],
  openGraph: {
    title: 'Bellatrix | Expert ERP Solutions & Consultancy',
    description: 'Empowering your business with next-gen enterprise software solutions.',
    url: 'https://bellatrixinc.com',
    siteName: 'Bellatrix',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Explicit <link> tags for browsers that ignore Next.js metadata icons */}
        <link rel="icon"           href="/favicon.png" type="image/png" />
        <link rel="shortcut icon"  href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

