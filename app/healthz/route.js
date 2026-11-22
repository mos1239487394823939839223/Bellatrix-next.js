// GET /healthz — liveness/readiness for uptime monitors.
// 200 when the website and the .NET API both respond, 503 otherwise.
// Exposes no versions, paths or secrets.
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL_WITH_API || 'https://bellatrixinc.com/api'

export const dynamic = 'force-dynamic'

async function checkApi() {
  const started = Date.now()
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${API_URL}/Settings/public`, { cache: 'no-store', signal: controller.signal })
    clearTimeout(timer)
    return { ok: res.ok, status: res.status, ms: Date.now() - started }
  } catch {
    return { ok: false, status: 0, ms: Date.now() - started }
  }
}

export async function GET() {
  const api = await checkApi()
  const healthy = api.ok
  return Response.json(
    {
      status: healthy ? 'ok' : 'degraded',
      checks: { web: 'ok', api: api.ok ? 'ok' : 'down' },
      apiResponseMs: api.ms,
      time: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  )
}
