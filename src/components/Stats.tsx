'use client'
import { Reveal } from './Reveal'

const STATS = [
  { value: '< 1ms',    label: 'Gateway overhead',  sub: 'measured loopback latency on commodity hardware' },
  { value: '256-dim',  label: 'Semantic cache',    sub: 'local embeddings, zero ML inference' },
  { value: '10+',      label: 'PII detectors',     sub: 'cards, SSN, keys, secrets, IBAN, …' },
]

export function Stats() {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <Reveal as="div">
          <div className="glass-strong rounded-3xl py-10 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{s.value}</div>
                  <div className="text-sm font-semibold t1">{s.label}</div>
                  <div className="text-xs t3 mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
