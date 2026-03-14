import HomePageClient from './home/HomePageClient'

export const metadata = {
  title: "Bellatrix | ERP Consulting — NetSuite, Odoo & Oracle Solutions",
  description: "Bellatrix is a certified ERP consulting firm specializing in NetSuite, Odoo, and Oracle implementations. We help businesses streamline operations, automate processes, and scale with enterprise-grade software solutions.",
  keywords: "ERP consulting, NetSuite implementation, Odoo consulting, Oracle ERP, Oracle technical solutions, ERP solutions, enterprise resource planning, NetSuite partner, Odoo partner, ERP Dubai, NetSuite UAE, Bellatrix",
  alternates: {
    canonical: "https://bellatrixinc.com/",
  },
  openGraph: {
    type: "website",
    url: "https://bellatrixinc.com/",
    siteName: "Bellatrix",
    title: "Bellatrix | ERP Consulting — NetSuite, Odoo & Oracle Solutions",
    description: "Certified ERP consultants for NetSuite, Odoo, and Oracle. End-to-end ERP implementation, customization, and support.",
    images: [{ url: "https://bellatrixinc.com/images/logoTwo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bellatrix | ERP Consulting — NetSuite, Odoo & Oracle Solutions",
    description: "Certified ERP consultants for NetSuite, Odoo, and Oracle.",
    images: ["https://bellatrixinc.com/images/logoTwo.png"],
  },
}

async function fetchCategories() {
  try {
    const res = await fetch('https://bellatrixinc.com/api/Categories/navbar', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    if (Array.isArray(json)) return json
    if (Array.isArray(json.data)) return json.data
    if (Array.isArray(json.result)) return json.result
    return []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const initialCategories = await fetchCategories()
  return <HomePageClient initialCategories={initialCategories} />
}
