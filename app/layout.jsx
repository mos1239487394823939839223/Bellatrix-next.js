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
    icon: [
      { url: '/images/logoThree.png', type: 'image/png', sizes: '16x16' },
      { url: '/images/logoThree.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/logoThree.png', type: 'image/png', sizes: '48x48' },
      { url: '/images/logoThree.png', type: 'image/png', sizes: '64x64' },
      { url: '/images/logoThree.png', type: 'image/png', sizes: '96x96' },
      { url: '/images/logoThree.png', type: 'image/png', sizes: '128x128' },
      { url: '/images/logoThree.png', type: 'image/png', sizes: '192x192' },
      { url: '/images/logoThree.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/images/logoThree.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
