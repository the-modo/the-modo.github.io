'use client'
import Link from 'next/link'
import { Check, ArrowRight, Building2, Heart } from 'lucide-react'
import { Reveal } from './Reveal'

const NON_COMMERCIAL = [
  'Full source code included',
  'Unlimited self-hosted deployments',
  'Every feature — no paywalled tiers',
  'Personal, research, education, evaluation, hobby projects',
  'Public benefit, non-profit and academic use',
  'No telemetry, no phone-home, no data collection',
]

const COMMERCIAL = [
  'Commercial license & legal coverage',
  'Production SLA & priority support',
  'Hardened release channel & security advisories',
  'Air-gapped & private-registry deployments',
  'Custom features, integration & on-site engineering',
  'Pricing scaled to your traffic and seat count',
]

export function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal as="div" className="text-center mb-14">
          <div className="pill mb-5">License</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            <span className="t1">Free for non-commercial use.</span><br/>
            <span className="gradient-text">Commercial? Let&apos;s talk.</span>
          </h2>
          <p className="text-base t3 max-w-2xl mx-auto">
            Modo is open-source and free for personal, research, academic and non-commercial
            deployments — forever. For commercial production use, a commercial license unlocks
            support, SLAs and legal coverage.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal as="div" delay={1}>
            <div className="glass-strong rounded-3xl p-8 h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.30)' }}>
                <Heart size={20} className="text-emerald-400"/>
              </div>
              <h3 className="text-2xl font-bold t1 mb-1">Open source</h3>
              <p className="text-sm t3 mb-1">Non-commercial use</p>
              <div className="mt-5 mb-5">
                <span className="text-5xl font-bold gradient-text">$0</span>
                <span className="text-sm t3 ml-2">forever</span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {NON_COMMERCIAL.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm t2">
                    <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0"/>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/download"
                className="btn-secondary flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white">
                Download Modo <ArrowRight size={14}/>
              </Link>
            </div>
          </Reveal>

          <Reveal as="div" delay={2}>
            <div className="rounded-3xl p-8 h-full flex flex-col relative overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(99,102,241,0.18) 0%, rgba(34,211,238,0.10) 100%)',
                border: '1px solid rgba(99,102,241,0.40)',
                boxShadow: '0 30px 60px -20px rgba(99,102,241,0.30)',
              }}>
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}>
                For business
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.50)' }}>
                <Building2 size={20} className="text-indigo-200"/>
              </div>
              <h3 className="text-2xl font-bold t1 mb-1">Commercial</h3>
              <p className="text-sm t2 mb-1">Production deployments</p>
              <div className="mt-5 mb-5">
                <span className="text-3xl font-bold t1">Custom pricing</span>
              </div>
              <ul className="space-y-2.5 mb-7 flex-1">
                {COMMERCIAL.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm t1">
                    <Check size={14} className="text-cyan-300 mt-0.5 flex-shrink-0"/>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact"
                className="btn-primary flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white">
                Contact sales <ArrowRight size={14}/>
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal as="div" delay={3} className="text-center text-[11px] t4 mt-8 max-w-2xl mx-auto">
          Not sure which fits you? Personal projects, internal experiments, classroom use and
          research are always free. If you&apos;re routing paid customer traffic through it,
          reach out — we&apos;ll figure out a fair price together.
        </Reveal>
      </div>
    </section>
  )
}
