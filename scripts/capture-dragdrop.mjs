/**
 * Capture a HD video of a real drag-and-drop interaction on the routing canvas.
 *
 * Output:
 *   public/screenshots/routing-dragdrop.mp4
 *   public/screenshots/routing-dragdrop.png
 */
import { chromium } from 'playwright'
import { mkdir, rename, rm } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT       = resolve(__dirname, '../public/screenshots')
const VID_TMP   = resolve(__dirname, '../.video-tmp')
const DASHBOARD = process.env.DASHBOARD_URL || 'http://localhost:8090'
const USER      = process.env.GW_USER || 'admin'
const PASS      = process.env.GW_PASS || 'admin'
const VIEWPORT  = { width: 1920, height: 1080 }

/* Start with an empty route so the drop is visible. */
const EMPTY_ROUTE = {
  id: 'demo-dragdrop',
  name: 'Drag & Drop Demo',
  enabled: true,
  isDefault: true,
  nodes: [
    { id: 'req-d', type: 'request',  position: { x: 320, y: 380 }, data: { description: 'All incoming traffic' } },
    { id: 'res-d', type: 'response', position: { x: 1200, y: 380 }, data: { type: 'success', headers: [], payload: [] } },
  ],
  edges: [],
}

const CLEAN_JS = `
  (() => {
    document.querySelectorAll('.glass-sidebar').forEach(el => el.style.display = 'none')
    document.querySelectorAll('main').forEach(m => { m.style.marginLeft = '0'; m.style.padding = '0' })
    const rf = document.querySelector('.react-flow'); if (!rf) return
    let wrap = rf.parentElement
    while (wrap && !(wrap.classList.contains('flex') && wrap.classList.contains('flex-col'))) wrap = wrap.parentElement
    if (wrap) {
      wrap.style.gap='0'; wrap.style.height='100vh'; wrap.style.padding='0'
      for (const c of [...wrap.children]) if (!c.contains(rf) && !c.querySelector('.w-52')) c.style.display='none'
    }
    document.querySelectorAll('.absolute.left-3.top-3, .absolute.right-3.top-3, .react-flow__controls, .react-flow__minimap, .react-flow__attribution').forEach(el => el.style.display='none')
    const cw = rf.closest('.glass'); if (cw) { cw.style.background='transparent'; cw.style.border='none'; cw.style.borderRadius='0' }
  })()
`

// Playwright/Chromium recordVideo doesn't render the OS cursor — mouse
// events fire and React Flow processes them, but nothing visible moves.
// Inject a synthetic cursor that tracks mousemove + dragover, pulses on
// mousedown, so the drag-and-drop is actually visible in the video.
const FAKE_CURSOR_JS = `
  (() => {
    if (document.getElementById('__modo_fake_cursor')) return
    const c = document.createElement('div')
    c.id = '__modo_fake_cursor'
    c.style.cssText =
      'position:fixed;top:0;left:0;width:24px;height:24px;' +
      'pointer-events:none;z-index:2147483647;' +
      'transform:translate(-2px,-2px);will-change:transform;' +
      'transition:transform 70ms linear, filter 80ms ease-out;'
    c.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24" ' +
      'style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.7))">' +
      '<path d="M3 2 L3 19 L8 14 L11 21 L14 20 L11 13 L18 13 Z" ' +
      'fill="#ffffff" stroke="#0d0d1f" stroke-width="1.4" stroke-linejoin="round"/></svg>'
    document.body.appendChild(c)
    const ring = document.createElement('div')
    ring.id = '__modo_fake_cursor_ring'
    ring.style.cssText =
      'position:fixed;top:0;left:0;width:30px;height:30px;' +
      'pointer-events:none;z-index:2147483646;' +
      'border:2px solid #6366f1;border-radius:50%;' +
      'transform:translate(-15px,-15px) scale(0);opacity:0;'
    document.body.appendChild(ring)
    const set = (x, y) => {
      c.style.transform = 'translate(' + (x - 2) + 'px,' + (y - 2) + 'px)'
    }
    const pulse = (x, y) => {
      ring.style.transition = 'none'
      ring.style.transform = 'translate(' + (x - 15) + 'px,' + (y - 15) + 'px) scale(0.2)'
      ring.style.opacity = '0.9'
      requestAnimationFrame(() => {
        ring.style.transition =
          'transform 380ms cubic-bezier(.2,.7,.3,1), opacity 360ms ease-out'
        ring.style.transform = 'translate(' + (x - 15) + 'px,' + (y - 15) + 'px) scale(1.8)'
        ring.style.opacity = '0'
      })
    }
    const opts = { capture: true, passive: true }
    window.addEventListener('mousemove', e => set(e.clientX, e.clientY), opts)
    window.addEventListener('dragover',  e => set(e.clientX, e.clientY), opts)
    window.addEventListener('drag',      e => { if (e.clientX || e.clientY) set(e.clientX, e.clientY) }, opts)
    window.addEventListener('mousedown', e => { pulse(e.clientX, e.clientY); c.style.filter='brightness(0.85)' }, opts)
    window.addEventListener('mouseup',   () => { c.style.filter='' }, opts)
  })()
`

await mkdir(OUT, { recursive: true })
await rm(VID_TMP, { recursive: true, force: true }).catch(() => {})
await mkdir(VID_TMP, { recursive: true })

const browser = await chromium.launch()

async function login(page) {
  await page.goto(`${DASHBOARD}/login/`)
  await page.waitForLoadState('networkidle')
  await page.fill('input[placeholder="admin"]', USER)
  await page.fill('input[type="password"]', PASS)
  await page.click('button:has-text("Sign in")')
  await page.waitForURL(`${DASHBOARD}/`, { timeout: 15_000 })
}

async function seedRoute(page) {
  // Server is now the source of truth (issue #20). PUT the empty demo
  // route via the dashboard's fetch interceptor so the auth header is
  // automatically attached. Falling back to localStorage keeps this
  // working against a no-gateway dev box.
  await page.evaluate(async route => {
    try {
      await fetch('/config/routes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([route]),
      })
    } catch {}
    try {
      const existing = (() => {
        try { return JSON.parse(localStorage.getItem('ai-gateway:routes') || '[]') }
        catch { return [] }
      })()
      const others = existing.filter(r => r.id !== 'default' && r.id !== route.id)
      localStorage.setItem('ai-gateway:routes', JSON.stringify([route, ...others]))
    } catch {}
  }, EMPTY_ROUTE)
}

/* Drag a palette item to a target point on the canvas.
   Animates the mouse along an intermediate path so the synthetic cursor
   has visible travel time across the canvas (otherwise dragTo jumps
   directly to the target). */
async function dragPaletteToCanvas(page, paletteText, targetX, targetY) {
  const src = page.locator('.w-52 button').filter({ hasText: paletteText }).first()
  const box = await src.boundingBox()
  if (!box) return
  const sx = box.x + box.width / 2
  const sy = box.y + box.height / 2

  // Walk the cursor to the source first (so the user sees it pick up).
  await page.mouse.move(sx, sy, { steps: 24 })
  await page.waitForTimeout(160)
  await page.mouse.down()
  await page.waitForTimeout(140)

  // Compute canvas-relative target → absolute.
  const paneBox = await page.locator('.react-flow__pane').boundingBox()
  const ax = (paneBox?.x ?? 0) + targetX
  const ay = (paneBox?.y ?? 0) + targetY

  // Walk to the drop point so the cursor visibly travels. ReactFlow still
  // needs the HTML5 dragover events, so we follow up with dragTo to fire
  // the right event sequence at the destination.
  await page.mouse.move(ax, ay, { steps: 28 })
  await src.dragTo(page.locator('.react-flow__pane'), {
    targetPosition: { x: targetX, y: targetY },
    force: true,
  })
  await page.mouse.up().catch(() => {})
  await page.waitForTimeout(700)
}

const authCtx = await browser.newContext({ viewport: VIEWPORT })
const authPage = await authCtx.newPage()
await login(authPage)
const STATE = await authCtx.storageState()
await authCtx.close()

/* PNG poster */
{
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, storageState: STATE })
  const page = await ctx.newPage()
  await page.goto(`${DASHBOARD}/`)
  await seedRoute(page)
  await page.goto(`${DASHBOARD}/routing/`)
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.locator('.cursor-pointer').filter({ hasText: 'Drag & Drop Demo' }).first().click().catch(() => {})
  await page.waitForTimeout(2000)
  // For the poster, drop a couple of nodes so the still looks like a real route.
  await dragPaletteToCanvas(page, 'IF / Condition', 540, 380).catch(() => {})
  await dragPaletteToCanvas(page, 'mock-openai',    760, 320).catch(() => {})
  await page.evaluate(CLEAN_JS)
  await page.waitForTimeout(600)
  await page.screenshot({ path: resolve(OUT, 'routing-dragdrop.png'), fullPage: false })
  await ctx.close()
  console.log('[dragdrop] png written')
}

/* Video */
{
  const ctx = await browser.newContext({
    viewport: VIEWPORT, storageState: STATE,
    recordVideo: { dir: VID_TMP, size: VIEWPORT },
  })
  // Inject the synthetic cursor on every navigation in this context so it
  // survives the route-into-canvas transition.
  await ctx.addInitScript(FAKE_CURSOR_JS)

  const page = await ctx.newPage()
  await page.goto(`${DASHBOARD}/`)
  // Reseed (we may have mutated the route during the PNG pass)
  await seedRoute(page)
  await page.goto(`${DASHBOARD}/routing/`)
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(900)

  // Enter the canvas FIRST while toolbar is still visible (no clean yet)
  await page.locator('.cursor-pointer').filter({ hasText: 'Drag & Drop Demo' }).first().click().catch(() => {})
  await page.waitForTimeout(2200)
  // Belt-and-suspenders — re-inject in case the SPA route swap nuked the cursor.
  await page.evaluate(FAKE_CURSOR_JS)

  await page.evaluate(CLEAN_JS)
  await page.waitForTimeout(400)

  // Drag always-visible items so the demo is reliable.
  await dragPaletteToCanvas(page, 'IF / Condition', 500, 380).catch(e => console.warn('drop1:', e.message))
  await page.waitForTimeout(700)
  await dragPaletteToCanvas(page, 'mock-openai',    720, 320).catch(e => console.warn('drop2:', e.message))
  await page.waitForTimeout(700)
  await dragPaletteToCanvas(page, 'mock-anthropic', 720, 460).catch(e => console.warn('drop3:', e.message))
  await page.waitForTimeout(1000)

  const vidPath = await page.video().path()
  await ctx.close()
  const dest = resolve(OUT, 'routing-dragdrop.webm')
  await rm(dest, { force: true })
  await rename(vidPath, dest)

  // Transcode to MP4
  execSync(`ffmpeg -y -loglevel error -i "${dest}" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -an "${resolve(OUT, 'routing-dragdrop.mp4')}"`)
  await rm(dest, { force: true })
  console.log('[dragdrop] mp4 written')
}

await browser.close()
await rm(VID_TMP, { recursive: true, force: true }).catch(() => {})
console.log('[dragdrop] done')
