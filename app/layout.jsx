import './globals.css'
import Providers from './providers'

// metadataBase resolves all relative OG/Twitter image URLs
export const metadata = {
  metadataBase: new URL('https://bellatrixinc.com'),
  title: {
    default: 'Bellatrix | Expert ERP Solutions & Consultancy',
    template: '%s | Bellatrix',
  },
  description:
    'Bellatrix is a certified Oracle NetSuite partner providing expert ERP consulting, implementation, HR, payroll, retail, manufacturing, and support services across the UAE and globally.',
  keywords:
    'ERP solutions, NetSuite implementation, Odoo consulting, Oracle ERP, ERP Dubai, NetSuite UAE, ERP consulting, enterprise resource planning, Bellatrix',
  authors:   [{ name: 'Bellatrix', url: 'https://bellatrixinc.com' }],
  creator:   'Bellatrix',
  publisher: 'Bellatrix',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://bellatrixinc.com',
  },
  openGraph: {
    type:        'website',
    url:         'https://bellatrixinc.com',
    siteName:    'Bellatrix',
    title:       'Bellatrix | Expert ERP Solutions & Consultancy',
    description: 'Certified Oracle NetSuite partner — ERP consulting, implementation, HR, payroll, retail & manufacturing solutions.',
    locale:      'en_US',
    images: [
      {
        url:    '/images/logoTwo.png',
        width:  1200,
        height: 630,
        alt:    'Bellatrix ERP Consulting',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@BellatrixERP',
    creator:     '@BellatrixERP',
    title:       'Bellatrix | Expert ERP Solutions & Consultancy',
    description: 'Certified Oracle NetSuite partner — ERP consulting, implementation, HR, payroll, retail & manufacturing solutions.',
    images:      ['/images/logoTwo.png'],
  },
  icons: {
    icon:      '/favicon.png',
    shortcut:  '/favicon.png',
    apple:     '/favicon.png',
  },
};

// JSON-LD Organisation schema — helps Google show sitelinks, knowledge panel & rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:       'Bellatrix',
  url:        'https://bellatrixinc.com',
  logo:       'https://bellatrixinc.com/images/logoTwo.png',
  description:
    'Certified Oracle NetSuite partner providing ERP consulting, implementation, HR, payroll, retail, and manufacturing solutions.',
  sameAs: [
    'https://www.linkedin.com/company/bellatrix-inc',
  ],
  contactPoint: {
    '@type':       'ContactPoint',
    contactType:   'customer support',
    areaServed:    'Global',
    availableLanguage: ['English', 'Arabic'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Explicit <link> tags for browsers that ignore Next.js metadata icons */}
        <link rel="icon"             href="/favicon.png" type="image/png" />
        <link rel="shortcut icon"    href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

