import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Bellatrix',
  description: 'Bellatrix Inc.',
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
