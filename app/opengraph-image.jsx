// Default 1200×630 social share card for every page (Open Graph + Twitter).
// Generated at build time from the white logo on the brand navy.
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

export const alt = 'Bellatrix — ERP consulting for NetSuite, Odoo & Oracle'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/images/logoTwo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 80px',
          background: 'linear-gradient(135deg, #001248 0%, #0a2a7a 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <img src={logoSrc} width={300} height={251} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 64, maxWidth: 680 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -1 }}>Bellatrix</div>
          <div style={{ fontSize: 38, marginTop: 16, lineHeight: 1.25, opacity: 0.92 }}>
            ERP consulting for NetSuite, Odoo &amp; Oracle
          </div>
          <div style={{ fontSize: 26, marginTop: 28, opacity: 0.7 }}>
            Implementation · Customization · Training · Support
          </div>
        </div>
      </div>
    ),
    size
  )
}
