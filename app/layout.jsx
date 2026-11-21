import './globals.css'
import Providers from './providers'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  // Only load the weights actually used (reduces font payload ~50%)
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  // Expose as a CSS variable so global styles and design tokens can reference it
  variable: '--font-inter',
  preload: true,
})

// Viewport — viewportFit:'cover' enables env(safe-area-inset-*) for iPhone notch/home indicator
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

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
  // No site-wide canonical here: an inherited canonical would point every page
  // without its own (404s, auth) at the homepage. Each page sets its own.
  openGraph: {
    type:        'website',
    url:         'https://bellatrixinc.com',
    siteName:    'Bellatrix',
    title:       'Bellatrix | Expert ERP Solutions & Consultancy',
    description: 'Certified Oracle NetSuite partner — ERP consulting, implementation, HR, payroll, retail & manufacturing solutions.',
    locale:      'en_US',
    // Share image comes from app/opengraph-image.jsx (real 1200×630 card)
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@BellatrixERP',
    creator:     '@BellatrixERP',
    title:       'Bellatrix | Expert ERP Solutions & Consultancy',
    description: 'Certified Oracle NetSuite partner — ERP consulting, implementation, HR, payroll, retail & manufacturing solutions.',
  },
};

// JSON-LD Organisation schema — helps Google show sitelinks, knowledge panel & rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:       'Bellatrix',
  url:        'https://bellatrixinc.com',
  logo: {
    '@type':  'ImageObject',
    url:      'https://bellatrixinc.com/icon.png',
    width:    192,
    height:   192,
  },
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

// No SearchAction: the site has no search results page, so advertising one is invalid markup.
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Bellatrix',
  url: 'https://bellatrixinc.com',
  publisher: { '@type': 'Organization', name: 'Bellatrix', url: 'https://bellatrixinc.com' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

