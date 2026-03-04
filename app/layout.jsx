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
    images: [
      {
        url: 'https://bellatrixinc.com/images/logoOne.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logoOne.png',
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
