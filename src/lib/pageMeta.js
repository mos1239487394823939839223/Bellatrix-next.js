// Per-page metadata resolution shared by app/[slug]/page.jsx and its
// opengraph-image (so the share card always shows the same title as the page).
import { SITE_NAME, DEFAULT_DESCRIPTION, clampDescription } from './seo'

// Fallback metadata per known slug, used when the CMS page has no metaTitle/metaDescription.
export const PAGE_META = {
  about: {
    title: 'About Bellatrix | Certified NetSuite & ERP Consulting Partner',
    description: 'Learn about Bellatrix — a certified Oracle NetSuite partner delivering expert ERP consulting, implementation, and support services across the UAE and globally.',
  },
  hr: {
    title: 'HR & Payroll ERP Solutions',
    description: 'Streamline HR, payroll, and people management with Bellatrix. Our NetSuite HR modules automate payroll, compliance, and employee lifecycle management.',
  },
  payroll: {
    title: 'Payroll Management Software on NetSuite',
    description: 'Automate payroll processing, tax compliance, and salary disbursement with Bellatrix cloud payroll solutions built on NetSuite.',
  },
  manufacturing: {
    title: 'Manufacturing ERP Solutions with NetSuite',
    description: 'Optimize production planning, inventory, and quality control with Bellatrix NetSuite manufacturing ERP solutions tailored for modern manufacturers.',
  },
  retail: {
    title: 'Retail & Wholesale ERP and Omnichannel Solutions',
    description: 'Transform your retail operations with Bellatrix NetSuite retail ERP — unified POS, inventory, e‑commerce, and customer management on one platform.',
  },
  'professional-services': {
    title: 'Professional Services ERP (PSA) with NetSuite',
    description: 'Run projects, resources, time, billing and financials on one platform with Bellatrix NetSuite solutions for professional services firms.',
  },
  implementation: {
    title: 'NetSuite ERP Implementation Services',
    description: 'Expert NetSuite ERP implementation services from Bellatrix. We deliver on‑time, on‑budget ERP rollouts with a proven methodology.',
  },
  support: {
    title: 'NetSuite & ERP Support and Managed Services',
    description: 'Dedicated ERP support, managed services, and helpdesk packages for NetSuite and Odoo — from pay‑per‑use hours to full-time team bundles.',
  },
  training: {
    title: 'NetSuite ERP Training Programs',
    description: 'Upskill your team with Bellatrix NetSuite training — certification prep, role‑based courses, and hands‑on sandbox workshops.',
  },
  'e-invoice': {
    title: 'E-Invoicing Solutions — ZATCA & VAT Compliance',
    description: 'Stay compliant with UAE VAT and ZATCA e-invoicing regulations. Bellatrix delivers seamless e‑invoice integration into your NetSuite or Odoo ERP.',
  },
  integrations: {
    title: 'ERP Integrations & API Connectivity',
    description: 'Connect your ERP to third‑party platforms with Bellatrix integration services — REST APIs, middleware, and native NetSuite connectors.',
  },
  customization: {
    title: 'NetSuite ERP Customization Services',
    description: 'Tailor NetSuite to your exact business needs with Bellatrix customization services — SuiteScript, workflows, custom records, and dashboards.',
  },
}

export const prettify = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export function resolveMeta(slug, page) {
  const staticMeta = PAGE_META[slug] ?? {}
  const rawTitle =
    page?.metaTitle || staticMeta.title || page?.title || page?.name && prettify(page.name) || prettify(slug)
  const description = clampDescription(
    page?.metaDescription || staticMeta.description || page?.description || DEFAULT_DESCRIPTION
  )
  // Titles that already carry the brand are used as-is; others get " | Bellatrix"
  // from the root layout's title template (avoids "… | Bellatrix | Bellatrix").
  const title = /bellatrix/i.test(rawTitle) ? { absolute: rawTitle } : rawTitle
  const plainTitle = typeof title === 'string' ? `${title} | ${SITE_NAME}` : title.absolute
  return { title, plainTitle, description }
}

