// Per-page 1200×630 share card (LinkedIn, WhatsApp, X…): the page's own title
// and description on the brand navy, so each shared link is recognisable.
// Next.js links it automatically as og:image / twitter:image for /[slug].
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { getPublicPage, SITE_NAME } from '../../src/lib/seo'
import { resolveMeta } from '../../src/lib/pageMeta'

export const alt = 'Bellatrix — ERP consulting for NetSuite, Odoo & Oracle'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

const trim = (text, max) => (text && text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text || '')

export default async function PageShareImage({ params }) {
  const { slug } = await params
  const { page } = await getPublicPage(slug)
  const { plainTitle, description } = resolveMeta(slug, page)
  const title = trim(plainTitle.replace(new RegExp(`\\s*[|–-]\\s*${SITE_NAME}\\s*$`, 'i'), ''), 70)

  const logo = await readFile(join(process.cwd(), 'public/images/logoTwo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          background: 'linear-gradient(135deg, #001248 0%, #0a2a7a 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoSrc} width={72} height={60} alt="" />
          <div style={{ fontSize: 34, fontWeight: 700, marginLeft: 20 }}>Bellatrix</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{title}</div>
          <div style={{ fontSize: 28, marginTop: 24, lineHeight: 1.35, opacity: 0.8 }}>{trim(description, 115)}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, opacity: 0.65 }}>bellatrixinc.com · NetSuite · Odoo · Oracle</div>
      </div>
    ),
    size
  )
}
