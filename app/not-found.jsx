// Real 404 for unknown URLs (previously they returned 200 with an "empty page",
// which Google treats as soft-404s and which diluted the site's index).
import Link from 'next/link'
import Layout from '../src/components/Layout'
import { getNavbarCategories } from '../src/lib/seo'

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default async function NotFound() {
  const initialCategories = await getNavbarCategories()
  return (
    <Layout initialCategories={initialCategories}>
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-xl">
          <p className="text-sm font-semibold tracking-wide text-blue-600">404</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">Page not found</h1>
          <p className="mt-4 text-gray-600">
            The page you are looking for doesn&apos;t exist or has moved. Explore our NetSuite
            implementation, support and training services instead.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary px-5 py-2.5 rounded-lg text-white">
              Back to home
            </Link>
            <Link href="/implementation" className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-800">
              Implementation services
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
