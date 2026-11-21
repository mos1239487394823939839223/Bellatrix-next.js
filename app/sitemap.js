// /sitemap.xml — generated from the CMS navbar, refreshed hourly.
// Uses each page's real updatedAt as <lastmod> (the signal Google actually uses;
// it ignores <priority> and <changefreq>).
import { getNavbarCategories, pageUrl } from '../src/lib/seo'

export const revalidate = 3600

const EXCLUDED = [/^auth/, /^admin/, /^api/]

const toDate = (value) => {
  const d = value ? new Date(value) : null
  return d && !Number.isNaN(d.getTime()) ? d : undefined
}

export default async function sitemap() {
  const categories = await getNavbarCategories()
  const bySlug = new Map()

  const add = (slug, updatedAt) => {
    if (!slug || EXCLUDED.some((re) => re.test(slug))) return
    const date = toDate(updatedAt)
    const prev = bySlug.get(slug)
    // Keep the newest known date for slugs listed under several categories
    if (!bySlug.has(slug) || (date && (!prev || date > prev))) bySlug.set(slug, date)
  }

  add('home')
  for (const cat of categories) {
    if (cat.mainPageSlug) add(cat.mainPageSlug)
    for (const page of cat.pages || cat.Pages || []) {
      if (page.isPublished === false) continue
      add(page.slug, page.updatedAt || page.createdAt)
    }
  }

  return [...bySlug.entries()].map(([slug, lastModified]) => ({
    url: pageUrl(slug),
    ...(lastModified ? { lastModified } : {}),
    priority: slug === 'home' ? 1 : 0.8,
  }))
}
