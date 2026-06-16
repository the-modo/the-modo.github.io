'use client'
import { ShieldAlert } from 'lucide-react'
import { asset } from '@/lib/asset'
import { Showcase } from './Showcase'

export function GuardrailsSection() {
  return (
    <Showcase
      id="guardrails"
      pill="Guardrails"
      pillIcon={<ShieldAlert size={11}/>}
      title={<><span className="t1">Policy enforced</span><br/><span className="gradient-text">before any provider sees a prompt</span></>}
      body="Block prompt-injection attempts, profanity, toxic content, sensitive topics — anything you can describe with a keyword or regex. Modo scans every prompt and response, and either flags for audit or blocks the request entirely. All deterministic, all measured."
      bullets={[
        'Built-in categories: prompt injection, profanity, PII, toxic content, sensitive topics — extend with custom rules',
        'Flag (audit + pass) or block (reject with 400) — chosen per rule and per scope',
        'Apply to prompts only, responses only, or both — same engine on both sides of the call',
        'Every activation recorded with the request, surfaced in the logs trace view',
        'Live processing cost shown in microseconds for each rule, so you never wonder which one is slow',
      ]}
      video={asset("/screenshots/guardrails.mp4")}
      poster={asset("/screenshots/guardrails.png")}
    />
  )
}
