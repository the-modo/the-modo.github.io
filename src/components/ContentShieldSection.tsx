'use client'
import { Lock } from 'lucide-react'
import { asset } from '@/lib/asset'
import { Showcase } from './Showcase'

export function ContentShieldSection() {
  return (
    <Showcase
      id="content-shield"
      pill="Content Shield"
      pillIcon={<Lock size={11}/>}
      title={<><span className="t1">PII never leaves</span><br/><span className="gradient-text">your perimeter</span></>}
      body="Modo scans every prompt and response for sensitive data — cards, SSNs, API keys, emails, IBANs, secrets, health IDs — and redacts in flight. Sensitive values are rewritten before reaching OpenAI, Anthropic, or any upstream provider. No model training data leaks. No support tickets full of customer credentials."
      bullets={[
        '10+ built-in detectors out of the box (CC, SSN, email, phone, API keys, AWS, private keys, IBAN, passport, health IDs)',
        'Add your own regex patterns for domain-specific data (employee IDs, internal endpoints, project codenames)',
        'Three actions per pattern: redact in-flight, flag and log, or block the request entirely',
        'Per-pattern processing cost measured live in microseconds — zero ML runtime, deterministic latency',
        'Scope each rule to prompts, responses, or both — protect both directions',
      ]}
      video={asset("/screenshots/content-shield.mp4")}
      poster={asset("/screenshots/content-shield.png")}
      reverse
    />
  )
}
