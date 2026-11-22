// Server Component — generateMetadata + SSR data pre-fetch
import { notFound, permanentRedirect } from 'next/navigation'
import Layout from '../../src/components/Layout'
import { safeJsonLd } from '../../src/utils/htmlSanitizer'
import DynamicPageRenderer from '../../src/components/DynamicPageRenderer/index'
import {
  SITE_URL,
  SITE_NAME,
  getPublicPage,
  getNavbarCategories,
  pageUrl,
} from '../../src/lib/seo'
import { resolveMeta, prettify } from '../../src/lib/pageMeta'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { page, notFound: missing } = await getPublicPage(slug)
  if (missing) return { title: 'Page not found', robots: { index: false, follow: true } }

  const { title, plainTitle, description } = resolveMeta(slug, page)
  const canonical = pageUrl(slug)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: SITE_NAME,
      title: plainTitle,
      description,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: plainTitle,
      description,
    },
  }
}

function breadcrumbJsonLd(slug, page) {
  const items = [{ name: 'Home', url: `${SITE_URL}/` }]
  const category = page?.categoryName
  if (category && !['home', 'about'].includes(category.toLowerCase()) && category.toLowerCase() !== slug) {
    items.push({ name: category })
  }
  items.push({ name: page?.title || page?.name && prettify(page.name) || prettify(slug), url: pageUrl(slug) })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  }
}

export default async function SlugPage({ params }) {
  const { slug } = await params
  // /home duplicates the root URL — consolidate ranking signals on "/"
  if (slug === 'home') permanentRedirect('/')

  const [{ page, notFound: missing }, initialCategories] = await Promise.all([
    getPublicPage(slug),
    getNavbarCategories(),
  ])
  if (missing) notFound()

  return (
    <Layout initialCategories={initialCategories}>
      {page && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd(slug, page)) }}
        />
      )}
      <DynamicPageRenderer slug={slug} initialData={page} />
    </Layout>
  )
}
