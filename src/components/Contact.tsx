'use client'
import { useState } from 'react'
import { Send, Check, MessageSquare, Building2, Sparkles, AlertCircle } from 'lucide-react'
import { Reveal } from './Reveal'
import { API_BASE } from '@/lib/api'

export function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    intent: 'commercial',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true); setError(null)
    try {
      // Formsubmit.co — free HTTPS form-to-email forwarder.
      const r = await fetch('https://formsubmit.co/ajax/r.dilanperera@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:    form.name,
          email:   form.email,
          company: form.company || '—',
          intent:  form.intent,
          message: form.message,
          _cc:       'shamisathindra@gmail.com',
          _subject:  `Modo contact — ${form.intent} from ${form.name}`,
          _replyto:  form.email,
          _template: 'table',
          _captcha:  'false',
          _autoresponse:
            `Hi ${form.name.split(/\s+/)[0]},\n\n` +
            `Thanks for reaching out about Modo AI Gateway — we've received your ` +
            `${form.intent} inquiry and will reply within 24 hours.\n\n` +
            `— The Modo team`,
        }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || (d?.success !== 'true' && d?.success !== true)) {
        throw new Error(d?.message ?? `Submission failed (${r.status})`)
      }
      setSubmitted(true)
      setForm({ name: '', email: '', company: '', intent: 'commercial', message: '' })
    } catch (err: any) {
      setError(err?.message ?? 'Could not send — please try again later')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal as="div" className="text-center mb-12">
          <div className="pill mb-5">Contact</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            <span className="t1">Let&apos;s talk about</span><br/>
            <span className="gradient-text">your AI infrastructure</span>
          </h2>
          <p className="text-base t3 max-w-2xl mx-auto">
            Commercial licensing, custom features, deployment help, or just curious — we&apos;d love to hear from you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6">
          {/* Channels */}
          <Reveal as="div" delay={1}>
            <div className="space-y-3 h-full">
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.30)' }}>
                    <Building2 size={16} className="text-cyan-300"/>
                  </div>
                  <div>
                    <div className="text-sm font-semibold t1">Commercial</div>
                    <div className="text-xs t3 mt-0.5">Production licensing, SLAs, custom engineering</div>
                  </div>
                </div>
              </div>

              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.30)' }}>
                    <MessageSquare size={16} className="text-emerald-300"/>
                  </div>
                  <div>
                    <div className="text-sm font-semibold t1">Open source</div>
                    <div className="text-xs t3 mt-0.5">Questions, feedback and ideas — drop a message via the form</div>
                  </div>
                </div>
              </div>

              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.30)' }}>
                    <Sparkles size={16} className="text-indigo-300"/>
                  </div>
                  <div>
                    <div className="text-sm font-semibold t1">Response time</div>
                    <div className="text-xs t3 mt-0.5">Typically within 24 hours, faster for commercial inquiries</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal as="div" delay={2}>
            {submitted ? (
              <div className="glass-strong rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.40)' }}>
                  <Check size={24} className="text-emerald-300"/>
                </div>
                <div className="text-xl font-semibold t1 mb-2">Thanks — message received</div>
                <p className="text-sm t3 max-w-md mx-auto leading-relaxed">
                  We&apos;ve got your message and will reply within 24 hours.
                  Meanwhile, feel free to explore the docs and download Modo.
                </p>
                <button onClick={() => setSubmitted(false)}
                  className="btn-secondary mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-7 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] t3 block mb-1.5 font-medium">Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="form-input" placeholder="Jane Smith"/>
                  </div>
                  <div>
                    <label className="text-[11px] t3 block mb-1.5 font-medium">Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="form-input" placeholder="jane@company.com"/>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] t3 block mb-1.5 font-medium">Company <span className="t4 ml-1">(optional)</span></label>
                  <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    className="form-input" placeholder="Acme Inc."/>
                </div>

                <div>
                  <label className="text-[11px] t3 block mb-1.5 font-medium">I&apos;m interested in</label>
                  <select required value={form.intent} onChange={e => setForm(f => ({ ...f, intent: e.target.value }))}
                    className="form-input">
                    <option value="commercial">Commercial license</option>
                    <option value="custom">Custom features / engineering</option>
                    <option value="evaluation">Evaluation help</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] t3 block mb-1.5 font-medium">Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="form-input resize-y"
                    placeholder="Tell us about your use case, traffic volume and timeline…"/>
                </div>

                {error && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 text-[11px] text-red-300">
                    <AlertCircle size={12} className="mt-0.5 flex-shrink-0"/>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white">
                  {submitting ? 'Sending…' : <>Send message <Send size={15}/></>}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
