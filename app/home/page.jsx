import { permanentRedirect } from 'next/navigation'

// 308 (permanent) so search engines consolidate /home into /
export default function LegacyHomePage() {
  permanentRedirect('/')
}
