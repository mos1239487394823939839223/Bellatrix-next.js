// Server-side helpers shared by page routes, generateMetadata, sitemap and robots.
// React `cache` dedupes calls within one request, so generateMetadata and the
// page component share a single API round-trip.
import { cache } from 'react'

export const SITE_URL = 'https://bellatrixinc.com'
export const SITE_NAME = 'Bellatrix'
const API_URL = `${SITE_URL}/api`

export const DEFAULT_DESCRIPTION =
  'Bellatrix is a certified Oracle NetSuite partner providing ERP consulting, implementation, customization, training and support for NetSuite and Odoo across the UAE and globally.'

// Page fetch result: { page } when found, { notFound: true } when the CMS says
// the slug does not exist, { page: null } when the API is unreachable (we then
// render the page and let the client retry rather than 404-ing a real URL).
export const getPublicPage = cache(async (slug) => {
  try {
    const res = await fetch(`${API_URL}/Pages/public/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    })
    if (res.status === 404) return { notFound: true }
    if (!res.ok) return { page: null }
    const json = await res.json()
    if (json && json.success === false && json.data == null) return { notFound: true }
    const page = json?.data ?? json ?? null
    if (page && page.isPublished === false) return { notFound: true }
    return { page }
  } catch {
    return { page: null }
  }
})

export const getNavbarCategories = cache(async () => {
  try {
    const res = await fetch(`${API_URL}/Categories/navbar`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    if (Array.isArray(json)) return json
    if (Array.isArray(json?.data)) return json.data
    if (Array.isArray(json?.result)) return json.result
    return []
  } catch {
    return []
  }
})

export const pageUrl = (slug) => (!slug || slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${slug}`)

// Trim a description to Google's ~160-char snippet window without cutting a word.
export function clampDescription(text, max = 160) {
  if (!text) return text
  const clean = String(text).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:\-–—\s]+$/, '')}…`
}
