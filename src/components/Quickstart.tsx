'use client'
import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { Reveal } from './Reveal'

const STEPS = [
  {
    label: 'Install',
    code: '<span class="c"># Clone &amp; build with Cargo</span>\ngit clone https://github.com/theaigateway/aigateway\ncd aigateway\ncargo build --release',
  },
  {
    label: 'Configure',
    code: '<span class="c"># gateway.toml</span>\n[[<span class="k">providers</span>]]\nname = <span class="s">"openai-primary"</span>\nkind = <span class="s">"openai"</span>\nbase_url = <span class="s">"https://api.openai.com"</span>\napi_key_env = <span class="s">"OPENAI_API_KEY"</span>\nmodels = [<span class="s">"gpt-4o"</span>, <span class="s">"gpt-4o-mini"</span>]',
  },
  {
    label: 'Run',
    code: '<span class="c"># Drop-in OpenAI replacement</span>\n./target/release/modo-ai-gateway\n\n<span class="c"># In your client</span>\nclient = OpenAI(\n  base_url=<span class="s">"http://localhost:4891/v1"</span>,\n  api_key=<span class="s">"sk-gw-…"</span>,\n)',
  },
]

export function Quickstart() {
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const cur = STEPS[tab]

  const copy = () => {
    const text = cur.code.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')
    try {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text)
      else {
        const ta = document.createElement('textarea')
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
        document.body.appendChild(ta); ta.select()
        document.execCommand('copy'); document.body.removeChild(ta)
      }
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal as="div" className="text-center mb-10">
          <div className="pill mb-5"><Terminal size={11}/> Quick start</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            <span className="t1">From clone to</span> <span className="gradient-text">routed request</span> <span className="t1">in 60 seconds</span>
          </h2>
        </Reveal>

        <Reveal as="div" delay={1}>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.40)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-white/5">
              {STEPS.map((s, i) => (
                <button key={s.label} onClick={() => setTab(i)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${tab === i ? 'bg-white/10 text-white' : 't3 hover:text-white'}`}>
                  {i + 1}. {s.label}
                </button>
              ))}
              <button onClick={copy} className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] t3 hover:text-white transition-colors">
                {copied ? <><Check size={11}/>Copied</> : <><Copy size={11}/>Copy</>}
              </button>
            </div>
            <pre className="px-6 py-5 text-[12px] leading-relaxed overflow-x-auto"
              style={{ fontFamily: "'SF Mono', Menlo, Monaco, Consolas, monospace", color: 'rgba(255,255,255,0.85)' }}
              dangerouslySetInnerHTML={{ __html: cur.code }}/>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
