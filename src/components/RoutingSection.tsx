'use client'
import { GitBranch } from 'lucide-react'
import { Showcase } from './Showcase'
import { asset } from '@/lib/asset'

export function RoutingSection() {
  return (
    <Showcase
      id="routing"
      pill="Routing"
      pillIcon={<GitBranch size={11}/>}
      title={<><span className="t1">Drag &amp; drop</span><br/><span className="gradient-text">your way to production</span></>}
      body="Build the path every request takes — conditions, fallbacks, providers, guardrails, content shield, rate limits — by dragging blocks onto a canvas. Save once, the gateway picks it up live. No YAML files, no redeploys, no glue code."
      bullets={[
        'Visual canvas with snap-to-grid, auto-layout (Beautify), and live test animations through every node',
        'Conditions on model, headers, content, anything — TRUE/FALSE branches with full visibility',
        'Drop any registered provider, plus retries, fallbacks and weighted load-balancing',
        'Same canvas designs both LLM routes and MCP-tool routes — one mental model',
        'Routes are validated and synced atomically — no half-applied configs in production',
      ]}
      video={asset('/screenshots/routing-dragdrop.mp4')}
      poster={asset('/screenshots/routing-dragdrop.png')}
    />
  )
}
