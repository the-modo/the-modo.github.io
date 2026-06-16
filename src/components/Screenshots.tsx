'use client'
import { useState, useRef, useEffect } from 'react'
import { Reveal } from './Reveal'
import { Window } from './Window'
import { asset } from '@/lib/asset'

const TABS = [
  { id: 'routing',        label: 'Routing',        blurb: 'Drag-and-drop visual flows. Conditions, fallbacks, guardrails — saved and synced to the gateway.' },
  { id: 'overview',       label: 'Overview',       blurb: 'Live request volume, cache hit rate, cost and latency at a glance.' },
  { id: 'mcp',            label: 'MCP Servers',    blurb: 'One unified endpoint in front of every MCP server. Tools namespaced, guardrails applied automatically.' },
  { id: 'logs',           label: 'Logs',           blurb: 'Per-request audit: latency, cost, tokens, full request bodies and the rules that fired.' },
  { id: 'guardrails',     label: 'Guardrails',     blurb: 'Built-in categories + custom rules. Live processing cost shown per-rule in microseconds.' },
  { id: 'content-shield', label: 'Content Shield', blurb: 'Detect and redact cards, SSNs, API keys, secrets and PII — in transit, before any provider sees them.' },
  { id: 'analytics',      label: 'Analytics',      blurb: 'Cost breakdown per model, per provider, per route. Real numbers, no test traffic.' },
  { id: 'access',         label: 'Access',         blurb: 'Issue keys with rate limits, spend caps, route allowlists, MCP scope and TTL auto-revoke.' },
  { id: 'playground',     label: 'Playground',     blurb: 'Send live requests through the gateway — LLM API and MCP tools in one place.' },
  { id: 'settings',       label: 'Settings',       blurb: 'Cache, semantic cache, MCP endpoint, body logging, theme, font size, air-gapped updates.' },
]

export function Screenshots() {
  const [active, setActive] = useState(TABS[0].id)
  const cur = TABS.find(t => t.id === active)!

  // Keep every <video> mounted so tab switching is instant.
  const refs = useRef<Record<string, HTMLVideoElement | null>>({})
  useEffect(() => {
    for (const t of TABS) {
      const v = refs.current[t.id]
      if (!v) continue
      if (t.id === active) { v.currentTime = 0; v.play().catch(() => {}) }
      else v.pause()
    }
  }, [active])

  return (
    <section id="screenshots" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <Reveal as="div" className="text-center mb-12">
          <div className="pill mb-5">Product tour</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            <span className="t1">A modern control plane</span><br/>
            <span className="gradient-text">for production AI traffic</span>
          </h2>
          <p className="text-base t3 max-w-2xl mx-auto">{cur.blurb}</p>
        </Reveal>

        <Reveal as="div" delay={1} className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active === t.id ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40' : 'glass t3 hover:t1'
              }`}>{t.label}</button>
          ))}
        </Reveal>

        <Reveal as="div" delay={2}>
          <div className="max-w-6xl mx-auto">
            <Window title={`modo-ai-gateway · ${cur.label.toLowerCase()}`}>
              <div className="relative bg-[#03050f]" style={{ aspectRatio: '1440 / 900' }}>
                {TABS.map(t => (
                  <video key={t.id}
                    ref={el => { refs.current[t.id] = el }}
                    src={asset(`/screenshots/${t.id}.mp4`)}
                    poster={asset(`/screenshots/${t.id}.png`)}
                    muted loop playsInline preload="auto"
                    style={{ backgroundColor: "#03050f" }}
                    className={`absolute inset-0 w-full h-full select-none transition-opacity duration-200 ${
                      t.id === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    aria-label={`Modo AI Gateway — ${t.label}`}/>
                ))}
              </div>
            </Window>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
