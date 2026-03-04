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
    icon: '/favicon.ico',
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
