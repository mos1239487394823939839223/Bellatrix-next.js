// /robots.txt
import { SITE_URL } from '../src/lib/seo'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /_next/ stays crawlable — Google needs the JS/CSS to render pages.
        disallow: ['/admin', '/admin-legacy', '/auth'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
