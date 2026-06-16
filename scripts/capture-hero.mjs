/**
 * Capture a single HD, canvas-only hero video showing the test animation
 * flowing through Request → Content Shield → Guardrail → Provider → Response.
 *
 * Output:
 *   public/screenshots/hero.webm  — 1920×1080, ~6s loop
 *   public/screenshots/hero.png   — first-frame poster
 */
import { chromium } from 'playwright'
import { mkdir, rename, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT       = resolve(__dirname, '../public/screenshots')
const VID_TMP   = resolve(__dirname, '../.video-tmp')
const DASHBOARD = process.env.DASHBOARD_URL || 'http://localhost:8090'
const USER      = process.env.GW_USER || 'admin'
const PASS      = process.env.GW_PASS || 'admin'
const VIEWPORT  = { width: 1920, height: 1080 }

const DEMO_ROUTE = {
  id: 'demo-pipeline',
  name: 'Demo Pipeline',
  enabled: true,
  isDefault: true,
  nodes: [
    { id: 'req-x', type: 'request',       position: { x: 40,  y: 200 }, data: { description: 'Incoming /v1 traffic' } },
    { id: 'shd-x', type: 'contentShield', position: { x: 320, y: 200 }, data: { label: 'Email Addresses', patternId: 'email', regex: '', replacement: '[REDACTED]' } },
    { id: 'grd-x', type: 'guardrail',     position: { x: 600, y: 200 }, data: { label: 'Prompt Injection', keywords: 'ignore previous\\ndisregard the above\\nyou are now', pattern: '', action: 'flag' } },
    { id: 'oai-x', type: 'provider',      position: { x: 880, y: 200 }, data: { vendorId: 'openai', name: 'openai-primary', weight: 100, modelExpr: 'payload.getModel()' } },
    { id: 'res-x', type: 'response',      position: { x: 1160, y: 200 }, data: { type: 'success', headers: [], payload: [] } },
  ],
  edges: [
    { id: 'e1', source: 'req-x', target: 'shd-x', animated: true, style: { strokeWidth: 1.8 } },
    { id: 'e2', source: 'shd-x', target: 'grd-x', animated: true, style: { strokeWidth: 1.8 } },
    { id: 'e3', source: 'grd-x', sourceHandle: 'passed', target: 'oai-x', animated: true, style: { strokeWidth: 1.8 } },
    { id: 'e4', source: 'oai-x', target: 'res-x', animated: true, style: { strokeWidth: 1.8 } },
  ],
}

const CLEAN_CSS = `
  /* Hide everything that isn't the canvas */
  .glass-sidebar { display: none !important; }
  main { margin-left: 0 !important; padding: 0 !important; }
  body { background: #03050f !important; }

  /* Canvas content lives inside main — make it fill the viewport */
  main > div { padding: 0 !important; }
  main > div > div.flex.flex-col.gap-3 { gap: 0 !important; height: 100vh !important; }

  /* Hide the canvas chrome (toolbar above, palette to the left, the React-Flow
     control buttons in the top-right, and any open modals/dropdowns) */
  div[data-canvas-toolbar],
  div[data-canvas-palette],
  div[data-rf-controls],
  .react-flow__controls,
  .react-flow__attribution { display: none !important; }

  /* The canvas root */
  .react-flow { background: transparent !important; }
  .react-flow__pane { background: transparent !important; }
`

/* Generic "hide chrome" injection — uses DOM heuristics since the canvas
   components don't yet have stable data attributes. */
const CLEAN_JS = `
  (() => {
    // Sidebar
    document.querySelectorAll('.glass-sidebar').forEach(el => el.style.display = 'none')

    // Main column: full width, no padding
    document.querySelectorAll('main').forEach(m => {
      m.style.marginLeft = '0'
      m.style.padding    = '0'
      m.style.maxWidth   = 'none'
    })

    // Locate the canvas root and walk up to the column that holds the
    // toolbar + canvas-row siblings.
    const rf = document.querySelector('.react-flow')
    if (!rf) return
    let wrap = rf.parentElement
    while (wrap && !(wrap.classList.contains('flex') && wrap.classList.contains('flex-col'))) {
      wrap = wrap.parentElement
    }
    if (wrap) {
      wrap.style.gap     = '0'
      wrap.style.height  = '100vh'
      wrap.style.padding = '0'
      // Hide every direct child that does NOT contain the canvas.
      for (const child of [...wrap.children]) {
        if (!child.contains(rf)) child.style.display = 'none'
      }
    }

    // Inside the canvas row, hide the palette (.w-52 flex-shrink-0 column).
    const palette = rf.parentElement?.parentElement?.querySelector('.w-52')
    if (palette) palette.style.display = 'none'

    // Strip the canvas wrapper's chrome
    const cw = rf.closest('.glass') || rf.parentElement
    if (cw) {
      cw.style.background  = 'transparent'
      cw.style.border      = 'none'
      cw.style.borderRadius= '0'
      cw.style.boxShadow   = 'none'
    }

    // Top-left active-route badge & top-right zoom controls
    document.querySelectorAll('.absolute.left-3.top-3, .absolute.right-3.top-3')
      .forEach(el => el.style.display = 'none')

    // React-Flow built-ins
    document.querySelectorAll('.react-flow__controls, .react-flow__minimap, .react-flow__attribution, .react-flow__panel')
      .forEach(el => el.style.display = 'none')
  })()
`

await mkdir(OUT, { recursive: true })
await rm(VID_TMP, { recursive: true, force: true }).catch(() => {})
await mkdir(VID_TMP, { recursive: true })

const browser = await chromium.launch()

const authCtx  = await browser.newContext({ viewport: VIEWPORT })
const authPage = await authCtx.newPage()
await login(authPage)
const STATE = await authCtx.storageState()
await authCtx.close()

async function login(page) {
  await page.goto(`${DASHBOARD}/login/`)
  await page.waitForLoadState('networkidle')
  await page.fill('input[placeholder="admin"]', USER)
  await page.fill('input[type="password"]', PASS)
  await page.click('button:has-text("Sign in")')
  await page.waitForURL(`${DASHBOARD}/`, { timeout: 15_000 })
}

async function seedDemoRoute(page) {
  await page.evaluate(route => {
    const existing = (() => {
      try { return JSON.parse(localStorage.getItem('ai-gateway:routes') || '[]') }
      catch { return [] }
    })()
    const others = existing.filter(r => r.id !== 'default' && r.id !== route.id)
    localStorage.setItem('ai-gateway:routes', JSON.stringify([route, ...others]))
  }, DEMO_ROUTE)
}

async function enterCanvasAndPrepare(page) {
  await page.waitForSelector('text=Demo Pipeline', { timeout: 5000 }).catch(() => {})
  const card = page.locator('.cursor-pointer').filter({ hasText: 'Demo Pipeline' }).first()
  await card.click({ timeout: 4000 }).catch(() => {})
  await page.waitForTimeout(1800)

  // Trigger Test + Send via the visible toolbar BEFORE we hide it.
  await page.locator('button:has-text("Test")').first().click({ timeout: 4000 }).catch(() => {})
  await page.waitForTimeout(700)
  await page.locator('button:has-text("Send request")').first().click({ timeout: 4000 }).catch(() => {})

  // Hide chrome (sidebar, toolbar, palette) but leave controls visible briefly
  // so we can press the fit button to refit the now-larger canvas area.
  await page.waitForTimeout(120)
  await page.addStyleTag({ content: CLEAN_CSS })
  await page.evaluate(CLEAN_JS)

  // Click fit-view (Maximize2 — 3rd button in the corner controls group)
  await page.evaluate(() => {
    window.dispatchEvent(new Event('resize'))
    const corner = document.querySelector('.absolute.right-3.top-3')
    const fitBtn = corner?.querySelectorAll('button')?.[2]
    if (fitBtn) {
      // Temporarily un-hide and click
      const prev = corner.style.display
      corner.style.display = ''
      fitBtn.click()
      corner.style.display = prev || 'none'
    }
  })
  await page.waitForTimeout(600) // wait for fitView animation
  await page.evaluate(() => {
    document.querySelectorAll('.absolute.right-3.top-3').forEach(el => el.style.display = 'none')
  })
}

/* ─── PNG poster ─────────────────────────────────────────────────────── */

{
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, storageState: STATE })
  const page = await ctx.newPage()
  await page.goto(`${DASHBOARD}/`, { waitUntil: "domcontentloaded" })
  await seedDemoRoute(page)
  await page.goto(`${DASHBOARD}/routing/`)
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
  await page.waitForTimeout(1000)
  // Click into canvas, hide chrome, capture a clean frame
  const card = page.locator('.cursor-pointer').filter({ hasText: 'Demo Pipeline' }).first()
  await card.click({ timeout: 4000 }).catch(() => {})
  await page.waitForTimeout(2000)
  await page.addStyleTag({ content: CLEAN_CSS })
  await page.evaluate(CLEAN_JS)
  // Refit canvas after chrome is hidden so the still-frame shows full-bleed nodes
  await page.evaluate(() => {
    window.dispatchEvent(new Event('resize'))
    const corner = document.querySelector('.absolute.right-3.top-3')
    const fitBtn = corner?.querySelectorAll('button')?.[2]
    if (fitBtn) { corner.style.display = ''; fitBtn.click(); corner.style.display = 'none' }
  })
  await page.waitForTimeout(700)
  await page.screenshot({ path: resolve(OUT, 'hero.png'), fullPage: false })
  console.log('[hero] png written')
  await ctx.close()
}

/* ─── Video ──────────────────────────────────────────────────────────── */

{
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: VID_TMP, size: VIEWPORT },
    storageState: STATE,
  })
  const page = await ctx.newPage()
  await page.goto(`${DASHBOARD}/`, { waitUntil: "domcontentloaded" })
  await seedDemoRoute(page)
  await page.goto(`${DASHBOARD}/routing/`)
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
  await page.waitForTimeout(900)
  await enterCanvasAndPrepare(page)

  // Hold on the clean canvas while the animation plays through
  await page.waitForTimeout(5200)

  const vidPath = await page.video().path()
  await ctx.close()
  const dest = resolve(OUT, 'hero.webm')
  await rm(dest, { force: true })
  await rename(vidPath, dest)
  console.log('[hero] webm written:', dest)
}

await browser.close()
await rm(VID_TMP, { recursive: true, force: true }).catch(() => {})
console.log('[hero] done')
