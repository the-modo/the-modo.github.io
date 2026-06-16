'use client'
import Link from 'next/link'
import { Download, Code2, Heart, BookOpen, ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'

export function OpenSource() {
  return (
    <section id="opensource" className="py-28 px-6 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)', filter: 'blur(60px)' }}/>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <Reveal as="div" className="text-center mb-14">
          <div className="pill mb-5">
            <Heart size={11}/> Open source forever
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="t1">Built in the open.</span><br/>
            <span className="gradient-text">Audit every line.</span>
          </h2>
          <p className="text-base md:text-lg t2 max-w-2xl mx-auto leading-relaxed">
            Modo is fully open-source. Read the code, run it offline, fork it. No telemetry,
            no phone-home, no hidden behaviour — what ships in the download is what runs on
            your servers.
          </p>
        </Reveal>

        <Reveal as="div" delay={1}>
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.30)' }}>
                  <Code2 size={20} className="text-indigo-400"/>
                </div>
                <div className="text-3xl font-bold gradient-text">100%</div>
                <div className="text-xs t3 mt-1">Open source · readable, auditable code</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.30)' }}>
                  <BookOpen size={20} className="text-cyan-400"/>
                </div>
                <div className="text-3xl font-bold gradient-text">Zero</div>
                <div className="text-xs t3 mt-1">Vendor lock-in · runs entirely on your hardware</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.30)' }}>
                  <Heart size={20} className="text-emerald-400"/>
                </div>
                <div className="text-3xl font-bold gradient-text">Forever</div>
                <div className="text-xs t3 mt-1">Free for non-commercial use</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/download"
                className="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white">
                <Download size={15}/> Download the source &amp; binaries
              </Link>
              <a href="#pricing"
                className="btn-secondary flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white">
                Read the license <ArrowRight size={14}/>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
