'use client'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { Window } from './Window'

interface ShowcaseProps {
  id: string
  pill: string
  pillIcon?: React.ReactNode
  title: React.ReactNode
  body: string
  bullets: string[]
  video: string
  poster: string
  reverse?: boolean
  ctaHref?: string
  ctaLabel?: string
}

export function Showcase({
  id, pill, pillIcon, title, body, bullets, video, poster,
  reverse = false, ctaHref, ctaLabel,
}: ShowcaseProps) {
  return (
    <section id={id} className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:[direction:rtl]' : ''}`}>
          <Reveal as="div" className="space-y-5 lg:[direction:ltr]">
            <div className="pill">
              {pillIcon}{pill}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">{title}</h2>
            <p className="text-base t2 leading-relaxed">{body}</p>
            <ul className="space-y-2.5 pt-1">
              {bullets.map(b => (
                <li key={b} className="flex items-start gap-2.5 text-sm t2">
                  <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0"/>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {ctaHref && (
              <div className="pt-2">
                <Link href={ctaHref}
                  className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white">
                  {ctaLabel ?? 'Learn more'} <ArrowRight size={14}/>
                </Link>
              </div>
            )}
          </Reveal>

          <Reveal as="div" delay={1} className="lg:[direction:ltr]">
            <Window title={`modo-ai-gateway · ${id}`}>
              <video
style={{ backgroundColor: "#03050f" }}                 src={video}
                poster={poster}
                autoPlay muted loop playsInline preload="auto"
                className="block w-full h-auto select-none"
                aria-label={pill}/>
            </Window>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
