'use client'
import { Reveal } from './Reveal'
import {
  ArrowRight, Shuffle, DollarSign, ShieldCheck, Users, Plug, FlaskConical,
} from 'lucide-react'

interface Workflow {
  icon: typeof Shuffle
  accent: string
  title: string
  subtitle: string
  flow: { label: string; color: string }[]
}

const WORKFLOWS: Workflow[] = [
  {
    icon: Shuffle,
    accent: '#6366f1',
    title: 'Multi-provider failover',
    subtitle: 'Primary down or rate-limited? Modo retries the same prompt on the next provider transparently — your app never sees the outage.',
    flow: [
      { label: 'Request',        color: '#6366f1' },
      { label: 'OpenAI',         color: '#10b981' },
      { label: 'Anthropic (fallback)', color: '#f59e0b' },
      { label: 'Response',       color: '#10b981' },
    ],
  },
  {
    icon: DollarSign,
    accent: '#22d3ee',
    title: 'Cost-aware routing',
    subtitle: 'Route cheap prompts to gpt-4o-mini, escalate complex ones to gpt-4o. Cut spend by 60% without touching application code.',
    flow: [
      { label: 'Request',        color: '#6366f1' },
      { label: 'IF tokens < 500', color: '#a855f7' },
      { label: 'gpt-4o-mini',    color: '#22d3ee' },
      { label: 'gpt-4o',         color: '#22d3ee' },
    ],
  },
  {
    icon: ShieldCheck,
    accent: '#ef4444',
    title: 'PII compliance',
    subtitle: 'Auto-redact credit cards, SSNs, emails, secrets — in-flight, before prompts ever reach an upstream provider. Audit-logged per request.',
    flow: [
      { label: 'Request',        color: '#6366f1' },
      { label: 'Content Shield', color: '#818cf8' },
      { label: 'Provider',       color: '#10b981' },
      { label: 'Audit log',      color: '#a855f7' },
    ],
  },
  {
    icon: Users,
    accent: '#10b981',
    title: 'Multi-tenant access',
    subtitle: 'Issue per-team gateway keys with rate limits, spend caps, model allowlists and IP filters. Each tenant gets isolated routing + analytics.',
    flow: [
      { label: 'Team A key',     color: '#6366f1' },
      { label: 'Spend cap $50/d', color: '#a855f7' },
      { label: 'Route: prod',    color: '#10b981' },
      { label: 'Response',       color: '#10b981' },
    ],
  },
  {
    icon: Plug,
    accent: '#a855f7',
    title: 'Unified MCP gateway',
    subtitle: 'Register N upstream MCP servers, expose one /mcp endpoint to clients. Tool calls are namespaced, logged and guardrail-checked automatically.',
    flow: [
      { label: 'MCP client',     color: '#6366f1' },
      { label: 'Gateway /mcp',   color: '#818cf8' },
      { label: 'Guardrails',     color: '#ef4444' },
      { label: 'Upstream tool',  color: '#10b981' },
    ],
  },
  {
    icon: FlaskConical,
    accent: '#fbbf24',
    title: 'A/B test models',
    subtitle: 'Split traffic 80/20 between two models, compare cost and latency per cohort in the analytics page, ship the winner with one toggle.',
    flow: [
      { label: 'Request',        color: '#6366f1' },
      { label: '80% cohort',     color: '#10b981' },
      { label: '20% cohort',     color: '#f59e0b' },
      { label: 'Analytics',      color: '#a855f7' },
    ],
  },
]

function FlowDiagram({ steps }: { steps: Workflow['flow'] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap pt-1">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && <ArrowRight size={11} className="t4 flex-shrink-0"/>}
          <div className="px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1.5"
            style={{
              background: `${s.color}14`,
              border: `1px solid ${s.color}40`,
              color: s.color,
            }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}/>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Workflows() {
  return (
    <section id="workflows" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <Reveal as="div" className="text-center mb-16">
          <div className="pill mb-5">Workflows</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            <span className="t1">Common patterns,</span><br/>
            <span className="gradient-text">configured visually</span>
          </h2>
          <p className="text-base t3 max-w-2xl mx-auto">
            Every flow below is a drag-and-drop route in Modo — no config files, no glue code,
            no redeploys to change behaviour.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {WORKFLOWS.map((w, i) => {
            const Icon = w.icon
            return (
              <Reveal key={w.title} as="div" delay={(i % 2) as 0 | 1}>
                <div className="feature-card rounded-2xl p-6 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${w.accent}18`, border: `1px solid ${w.accent}45`, boxShadow: `0 0 24px ${w.accent}22` }}>
                      <Icon size={18} color={w.accent}/>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold t1 mb-1.5">{w.title}</h3>
                      <p className="text-[13px] t3 leading-relaxed">{w.subtitle}</p>
                    </div>
                  </div>
                  <FlowDiagram steps={w.flow}/>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
