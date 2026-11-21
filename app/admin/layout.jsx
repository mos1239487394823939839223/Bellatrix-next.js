// Server layout: keeps these private pages out of search results.
// (robots.txt only blocks crawling; noindex is what prevents indexing.)
import AdminShell from './AdminShell'

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
}

export default function Layout({ children }) {
  return <AdminShell>{children}</AdminShell>
}
