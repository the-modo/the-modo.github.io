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
  await page.evaluate(route => {
    const existing = (() => {
      try { return JSON.parse(localStorage.getItem('ai-gateway:routes') || '[]') }
      catch { return [] }
    })()
    const others = existing.filter(r => r.id !== 'default' && r.id !== route.id)
    localStorage.setItem('ai-gateway:routes', JSON.stringify([route, ...others]))
  }, EMPTY_ROUTE)
}

/* Drag a palette item to a target point on the canvas. */
async function dragPaletteToCanvas(page, paletteText, targetX, targetY) {
  const src = page.locator('.w-52 button').filter({ hasText: paletteText }).first()
  const box = await src.boundingBox()
  if (!box) return
  const sx = box.x + box.width / 2
  const sy = box.y + box.height / 2
  await page.mouse.move(sx, sy)
  await page.mouse.down()
  // ReactFlow listens on dragenter/dragover — we need a *real* HTML5 drag, not
  // mouse-move. Playwright's `dragTo` fires the proper events.
  await src.dragTo(page.locator('.react-flow__pane'), {
    targetPosition: { x: targetX, y: targetY },
    force: true,
  })
  await page.mouse.up().catch(() => {})
  await page.waitForTimeout(600)
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
