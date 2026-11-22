// /manifest.webmanifest — name, colours and icons used when the site is
// added to a phone's home screen.
export default function manifest() {
  return {
    name: 'Bellatrix — ERP Consulting for NetSuite, Odoo & Oracle',
    short_name: 'Bellatrix',
    description: 'Certified ERP consultants for Oracle NetSuite and Odoo: implementation, customization, training and support.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#001038',
    icons: [
      { src: '/icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
