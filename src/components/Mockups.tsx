/* ─────────────────────────────────────────────────────────────────────
   Realistic SVG renders of each dashboard page.
   Designed to read as polished screenshots at any size.
   ───────────────────────────────────────────────────────────────────── */

import { ModoLogo } from './Brand'

const NAV = [
  { label: 'Overview',       icon: 'box',  active: true },
  { label: 'Analytics',      icon: 'bar' },
  { label: 'Logs',           icon: 'list' },
  { label: 'Providers',      icon: 'srv' },
  { label: 'Routing',        icon: 'flow' },
  { label: 'MCP Servers',    icon: 'plug' },
  { label: 'Guardrails',     icon: 'shield' },
  { label: 'Content Shield', icon: 'lock' },
  { label: 'Access',         icon: 'key' },
  { label: 'Playground',     icon: 'play' },
  { label: 'Settings',       icon: 'cog' },
]

function Sidebar({ active }: { active: string }) {
  return (
    <aside className="w-44 flex-shrink-0 flex flex-col py-4 px-2.5"
      style={{ background: 'linear-gradient(175deg, rgba(18,22,58,0.86) 0%, rgba(6,8,26,0.92) 100%)' }}>
      <div className="px-2.5 pb-4 mb-2 border-b border-white/10 flex items-center gap-2">
        <ModoLogo size={20}/>
        <span className="text-[11px] font-bold gradient-text">Modo</span>
      </div>
      <div className="space-y-0.5">
        {NAV.map(n => {
          const isActive = n.label === active
          return (
            <div key={n.label}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${isActive ? 'text-white' : 'text-white/55'}`}
              style={isActive ? {
                background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                boxShadow: '0 4px 14px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.22)',
              } : undefined}>
              <div className="w-2 h-2 rounded-sm"
                style={{ background: isActive ? '#fff' : 'rgba(255,255,255,0.32)' }}/>
              {n.label}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

/* ─── Reusable bits ───────────────────────────────────────────────── */

function Card({ label, value, accent, delta, sparkline }: {
  label: string; value: string; accent: string; delta?: string; sparkline?: number[]
}) {
  const w = 110, h = 28
  const max = sparkline ? Math.max(...sparkline) : 1
  const path = sparkline
    ? sparkline.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (sparkline.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ')
    : null
  return (
    <div className="rounded-xl p-3"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[8px] text-white/55 font-medium">{label}</span>
        <div className="w-4 h-4 rounded" style={{ background: accent }}/>
      </div>
      <div className="text-base font-bold text-white">{value}</div>
      {delta && <div className="text-[8px] text-white/40 mt-0.5">{delta}</div>}
      {path && (
        <svg width={w} height={h} className="mt-1">
          <path d={path} stroke={accent} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  )
}

/* ─── Overview ────────────────────────────────────────────────────── */

export function OverviewMockup() {
  const reqSeries = [22, 30, 28, 38, 45, 42, 55, 70, 60, 78, 85, 90, 82]
  const cacheSeries = [10, 12, 14, 18, 22, 25, 30, 28, 34, 38, 40, 45, 42]
  const max = Math.max(...reqSeries, ...cacheSeries)

  return (
    <div className="flex" style={{ height: 380 }}>
      <Sidebar active="Overview"/>
      <main className="flex-1 p-5 overflow-hidden">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-base font-bold gradient-text">Overview</div>
            <div className="text-[10px] text-white/45">Real-time gateway performance &amp; usage</div>
          </div>
          <div className="flex items-center gap-1.5">
            {['1h','24h','7d','30d'].map((p, i) => (
              <div key={p} className={`px-2 py-1 rounded-md text-[9px] font-medium ${i === 2 ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30' : 'text-white/40'}`}>
                {p}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          <Card label="Requests today"   value="2.4k"    accent="rgba(99,102,241,0.20)"  delta="0.3% errors"   sparkline={reqSeries}/>
          <Card label="Gateway latency"  value="187 ms"  accent="rgba(34,211,238,0.20)"  delta="avg end-to-end" sparkline={[20,22,18,25,21,23,19,18,17,15,18,16,14]}/>
          <Card label="Cache hit rate"   value="34.2%"   accent="rgba(16,185,129,0.20)"  delta="812 hits"      sparkline={cacheSeries}/>
          <Card label="Cost today"       value="$12.40"  accent="rgba(168,85,247,0.20)"  delta="184k tokens"   sparkline={[5,7,8,12,15,18,22,24,28,32,35,40,38]}/>
        </div>

        <div className="rounded-xl p-3.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[11px] font-semibold text-white">Request volume</div>
            <div className="flex items-center gap-3 text-[9px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-indigo-500"/><span className="text-white/55">Requests</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-cyan-400"/><span className="text-white/55">Cached</span></div>
            </div>
          </div>
          <svg viewBox="0 0 580 140" className="w-full">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.30"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.30"/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1="0" x2="580" y1={i * 30 + 8} y2={i * 30 + 8} stroke="rgba(255,255,255,0.06)"/>
            ))}
            {(() => {
              const pts = reqSeries.map((v, i) => `${(i / (reqSeries.length - 1)) * 580},${130 - (v / max) * 120}`)
              const fill = `M ${pts[0]} L ${pts.slice(1).join(' L ')} L 580,130 L 0,130 Z`
              const line = `M ${pts.join(' L ')}`
              const pts2 = cacheSeries.map((v, i) => `${(i / (cacheSeries.length - 1)) * 580},${130 - (v / max) * 120}`)
              const fill2 = `M ${pts2[0]} L ${pts2.slice(1).join(' L ')} L 580,130 L 0,130 Z`
              const line2 = `M ${pts2.join(' L ')}`
              return (
                <>
                  <path d={fill}  fill="url(#g1)"/>
                  <path d={line}  stroke="#6366f1" strokeWidth="2" fill="none"/>
                  <path d={fill2} fill="url(#g2)"/>
                  <path d={line2} stroke="#22d3ee" strokeWidth="2" fill="none"/>
                </>
              )
            })()}
          </svg>
        </div>
      </main>
    </div>
  )
}

/* ─── Routing canvas ──────────────────────────────────────────────── */

export function RoutingMockup() {
  const dotGrid = []
  for (let x = 16; x < 560; x += 22) for (let y = 16; y < 280; y += 22) dotGrid.push(<circle key={`${x},${y}`} cx={x} cy={y} r="0.8" fill="rgba(255,255,255,0.06)"/>)

  return (
    <div className="flex" style={{ height: 380 }}>
      <Sidebar active="Routing"/>
      <main className="flex-1 p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-base font-bold gradient-text">Routing</div>
            <div className="text-[10px] text-white/45">Visual flows for LLM traffic and MCP tool calls</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="px-2 py-1 rounded-md text-[9px] text-white/55 bg-white/5 ring-1 ring-white/10">Beautify</div>
            <div className="px-2.5 py-1 rounded-md text-[9px] font-medium text-indigo-300 bg-indigo-500/15 ring-1 ring-indigo-500/30">Save</div>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Palette */}
          <div className="w-32 flex-shrink-0 p-2 border-r border-white/5 space-y-1">
            <div className="text-[8px] text-white/35 uppercase tracking-wider px-1 mb-1">Logic</div>
            {['IF / Condition', 'Request', 'Response'].map(t => (
              <div key={t} className="px-2 py-1 rounded-md text-[9px] text-white/70"
                style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.20)' }}>{t}</div>
            ))}
            <div className="text-[8px] text-white/35 uppercase tracking-wider px-1 mt-2 mb-1">Providers</div>
            {[['OpenAI','99,102,241'],['Anthropic','245,158,11'],['Gemini','16,185,129']].map(([n, c]) => (
              <div key={n} className="px-2 py-1 rounded-md text-[9px] text-white/70"
                style={{ background: `rgba(${c},0.08)`, border: `1px solid rgba(${c},0.20)` }}>{n}</div>
            ))}
          </div>
          {/* Canvas */}
          <svg viewBox="0 0 580 296" className="flex-1">
            {dotGrid}
            <defs>
              <filter id="glow-r" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Edges */}
            <path d="M 80,150 C 130,150 130,90 200,90" stroke="#6366f1" strokeWidth="1.8" fill="none" filter="url(#glow-r)"/>
            <path d="M 80,150 C 130,150 130,150 200,150" stroke="#6366f1" strokeWidth="1.8" fill="none" filter="url(#glow-r)"/>
            <path d="M 80,150 C 130,150 130,210 200,210" stroke="#6366f1" strokeWidth="1.8" fill="none" filter="url(#glow-r)"/>
            <path d="M 280,90  C 360,90  360,150 440,150" stroke="#10b981" strokeWidth="1.8" fill="none" filter="url(#glow-r)"/>
            <path d="M 280,150 C 360,150 360,150 440,150" stroke="#10b981" strokeWidth="1.8" fill="none" filter="url(#glow-r)"/>
            <path d="M 280,210 C 360,210 360,150 440,150" stroke="#10b981" strokeWidth="1.8" fill="none" filter="url(#glow-r)"/>
            {/* Request */}
            <g>
              <rect x="20" y="125" width="60" height="50" rx="10" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.40)"/>
              <text x="50" y="148" fontSize="10" fontWeight="700" fill="#a5b4fc" textAnchor="middle">Request</text>
              <text x="50" y="162" fontSize="7" fill="rgba(255,255,255,0.4)" textAnchor="middle">payload.model</text>
            </g>
            {/* IF Condition */}
            <g>
              <rect x="200" y="65" width="80" height="50" rx="10" fill="rgba(168,85,247,0.10)" stroke="rgba(168,85,247,0.32)"/>
              <text x="240" y="86" fontSize="10" fontWeight="700" fill="#c084fc" textAnchor="middle">IF model</text>
              <text x="240" y="98" fontSize="7" fill="rgba(255,255,255,0.45)" textAnchor="middle">= openai/gpt-4o</text>
              <text x="240" y="110" fontSize="6" fill="#10b981" textAnchor="end" x2="276">TRUE</text>
            </g>
            {/* Providers */}
            <g>
              <rect x="200" y="125" width="80" height="50" rx="10" fill="rgba(245,158,11,0.10)" stroke="rgba(245,158,11,0.30)"/>
              <circle cx="216" cy="150" r="6" fill="rgba(245,158,11,0.30)"/>
              <text x="226" y="146" fontSize="9" fontWeight="700" fill="#fbbf24">OpenAI</text>
              <text x="226" y="158" fontSize="7" fill="rgba(255,255,255,0.4)">weight 100</text>
            </g>
            <g>
              <rect x="200" y="185" width="80" height="50" rx="10" fill="rgba(245,158,11,0.10)" stroke="rgba(245,158,11,0.30)"/>
              <circle cx="216" cy="210" r="6" fill="rgba(245,158,11,0.30)"/>
              <text x="226" y="206" fontSize="9" fontWeight="700" fill="#fbbf24">Anthropic</text>
              <text x="226" y="218" fontSize="7" fill="rgba(255,255,255,0.4)">fallback</text>
            </g>
            {/* Response */}
            <g>
              <rect x="440" y="125" width="60" height="50" rx="10" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.35)"/>
              <text x="470" y="148" fontSize="10" fontWeight="700" fill="#34d399" textAnchor="middle">Response</text>
              <text x="470" y="162" fontSize="7" fill="rgba(255,255,255,0.4)" textAnchor="middle">200 OK</text>
            </g>
          </svg>
        </div>
      </main>
    </div>
  )
}

/* ─── MCP page ────────────────────────────────────────────────────── */

export function McpMockup() {
  const servers = [
    { name: 'GitHub MCP', tools: 14, status: 'online' },
    { name: 'Filesystem',  tools: 6,  status: 'online' },
    { name: 'Postgres',    tools: 9,  status: 'online' },
    { name: 'Slack',       tools: 7,  status: 'online' },
  ]
  return (
    <div className="flex" style={{ height: 380 }}>
      <Sidebar active="MCP Servers"/>
      <main className="flex-1 p-5 overflow-hidden">
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#818cf8"><path d="M13.85 0a4.16 4.16 0 0 0-2.95 1.217L1.456 10.66a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l9.442-9.442a2.49 2.49 0 0 1 3.541 0 2.49 2.49 0 0 1 0 3.541L8.59 12.97l-.1.1a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l.1-.098 7.03-7.034a2.49 2.49 0 0 1 3.542 0l.049.05a2.49 2.49 0 0 1 0 3.54l-8.54 8.54a1.96 1.96 0 0 0 0 2.755l1.753 1.753a.835.835 0 0 0 1.18 0 .835.835 0 0 0 0-1.18l-1.753-1.753a.266.266 0 0 1 0-.394l8.54-8.54a4.185 4.185 0 0 0 0-5.9l-.05-.05a4.16 4.16 0 0 0-2.95-1.218z"/></svg>
            <div className="text-base font-bold gradient-text">MCP Servers</div>
          </div>
          <div className="text-[10px] text-white/45">One endpoint in front of every MCP server — guardrails and content shield apply automatically</div>
        </div>
        <div className="rounded-xl p-3 mb-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-[9px] text-white/45 uppercase tracking-wider mb-1.5">Gateway endpoint</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-lg text-[10px] font-mono text-white/85"
              style={{ background: 'rgba(0,0,0,0.40)', border: '1px solid rgba(255,255,255,0.06)' }}>
              https://gateway.your-domain.com/mcp
            </code>
            <div className="px-3 py-2 rounded-lg text-[10px] text-indigo-300 bg-indigo-500/15 ring-1 ring-indigo-500/30">Copy</div>
          </div>
        </div>
        <div className="space-y-2">
          {servers.map(s => (
            <div key={s.name} className="flex items-center gap-3 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.30)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#34d399"><path d="M7 2h10v6h-2V4H9v4H7zm-2 8h14v12H5zm7 2a3 3 0 100 6 3 3 0 000-6"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-white">{s.name}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                    online · {s.tools} tools
                  </span>
                </div>
                <div className="text-[9px] text-white/40 font-mono mt-0.5">https://mcp.example.com/{s.name.toLowerCase().replace(/\s+/g, '')}</div>
              </div>
              <div className="w-10 h-5 rounded-full relative bg-indigo-500">
                <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white"/>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

/* ─── Logs ────────────────────────────────────────────────────────── */

export function LogsMockup() {
  const logs = [
    { id: 'req_8f2a91c3a4be4eda', time: '14:22:08', model: 'openai/gpt-4o',          provider: 'openai',     status: 200, latency: '342ms', tok: '1.2k', cost: '$0.0420', cached: false },
    { id: 'req_e1c5380dbf41a7d2', time: '14:21:54', model: 'anthropic/sonnet-4-6',   provider: 'anthropic',  status: 200, latency: '218ms', tok: '840',  cost: '$0.0156', cached: false },
    { id: 'req_22a06fbc09e3f8a1', time: '14:21:42', model: 'openai/gpt-4o',          provider: 'cache',      status: 200, latency: '4ms',   tok: '0',    cost: '$0.0000', cached: true  },
    { id: 'req_b7d8e29a13c4f5b6', time: '14:21:30', model: 'gemini/gemini-2.0',      provider: 'gemini',     status: 200, latency: '512ms', tok: '2.4k', cost: '$0.0312', cached: false },
    { id: 'req_4af7c1e809d6a3b2', time: '14:21:18', model: 'openai/gpt-4o-mini',     provider: 'openai',     status: 200, latency: '156ms', tok: '420',  cost: '$0.0006', cached: false },
    { id: 'req_dec3f1582ab69470', time: '14:20:55', model: 'anthropic/sonnet-4-6',   provider: 'anthropic',  status: 429, latency: '88ms',  tok: '0',    cost: '$0.0000', cached: false },
    { id: 'req_50923e4cabd178fe', time: '14:20:39', model: 'openai/gpt-4o',          provider: 'openai',     status: 200, latency: '298ms', tok: '1.5k', cost: '$0.0525', cached: false },
  ]
  return (
    <div className="flex" style={{ height: 380 }}>
      <Sidebar active="Logs"/>
      <main className="flex-1 p-5 overflow-hidden">
        <div className="mb-3">
          <div className="text-base font-bold gradient-text">Request Logs</div>
          <div className="text-[10px] text-white/45">Per-request audit trail — latency, cost, tokens &amp; body capture</div>
        </div>
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="grid gap-2 px-3 py-2 border-b border-white/5 text-[8px] uppercase tracking-wider text-white/40 font-medium"
            style={{ gridTemplateColumns: '160px 64px 1fr 84px 50px 56px 54px 58px' }}>
            <span>Request ID</span><span>Time</span><span>Model</span><span>Provider</span>
            <span className="text-right">Status</span><span className="text-right">Latency</span><span className="text-right">Tokens</span><span className="text-right">Cost</span>
          </div>
          {logs.map(l => (
            <div key={l.id} className="grid gap-2 px-3 py-2 border-b border-white/5 last:border-0 text-[9.5px]"
              style={{ gridTemplateColumns: '160px 64px 1fr 84px 50px 56px 54px 58px' }}>
              <span className="font-mono text-white/70 truncate">{l.id}</span>
              <span className="text-white/55 font-mono">{l.time}</span>
              <span className="text-white truncate">{l.model}</span>
              <span className="text-white/65 truncate">{l.provider}</span>
              <span className={`text-right font-medium ${l.status >= 400 ? 'text-red-400' : 'text-emerald-400'}`}>{l.status}</span>
              <span className="text-right text-white/65">{l.latency}</span>
              <span className="text-right text-white/65">{l.tok}</span>
              <span className="text-right text-white/85 font-medium">{l.cost}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

/* ─── Guardrails ──────────────────────────────────────────────────── */

export function GuardrailsMockup() {
  const cats = [
    { label: 'Prompt Injection',       count: 14, color: '#ef4444', us: 8.4 },
    { label: 'Profanity',              count:  9, color: '#f59e0b', us: 5.2 },
    { label: 'Toxic Content',          count: 22, color: '#ef4444', us: 12.6 },
    { label: 'PII (request)',          count: 11, color: '#a78bfa', us: 4.1 },
    { label: 'Sensitive Topics',       count:  7, color: '#22d3ee', us: 6.8 },
  ]
  return (
    <div className="flex" style={{ height: 380 }}>
      <Sidebar active="Guardrails"/>
      <main className="flex-1 p-5 overflow-hidden">
        <div className="mb-3">
          <div className="text-base font-bold gradient-text">Guardrails</div>
          <div className="text-[10px] text-white/45">Keyword and regex matching enforced on every prompt and response</div>
        </div>
        <div className="grid grid-cols-4 gap-2.5 mb-3">
          <Card label="Scanned (7d)" value="12,847" accent="rgba(99,102,241,0.20)" delta="last 7 days"/>
          <Card label="Flagged"      value="234"    accent="rgba(245,158,11,0.20)" delta="1.8% of traffic"/>
          <Card label="Blocked"      value="89"     accent="rgba(239,68,68,0.20)"  delta="0.7% of traffic"/>
          <Card label="Rule sets"    value="11"     accent="rgba(16,185,129,0.20)" delta="73 keywords"/>
        </div>
        <div className="space-y-2">
          {cats.map(c => (
            <div key={c.label} className="flex items-center gap-3 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${c.color}20`, border: `1px solid ${c.color}50` }}>
                <div className="w-2 h-2 rounded-sm" style={{ background: c.color }}/>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-white">{c.label}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-md text-cyan-300 bg-cyan-500/10 ring-1 ring-cyan-500/25 font-mono">~{c.us}µs</span>
                </div>
                <div className="text-[9px] text-white/45">{c.count} keywords · regex patterns enabled</div>
              </div>
              <div className="w-10 h-5 rounded-full relative bg-indigo-500">
                <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white"/>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

/* ─── Analytics — cost ────────────────────────────────────────────── */

export function AnalyticsMockup() {
  const bars = [
    { name: 'openai/gpt-4o',         cost: 8.42, color: '#a855f7' },
    { name: 'anthropic/opus-4-7',    cost: 6.10, color: '#6366f1' },
    { name: 'openai/o1',             cost: 3.85, color: '#22d3ee' },
    { name: 'gemini/gemini-2.0',     cost: 1.92, color: '#10b981' },
    { name: 'openai/gpt-4o-mini',    cost: 0.45, color: '#f59e0b' },
  ]
  const max = Math.max(...bars.map(b => b.cost))
  return (
    <div className="flex" style={{ height: 380 }}>
      <Sidebar active="Analytics"/>
      <main className="flex-1 p-5 overflow-hidden">
        <div className="mb-3">
          <div className="text-base font-bold gradient-text">Analytics — Cost</div>
          <div className="text-[10px] text-white/45">Per-model spend, token usage and breakdown</div>
        </div>
        <div className="grid grid-cols-4 gap-2.5 mb-3">
          <Card label="Total cost"          value="$20.74" accent="rgba(168,85,247,0.20)" delta="in period"/>
          <Card label="Avg / request"        value="$0.0086" accent="rgba(99,102,241,0.20)" delta="mean per call"/>
          <Card label="Total tokens"         value="184k"   accent="rgba(34,211,238,0.20)" delta="prompt + completion"/>
          <Card label="Top cost model"       value="gpt-4o" accent="rgba(245,158,11,0.20)" delta="$8.42"/>
        </div>
        <div className="rounded-xl p-3.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-[11px] font-semibold text-white mb-2">Cost by model</div>
          <div className="space-y-1.5">
            {bars.map(b => (
              <div key={b.name} className="flex items-center gap-3">
                <span className="w-32 text-[10px] text-white/75 font-mono truncate">{b.name}</span>
                <div className="flex-1 h-3.5 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-full rounded-md" style={{ width: `${(b.cost / max) * 100}%`, background: b.color }}/>
                </div>
                <span className="w-14 text-right text-[10px] font-semibold text-white">${b.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
