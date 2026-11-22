// /contact — the contact form as a real page (people and Google try this URL),
// with the company details from Admin → Settings beside it.
import Layout from '../../src/components/Layout'
import ContactForm from '../../src/components/ContactForm'
import { getNavbarCategories, getPublicSettings, SITE_URL } from '../../src/lib/seo'

export const revalidate = 3600

export const metadata = {
  title: 'Contact Us',
  description:
    'Talk to Bellatrix about Oracle NetSuite or Odoo implementation, customization, training or support, with teams in the UAE, Kuwait and Egypt.',
  alternates: { canonical: `${SITE_URL}/contact` },
}

const parseList = (value) => {
  try {
    const list = typeof value === 'string' ? JSON.parse(value) : value
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export default async function ContactPage() {
  const [initialCategories, settings] = await Promise.all([getNavbarCategories(), getPublicSettings()])
  const email = settings.company_email || 'info@bellatrixinc.com'
  const phones = parseList(settings.company_phone).filter((p) => p && p.number)
  const locations = parseList(settings.company_locations).map((l) => l.address).filter(Boolean)

  return (
    <Layout initialCategories={initialCategories}>
      <section data-theme="dark" className="bg-[#001038] pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:px-6 lg:grid-cols-5">
          <div className="lg:col-span-2 text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Contact</p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">Let&apos;s talk about your ERP</h1>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              Tell us where you are with Oracle NetSuite or Odoo — a new implementation, a system that needs fixing,
              training or ongoing support — and a consultant will get back to you.
            </p>

            <dl className="mt-10 space-y-6 text-white/90">
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-white/55">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${email}`} className="text-lg underline-offset-4 hover:underline">{email}</a>
                </dd>
              </div>
              {phones.length > 0 && (
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-white/55">Phone</dt>
                  <dd className="mt-1 space-y-1">
                    {phones.map((p) => (
                      <p key={p.number}>
                        <span className="text-white/60">{p.country}</span>{' '}
                        <a href={`tel:${String(p.number).replace(/[^\d+]/g, '')}`} className="hover:underline">{p.number}</a>
                      </p>
                    ))}
                  </dd>
                </div>
              )}
              {locations.length > 0 && (
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-white/55">Locations</dt>
                  <dd className="mt-1">{locations.join(' · ')}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="lg:col-span-3">
            <div className="cf-panel rounded-lg">
              <div className="cf-header px-6 pt-6 pb-5 sm:px-8">
                <h2 className="cf-title text-xl font-semibold">Send us a message</h2>
              </div>
              <div className="px-6 py-6 sm:px-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
