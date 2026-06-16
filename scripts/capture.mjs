/**
 * Capture real screenshots + short interaction videos of every dashboard page.
 *
 * Requires the dashboard reachable at DASHBOARD_URL (default http://localhost:8090)
 * — typically forwarded via:
 *   ssh -L 8090:localhost:4892 -L 4891:localhost:4891 dilan@dilans.duckdns.org
 *
 * For each page:
 *   - public/screenshots/<slug>.png   — static poster frame
 *   - public/screenshots/<slug>.webm  — ~5s interaction loop
 *
 * The "routing" page is special: it pre-seeds a Demo Route with Request →
 * Content Shield → Guardrail → Provider → Response, enters the canvas, then
 * triggers the live Test animation so the recording shows the request glowing
 * through every node.
 */
import { chromium } from 'playwright'
import { mkdir, readdir, rename, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT       = resolve(__dirname, '../public/screenshots')
const VID_TMP   = resolve(__dirname, '../.video-tmp')
const DASHBOARD = process.env.DASHBOARD_URL || 'http://localhost:8090'
const USER      = process.env.GW_USER || 'admin'
const PASS      = process.env.GW_PASS || 'admin'
const VIEWPORT  = { width: 1920, height: 1080 }

/* ─── Demo Route with full pipeline: request → shield → guardrail → provider → response */
const DEMO_ROUTE = {
  id: 'demo-pipeline',
  name: 'Demo Pipeline',
  enabled: true,
  isDefault: true,
  nodes: [
    { id: 'req-x',  type: 'request',       position: { x: 40,  y: 200 }, data: { description: 'Incoming /v1 traffic' } },
    { id: 'shd-x',  type: 'contentShield', position: { x: 280, y: 200 }, data: { label: 'Email Addresses', patternId: 'email', regex: '', replacement: '[REDACTED]' } },
    { id: 'grd-x',  type: 'guardrail',     position: { x: 520, y: 200 }, data: { label: 'Prompt Injection', keywords: 'ignore previous\\ndisregard the above\\nyou are now', pattern: '', action: 'flag' } },
    { id: 'oai-x',  type: 'provider',      position: { x: 780, y: 200 }, data: { vendorId: 'openai', name: 'openai-primary', weight: 100, modelExpr: 'payload.getModel()' } },
    { id: 'res-x',  type: 'response',      position: { x: 1040, y: 200 }, data: { type: 'success', headers: [], payload: [] } },
  ],
  edges: [
    { id: 'e1', source: 'req-x', target: 'shd-x', animated: true, style: { strokeWidth: 1.8 } },
    { id: 'e2', source: 'shd-x', target: 'grd-x', animated: true, style: { strokeWidth: 1.8 } },
    { id: 'e3', source: 'grd-x', sourceHandle: 'passed', target: 'oai-x', animated: true, style: { strokeWidth: 1.8 } },
    { id: 'e4', source: 'oai-x', target: 'res-x', animated: true, style: { strokeWidth: 1.8 } },
  ],
}

const PAGES = [
  { slug: 'routing',        path: '/routing/',        interact: routingInteract,      special: 'seedRoute' },
  { slug: 'overview',       path: '/',                interact: smoothScroll },
  { slug: 'analytics',      path: '/analytics/',      interact: smoothScroll },
  { slug: 'logs',           path: '/logs/',           interact: smoothScroll },
  { slug: 'mcp',            path: '/mcp/',            interact: smoothScroll },
  { slug: 'guardrails',     path: '/guardrails/',     interact: guardrailsInteract },
  { slug: 'content-shield', path: '/content-shield/', interact: contentShieldInteract },
  { slug: 'access',         path: '/access/',         interact: smoothScroll },
  { slug: 'playground',     path: '/playground/',     interact: playgroundInteract },
  { slug: 'settings',       path: '/settings/',       interact: smoothScroll },
]

await mkdir(OUT, { recursive: true })
await rm(VID_TMP, { recursive: true, force: true }).catch(() => {})
await mkdir(VID_TMP, { recursive: true })

const browser = await chromium.launch()

/* ─── Pre-auth: log in once and capture storageState so subsequent contexts
       (especially the video recorders) start already signed in — the login
       screen never appears in the recordings. ─────────────────────────── */
const authCtx  = await browser.newContext({ viewport: VIEWPORT })
const authPage = await authCtx.newPage()
await loginRaw(authPage)
const STATE = await authCtx.storageState()
await authCtx.close()
console.log('[auth] session captured')

/* ─── Helpers ──────────────────────────────────────────────────────────── */

async function smoothScroll(page) {
  await page.evaluate(async () => {
    const ease = t => 1 - Math.pow(1 - t, 3)
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const target = Math.min(max, 600)
    const frames = 90
    for (let i = 1; i <= frames; i++) {
      window.scrollTo(0, target * ease(i / frames))
      await new Promise(r => setTimeout(r, 22))
    }
    await new Promise(r => setTimeout(r, 300))
    for (let i = frames; i >= 0; i--) {
      window.scrollTo(0, target * ease(i / frames))
      await new Promise(r => setTimeout(r, 18))
    }
  })
}

async function routingInteract(page) {
  // Click into the Demo Pipeline card → canvas opens with full route shown.
  await page.waitForSelector('text=Demo Pipeline', { timeout: 5000 }).catch(() => {})
  const card = page.locator('.cursor-pointer').filter({ hasText: 'Demo Pipeline' }).first()
  await card.click({ timeout: 4000 }).catch(() => {})
  // Wait for canvas to render + fitView animation
  await page.waitForTimeout(2200)

  // Trigger the live test animation
  const testBtn = page.locator('button:has-text("Test")').first()
  await testBtn.click({ timeout: 4000 }).catch(() => {})
  await page.waitForTimeout(800)

  // Modal opens — click Send request
  const sendBtn = page.locator('button:has-text("Send request")').first()
  await sendBtn.click({ timeout: 4000 }).catch(() => {})

  // Animation duration ~ N nodes * 350ms + buffer
  await page.waitForTimeout(3500)
}

async function guardrailsInteract(page) {
  await page.evaluate(async () => {
    const max = Math.min(document.documentElement.scrollHeight - window.innerHeight, 400)
    for (let i = 0; i <= 60; i++) {
      window.scrollTo(0, max * (i / 60))
      await new Promise(r => setTimeout(r, 22))
    }
  })
  const expand = page.locator('button:has(svg.lucide-chevron-down)').first()
  await expand.click({ timeout: 1500 }).catch(() => {})
  await page.waitForTimeout(1800)
}

async function contentShieldInteract(page) {
  // Type in the live rule tester so redactions animate.
  await page.evaluate(async () => {
    const max = Math.min(document.documentElement.scrollHeight - window.innerHeight, 350)
    for (let i = 0; i <= 50; i++) {
      window.scrollTo(0, max * (i / 50))
      await new Promise(r => setTimeout(r, 22))
    }
  })
  const ta = page.locator('textarea').first()
  await ta.click({ timeout: 1500 }).catch(() => {})
  await ta.type('Contact jane@example.com about card 4111-1111-1111-1111 and SSN 123-45-6789',
    { delay: 28 }).catch(() => {})
  await page.waitForTimeout(1200)
}

async function playgroundInteract(page) {
  await page.evaluate(async () => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const target = Math.min(max, 700)
    for (let i = 0; i <= 90; i++) {
      window.scrollTo(0, target * (i / 90))
      await new Promise(r => setTimeout(r, 22))
    }
    await new Promise(r => setTimeout(r, 600))
  })
}

/* ─── Login ───────────────────────────────────────────────────────────── */

async function loginRaw(page) {
  await page.goto(`${DASHBOARD}/login/`)
  await page.waitForLoadState('networkidle')
  await page.fill('input[placeholder="admin"]', USER)
  await page.fill('input[type="password"]', PASS)
  await page.click('button:has-text("Sign in")')
  await page.waitForURL(`${DASHBOARD}/`, { timeout: 15_000 })
}

/* Inject the Demo Route into localStorage before navigating to /routing */
async function seedDemoRoute(page) {
  await page.evaluate(route => {
    const existing = (() => {
      try { return JSON.parse(localStorage.getItem('ai-gateway:routes') || '[]') }
      catch { return [] }
    })()
    // Replace the default route with the demo pipeline.
    const others = existing.filter(r => r.id !== 'default' && r.id !== route.id)
    localStorage.setItem('ai-gateway:routes', JSON.stringify([route, ...others]))
  }, DEMO_ROUTE)
}

/* ─── Pass 1: static PNGs ─────────────────────────────────────────────── */

{
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, storageState: STATE })
  const page = await ctx.newPage()

  for (const { slug, path, special } of PAGES) {
    if (special === 'seedRoute') {
      await page.goto(`${DASHBOARD}/`, { waitUntil: 'domcontentloaded' })
      await seedDemoRoute(page)
    }
    await page.goto(`${DASHBOARD}${path}`)
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
    await page.waitForTimeout(1200)

    // For the routing poster, drill into the canvas so the still shows the
    // visual flow with shield + guardrail nodes, not the route list.
    if (slug === 'routing') {
      await page.waitForSelector('text=Demo Pipeline', { timeout: 5000 }).catch(() => {})
      const card = page.locator('.cursor-pointer').filter({ hasText: 'Demo Pipeline' }).first()
      await card.click({ timeout: 4000 }).catch(() => {})
      await page.waitForTimeout(2800)
    }

    const out = resolve(OUT, `${slug}.png`)
    await page.screenshot({ path: out, fullPage: false })
    console.log(`[png] ${slug.padEnd(16)} → ${out}`)
  }
  await ctx.close()
}

/* ─── Pass 2: interaction videos ──────────────────────────────────────── */

for (const { slug, path, interact, special } of PAGES) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: VID_TMP, size: VIEWPORT },
    storageState: STATE,
  })
  const page = await ctx.newPage()
  if (special === 'seedRoute') {
    await page.goto(`${DASHBOARD}/`, { waitUntil: 'domcontentloaded' })
    await seedDemoRoute(page)
  }
  await page.goto(`${DASHBOARD}${path}`)
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
  await page.waitForTimeout(900)
  await interact(page).catch(err => console.warn(`[video] ${slug} interact failed: ${err.message}`))
  await page.waitForTimeout(400)

  const vidPath = await page.video().path()
  await ctx.close()

  const dest = resolve(OUT, `${slug}.webm`)
  await rm(dest, { force: true })
  await rename(vidPath, dest)
  console.log(`[video] ${slug.padEnd(16)} → ${dest}`)
}

await browser.close()
await rm(VID_TMP, { recursive: true, force: true }).catch(() => {})

const files = await readdir(OUT)
console.log(`[done] ${files.length} files: ${files.filter(f => f.endsWith('.webm')).length} webm, ${files.filter(f => f.endsWith('.png')).length} png`)
