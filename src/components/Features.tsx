'use client'
import { useEffect } from 'react'
import {
  Zap, GitBranch, Database, ShieldAlert, Lock,
  Activity, KeyRound, Cpu, LineChart,
} from 'lucide-react'
import { Reveal } from './Reveal'

const FEATURES = [
  {
    icon: GitBranch, accent: '#6366f1',
    title: 'Visual routing canvas',
    body: 'Drag and drop providers, conditions, fallbacks and guardrails. Save once, deployed everywhere — no config files to hand-edit.',
  },
  {
    icon: Database, accent: '#22d3ee',
    title: 'Semantic cache',
    body: 'Local embeddings match paraphrased prompts at the gateway. Save real money on identical-meaning calls without sacrificing freshness.',
  },
  {
    icon: ShieldAlert, accent: '#ef4444',
    title: 'Guardrails on every call',
    body: 'Keyword and regex rules enforced on prompts and responses. Per-rule processing cost shown live in microseconds.',
  },
  {
    icon: Lock, accent: '#818cf8',
    title: 'Content shield',
    body: 'Built-in detectors for cards, SSNs, API keys, secrets, PII and more. Redact in transit or block — your data never leaves the perimeter.',
  },
  {
    icon: Cpu, accent: '#10b981',
    title: 'MCP gateway',
    body: 'One unified /mcp endpoint in front of every Model Context Protocol server. Per-tool routing, rate limits, guardrails — applied automatically.',
  },
  {
    icon: LineChart, accent: '#a855f7',
    title: 'Real-time analytics',
    body: 'Token counts, cost per model, cache hit rate, latency percentiles. Logs page shows the full request trace with every activation.',
  },
  {
    icon: KeyRound, accent: '#fbbf24',
    title: 'Keys, quotas & spend caps',
    body: 'Issue gateway keys with rate limits, spend caps, model and route allowlists, IP filters and TTL auto-revoke. Auto-generated developer docs per key.',
  },
  {
    icon: Activity, accent: '#22d3ee',
    title: 'Air-gapped updates',
    body: 'Upload signed release packages directly to the gateway. Perfect for SOC2/HIPAA environments where the box never touches the public internet.',
  },
  {
    icon: Zap, accent: '#6366f1',
    title: 'Sub-2µs overhead',
    body: 'Written in async Rust on top of axum and tokio. Zero-copy hot path. Single static binary deploys anywhere.',
  },
]

export function Features() {
  // Move-with-mouse glow on feature cards
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.feature-card') as HTMLElement | null
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section id="features" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal as="div" className="text-center mb-16">
          <div className="pill mb-5">Features</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            <span className="t1">Everything your stack needs.</span><br/>
            <span className="gradient-text">Nothing it doesn&apos;t.</span>
          </h2>
          <p className="text-base t3 max-w-2xl mx-auto">
            Modo is the only AI gateway you need: routing, caching, guardrails, content shield,
            MCP and analytics — all measured, all enforced, all in one binary.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <Reveal key={f.title} as="div" delay={(i % 3) as 0 | 1 | 2}>
                <div className="feature-card rounded-2xl p-6 h-full">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}45`, boxShadow: `0 0 24px ${f.accent}22` }}>
                    <Icon size={18} color={f.accent}/>
                  </div>
                  <h3 className="text-base font-semibold t1 mb-2">{f.title}</h3>
                  <p className="text-sm t3 leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
