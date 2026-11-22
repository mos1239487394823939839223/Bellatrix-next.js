// Privacy Policy — static page (not CMS). Describes what this site actually
// does: a contact form stored by Bellatrix, no cookies, no analytics, a few
// browser-storage preferences, and third-party media only where shown.
// Update LAST_UPDATED and the relevant section whenever data handling changes
// (e.g. adding analytics, newsletters or new processors).
import Layout from '../../src/components/Layout'
import { getNavbarCategories, SITE_URL } from '../../src/lib/seo'

const LAST_UPDATED = '23 November 2026'
const CONTACT_EMAIL = 'info@bellatrixinc.com'

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How Bellatrix collects, uses and protects the personal information you share with us through bellatrixinc.com.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
}

const SECTIONS = [
  { id: 'who-we-are', title: 'Who we are' },
  { id: 'what-we-collect', title: 'Information we collect' },
  { id: 'how-we-use', title: 'How we use your information' },
  { id: 'sharing', title: 'Who we share it with' },
  { id: 'transfers', title: 'International transfers' },
  { id: 'retention', title: 'How long we keep it' },
  { id: 'security', title: 'How we protect it' },
  { id: 'rights', title: 'Your rights' },
  { id: 'cookies', title: 'Cookies and browser storage' },
  { id: 'third-party', title: 'Third-party content and links' },
  { id: 'children', title: 'Children' },
  { id: 'changes', title: 'Changes to this policy' },
  { id: 'contact', title: 'Contact us' },
]

function H2({ id, children }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-xl md:text-2xl font-bold text-gray-900 mt-12 mb-4">
      {children}
    </h2>
  )
}

const P = ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
const UL = ({ children }) => <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed mb-4">{children}</ul>
const Mail = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 underline underline-offset-2 hover:text-blue-700">
    {CONTACT_EMAIL}
  </a>
)

export default async function PrivacyPage() {
  const initialCategories = await getNavbarCategories()
  return (
    <Layout initialCategories={initialCategories}>
      <section data-theme="light" className="light-section bg-[var(--color-bg-secondary,#f8fafc)] pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Legal</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-4 text-gray-600">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section data-theme="light" className="light-section bg-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <P>
            This policy explains how Bellatrix (&ldquo;Bellatrix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
            uses and protects personal information when you visit bellatrixinc.com or contact us through it. We keep
            it short and specific to what this website actually does.
          </P>

          <nav aria-label="On this page" className="my-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-900 mb-3">On this page</p>
            <ol className="grid gap-1.5 sm:grid-cols-2 text-sm list-decimal pl-5 text-gray-700">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-blue-600 hover:underline">{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <H2 id="who-we-are">1. Who we are</H2>
          <P>
            Bellatrix is an ERP consulting company providing Oracle NetSuite and Odoo implementation, customization,
            training and support, with presence in the United Arab Emirates, Kuwait and Egypt. Bellatrix is
            responsible for the personal information described in this policy. You can reach us at <Mail />.
          </P>

          <H2 id="what-we-collect">2. Information we collect</H2>
          <P><strong>Information you give us.</strong> When you use a contact or consultation form on this site, we collect:</P>
          <UL>
            <li>your full name, work email address, industry and country (required);</li>
            <li>your phone number and company name (optional);</li>
            <li>the message you write.</li>
          </UL>
          <P>
            If you email us directly, we receive your email address and whatever you include in your message.
          </P>
          <P>
            <strong>Information collected automatically.</strong> Like any website, our server receives technical
            information needed to deliver pages and keep the site secure &mdash; your IP address, browser type, the
            pages requested and the time of the request. This appears in standard server logs. We do not use
            analytics or advertising trackers on this site.
          </P>
          <P>We do not ask for, and ask you not to send, sensitive information such as health or financial account details.</P>

          <H2 id="how-we-use">3. How we use your information</H2>
          <UL>
            <li>to reply to your enquiry and discuss the services you asked about;</li>
            <li>to prepare proposals, demos or consultations you request;</li>
            <li>to manage our relationship with you if you become a client;</li>
            <li>to keep the website secure, prevent spam and abuse, and fix problems.</li>
          </UL>
          <P>
            We use your contact details to answer you, and we only use them for related follow-up about the services
            you enquired about. We do not sell your personal information, and we do not use it for automated
            decision-making.
          </P>
          <P>
            Where data protection laws require a legal basis, we rely on your consent (when you submit a form), on
            steps taken at your request before entering into a contract, and on our legitimate interest in running
            and protecting our business.
          </P>

          <H2 id="sharing">4. Who we share it with</H2>
          <P>
            Your enquiry is read by Bellatrix staff who need it to respond. We share personal information only with:
          </P>
          <UL>
            <li>service providers that host and operate this website and our systems on our behalf, under confidentiality obligations;</li>
            <li>authorities, where we are legally required to;</li>
            <li>a successor organization, if Bellatrix is involved in a merger or acquisition, under this same policy.</li>
          </UL>

          <H2 id="transfers">5. International transfers</H2>
          <P>
            Our team works across the United Arab Emirates, Kuwait and Egypt, and our website is hosted on servers
            that may be located in another country. Your information may therefore be accessed or stored outside the
            country where you live. When that happens we take reasonable steps to make sure it stays protected in line
            with this policy and applicable law.
          </P>

          <H2 id="retention">6. How long we keep it</H2>
          <P>
            We keep enquiry information for as long as it is needed to respond to you and manage any resulting
            business relationship, and to meet legal, accounting or reporting obligations. When it is no longer
            needed, we delete it. Server logs are kept only for as long as needed for security and troubleshooting.
            You can ask us to delete your information at any time (see below).
          </P>

          <H2 id="security">7. How we protect it</H2>
          <P>
            The site is served over HTTPS, access to submitted messages is restricted to authorized staff with
            individual accounts, and we apply reasonable technical and organizational measures to protect your
            information. No method of transmission or storage is completely secure, but we work to protect your
            information and will act promptly if we become aware of a problem.
          </P>

          <H2 id="rights">8. Your rights</H2>
          <P>
            Depending on where you live &mdash; including under the UAE Personal Data Protection Law, the Saudi
            Personal Data Protection Law and, for visitors in the European Union or United Kingdom, the GDPR &mdash;
            you may have the right to:
          </P>
          <UL>
            <li>ask what personal information we hold about you and receive a copy;</li>
            <li>ask us to correct inaccurate or incomplete information;</li>
            <li>ask us to delete your information;</li>
            <li>object to or restrict how we use it, or withdraw consent you have given;</li>
            <li>complain to your local data protection authority.</li>
          </UL>
          <P>
            To make a request, email <Mail /> from the address you used to contact us. We may need to confirm your
            identity, and we will respond within the time required by applicable law.
          </P>

          <H2 id="cookies">9. Cookies and browser storage</H2>
          <P>
            This website does not set cookies for visitors and does not use analytics, advertising or tracking cookies.
            To remember your display preference (light or dark theme), the site saves a small setting in your
            browser&rsquo;s local storage. It never leaves your device, and you can clear it at any time in your
            browser settings.
          </P>

          <H2 id="third-party">10. Third-party content and links</H2>
          <P>
            Some pages show images from third-party image services, and some product videos may be played from
            YouTube or Vimeo. YouTube and Vimeo players only load after you press play (YouTube in its
            privacy-enhanced mode); once loaded, those providers may collect information under their own privacy
            policies. Links to our social media profiles (such as LinkedIn and Instagram) take you to sites with their
            own policies. We are not responsible for the privacy practices of other websites.
          </P>

          <H2 id="children">11. Children</H2>
          <P>
            This website is intended for businesses and is not directed at children. We do not knowingly collect
            personal information from anyone under 18. If you believe a child has sent us information, contact us and
            we will delete it.
          </P>

          <H2 id="changes">12. Changes to this policy</H2>
          <P>
            We may update this policy when our services or legal requirements change. The &ldquo;Last updated&rdquo;
            date at the top shows when it was last revised. Significant changes will be highlighted on this page.
          </P>

          <H2 id="contact">13. Contact us</H2>
          <P>
            For any question about this policy or your personal information, contact us at <Mail />.
          </P>
        </div>
      </section>
    </Layout>
  )
}
