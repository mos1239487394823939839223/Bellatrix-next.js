// Server Component — enables generateMetadata for Google indexing
import Layout from '../../src/components/Layout'
import DynamicPageRenderer from '../../src/components/DynamicPageRenderer/index'

// Static fallback metadata per known slug
const PAGE_META = {
  home: {
    title: 'Bellatrix | ERP Consulting — NetSuite, Odoo & Oracle Solutions',
    description: 'Bellatrix is a certified ERP consulting firm specializing in NetSuite, Odoo, and Oracle implementations. We help businesses streamline operations, automate processes, and scale with enterprise‑grade ERP software.',
    keywords: 'ERP consulting, NetSuite implementation, Odoo consulting, Oracle ERP, ERP solutions, Bellatrix',
  },
  about: {
    title: 'About Bellatrix | Certified NetSuite & ERP Consulting Partner',
    description: 'Learn about Bellatrix — a certified Oracle NetSuite partner delivering expert ERP consulting, implementation, and support services across the UAE and globally.',
    keywords: 'about Bellatrix, ERP consulting firm, NetSuite partner UAE, Oracle ERP partner',
  },
  hr: {
    title: 'HR & Payroll ERP Solutions | Bellatrix',
    description: 'Streamline HR, payroll, and people management with Bellatrix. Our NetSuite HR modules automate payroll, compliance, and employee lifecycle management.',
    keywords: 'HR ERP, payroll software, NetSuite HR, people management ERP, Bellatrix HR',
  },
  payroll: {
    title: 'Payroll Management Software | Bellatrix ERP Solutions',
    description: 'Automate payroll processing, tax compliance, and salary disbursement with Bellatrix cloud payroll solutions built on NetSuite.',
    keywords: 'payroll software, automated payroll, payroll compliance, NetSuite payroll',
  },
  manufacturing: {
    title: 'Manufacturing ERP Solutions | Bellatrix & NetSuite',
    description: 'Optimize production planning, inventory, and quality control with Bellatrix NetSuite manufacturing ERP solutions tailored for modern manufacturers.',
    keywords: 'manufacturing ERP, NetSuite manufacturing, production planning software, inventory management ERP',
  },
  retail: {
    title: 'Retail ERP & Omnichannel Solutions | Bellatrix',
    description: 'Transform your retail operations with Bellatrix NetSuite retail ERP — unified POS, inventory, e‑commerce, and customer management on one platform.',
    keywords: 'retail ERP, omnichannel retail software, NetSuite retail, POS system, inventory management retail',
  },
  implementation: {
    title: 'NetSuite ERP Implementation Services | Bellatrix',
    description: 'Expert NetSuite ERP implementation services from Bellatrix. We deliver on‑time, on‑budget ERP rollouts with a 98% success rate.',
    keywords: 'NetSuite implementation, ERP implementation services, Oracle NetSuite rollout, Bellatrix implementation',
  },
  support: {
    title: 'ERP Support & Managed Services | Bellatrix',
    description: 'Bellatrix offers dedicated ERP support, managed services, and helpdesk packages for NetSuite, Odoo, and Oracle — from pay‑per‑use to full-time team bundles.',
    keywords: 'NetSuite support, ERP managed services, Oracle support, Bellatrix helpdesk',
  },
  training: {
    title: 'NetSuite ERP Training Programs | Bellatrix',
    description: 'Upskill your team with Bellatrix professional NetSuite training — certification prep, role‑based courses, and hands‑on sandbox workshops.',
    keywords: 'NetSuite training, ERP training courses, Oracle NetSuite certification, Bellatrix training',
  },
  'e-invoice': {
    title: 'E-Invoicing Solutions — Zatca & VAT Compliance | Bellatrix',
    description: 'Stay compliant with UAE VAT and Zatca e-invoicing regulations. Bellatrix delivers seamless e‑invoice integration into your NetSuite or Odoo ERP.',
    keywords: 'e-invoice UAE, Zatca compliance, VAT e-invoicing, NetSuite e-invoice, Bellatrix e-invoice',
  },
  integrations: {
    title: 'ERP Integrations & API Connectivity | Bellatrix',
    description: 'Connect your ERP to third‑party platforms with Bellatrix integration services — REST APIs, middleware, and native NetSuite connectors.',
    keywords: 'ERP integration, NetSuite API, ERP connectivity, Bellatrix integrations',
  },
  customization: {
    title: 'NetSuite ERP Customization Services | Bellatrix',
    description: 'Tailor NetSuite to your exact business needs with Bellatrix customization services — SuiteScript, workflows, custom records, and dashboards.',
    keywords: 'NetSuite customization, SuiteScript development, ERP customization, Bellatrix customization',
  },
};

const BASE_URL = 'https://bellatrixinc.com';
const OG_IMAGE  = '/images/logoTwo.png'; // served from /public

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Try to pull title/description from the CMS API
  let apiTitle = null;
  let apiDescription = null;
  try {
    const res = await fetch(`${BASE_URL}/api/Pages/public/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      apiTitle       = data?.seoTitle       || data?.title || data?.name || null;
      apiDescription = data?.seoDescription || data?.description        || null;
    }
  } catch { /* fall through to static map */ }

  const staticMeta = PAGE_META[slug] ?? {};
  const prettified  = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const title       = apiTitle       || staticMeta.title       || `${prettified} | Bellatrix`;
  const description = apiDescription || staticMeta.description || 'Bellatrix provides expert ERP consulting, implementation, and support services for NetSuite, Odoo, and Oracle.';
  const keywords    = staticMeta.keywords || 'ERP consulting, NetSuite, Odoo, Oracle, Bellatrix';
  const canonical   = `${BASE_URL}/${slug}`;

  return {
    title,
    description,
    keywords,
    authors:   [{ name: 'Bellatrix' }],
    creator:   'Bellatrix',
    publisher: 'Bellatrix',
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
    },
    alternates: { canonical },
    openGraph: {
      type:     'website',
      url:      canonical,
      siteName: 'Bellatrix',
      title,
      description,
      locale:   'en_US',
      images:   [{ url: `${BASE_URL}${OG_IMAGE}`, width: 1200, height: 630, alt: 'Bellatrix ERP Consulting' }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [`${BASE_URL}${OG_IMAGE}`],
      creator:     '@BellatrixERP',
    },
  };
}

export default function SlugPage() {
  return (
    <Layout>
      <DynamicPageRenderer />
    </Layout>
  );
}
