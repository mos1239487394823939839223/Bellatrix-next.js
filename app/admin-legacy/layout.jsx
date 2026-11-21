// Server layout: keeps these private pages out of search results.
// (robots.txt only blocks crawling; noindex is what prevents indexing.)
import AdminLegacyShell from './AdminLegacyShell'

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
}

export default function Layout({ children }) {
  return <AdminLegacyShell>{children}</AdminLegacyShell>
}
