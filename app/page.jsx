import HomePageClient from './home/HomePageClient'
import { getPublicPage, getNavbarCategories, SITE_URL, SITE_NAME } from '../src/lib/seo'

const TITLE = 'Bellatrix | ERP Consulting — NetSuite, Odoo & Oracle Solutions'
const DESCRIPTION =
  'Certified ERP consultants for Oracle NetSuite and Odoo: implementation, customization, training and support that help businesses streamline and scale.'

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: TITLE,
    description: 'Certified ERP consultants for NetSuite, Odoo, and Oracle. End-to-end ERP implementation, customization, and support.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: 'Certified ERP consultants for NetSuite, Odoo, and Oracle.',
  },
}

export default async function HomePage() {
  // Fetch navbar categories and home page sections in parallel — eliminates client waterfall
  const [initialCategories, { page }] = await Promise.all([
    getNavbarCategories(),
    getPublicPage('home'),
  ])
  return <HomePageClient initialCategories={initialCategories} initialData={page ?? null} />
}
