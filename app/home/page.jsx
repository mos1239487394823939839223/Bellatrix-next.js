import HomePageClient from './HomePageClient'

export const metadata = {
  title: "Bellatrix | ERP Consulting — NetSuite, Odoo & Oracle Solutions",
  description: "Bellatrix is a certified ERP consulting firm specializing in NetSuite, Odoo, and Oracle implementations. We help businesses streamline operations, automate processes, and scale with enterprise-grade software solutions.",
  keywords: [
    "ERP consulting",
    "NetSuite implementation",
    "Odoo consulting",
    "Oracle ERP",
    "Oracle technical solutions",
    "ERP solutions",
    "enterprise resource planning",
    "NetSuite partner",
    "Odoo partner",
    "Oracle NetSuite",
    "ERP implementation",
    "business software consulting",
    "ERP customization",
    "ERP integration",
    "cloud ERP",
    "Bellatrix ERP",
    "NetSuite UAE",
    "Odoo UAE",
    "ERP Dubai",
    "Oracle consulting Dubai",
  ].join(", "),
  authors: [{ name: "Bellatrix" }],
  creator: "Bellatrix",
  publisher: "Bellatrix",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://bellatrixinc.com/home",
  },
  openGraph: {
    type: "website",
    url: "https://bellatrixinc.com/home",
    siteName: "Bellatrix",
    title: "Bellatrix | ERP Consulting — NetSuite, Odoo & Oracle Solutions",
    description: "Certified ERP consultants for NetSuite, Odoo, and Oracle. We deliver end-to-end ERP implementation, customization, and support for businesses across the UAE and globally.",
    images: [
      {
        url: "https://bellatrixinc.com/images/logoOne.png",
        width: 1200,
        height: 630,
        alt: "Bellatrix ERP Consulting",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bellatrix | ERP Consulting — NetSuite, Odoo & Oracle Solutions",
    description: "Certified ERP consultants for NetSuite, Odoo, and Oracle. End-to-end implementation, customization, and support.",
    images: ["https://bellatrixinc.com/images/logoOne.png"],
  },
}

export default function HomePage() {
  return <HomePageClient />
}
