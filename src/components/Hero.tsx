'use client'
import Link from 'next/link'
import { ArrowRight, Download, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="pill mx-auto mb-6 animate-fade-in">
          <Sparkles size={11}/> Open source · Written in Rust · Production-ready
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up leading-[1.05]">
          <span className="gradient-text">Open Source Gateway</span><br/>
          <span className="t1">with Everything You Need</span>
        </h1>

        <p className="text-lg md:text-xl t2 max-w-3xl mx-auto mb-9 leading-relaxed animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          Visual routing, real-time content shield, guardrails, semantic caching, and a
          unified MCP endpoint — every guardrail you need for production AI traffic, in
          a single Rust binary.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <Link href="/download"
            className="btn-primary flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white">
            <Download size={15}/> Download Modo <ArrowRight size={14}/>
          </Link>
          <a href="#screenshots"
            className="btn-secondary flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white">
            See it in action
          </a>
        </div>

      </div>
    </section>
  )
}
