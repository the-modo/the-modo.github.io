'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Check, Download, Mail, Scale, AlertTriangle, Sparkles,
} from 'lucide-react'
import { ModoLogo } from '@/components/Brand'
import { API_BASE } from '@/lib/api'

export default function DownloadPage() {
  const [email, setEmail]   = useState('')
  const [name,  setName]    = useState('')
  const [agree, setAgree]   = useState(false)
  const [busy,  setBusy]    = useState(false)
  const [sent,  setSent]    = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(null)
    const firstName = (name || email.split('@')[0]).split(/\s+/)[0]
    try {
      // Formsubmit.co — free HTTPS form-to-email service. First POST to a
      // new recipient triggers a one-time "activate" email; after one click
      // every subsequent submission is forwarded with CC + autoresponse.
      const r = await fetch('https://formsubmit.co/ajax/r.dilanperera@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:  name || '—',
          email,
          _cc:        'shamisathindra@gmail.com',
          _subject:   `Modo AI Gateway — download request from ${name || email}`,
          _replyto:   email,
          _template:  'table',
          _captcha:   'false',
          _autoresponse:
            `Hi ${firstName},\n\n` +
            `Thanks for downloading Modo AI Gateway — the fastest open-source AI gateway, written in Rust.\n\n` +
            `Your download:\n  http://dilans.duckdns.org:4893/modo-latest.zip\n\n` +
            `What's inside:\n` +
            `  • Single static Rust binary\n` +
            `  • Unified OpenAI-compatible API across all major providers\n` +
            `  • Visual routing canvas with conditions and fallbacks\n` +
            `  • Semantic cache, guardrails, content shield, MCP gateway\n` +
            `  • Real-time analytics, audit logs, key management\n\n` +
            `License & usage:\n` +
            `Modo AI Gateway is distributed for non-commercial use only under the included license. Personal, evaluation, research and educational use is fully permitted.\n\n` +
            `Not for production use:\n` +
            `Routing live customer traffic, processing paid services, or any commercial deployment requires a separate commercial license — please reply to this email before going to production.\n\n` +
            `— The Modo team`,
        }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || (d?.success !== 'true' && d?.success !== true)) {
        throw new Error(d?.message ?? `Submission failed (${r.status})`)
      }
      setSent(true)
    } catch (err: any) {
      setError(err?.message ?? 'Could not send — please try again later')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-24">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 text-sm t3 hover:t1 transition-colors">
          <ArrowLeft size={14}/> Back to home
        </Link>
      </div>

      <div className="relative w-full max-w-2xl">
        {sent ? <Sent name={name}/> : (
          <div className="glass-strong rounded-3xl p-8 md:p-10">
            <div className="text-center mb-7">
              <ModoLogo size={56} className="mx-auto mb-4"/>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                <span className="gradient-text">Download Modo</span>
              </h1>
              <p className="text-sm t3 max-w-md mx-auto leading-relaxed">
                Enter your email and we&apos;ll send your download link, along with quick-start
                instructions and the non-commercial license terms.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] t3 block mb-1.5 font-medium">Name <span className="t4 ml-1">(optional)</span></label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="form-input" placeholder="Jane Smith"/>
                </div>
                <div>
                  <label className="text-[11px] t3 block mb-1.5 font-medium">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="form-input" placeholder="you@example.com"/>
                </div>
              </div>

              {/* IP / license notice */}
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.22)' }}>
                <div className="flex items-start gap-2.5">
                  <Scale size={14} className="text-amber-400 mt-0.5 flex-shrink-0"/>
                  <div className="text-[11px] t2 leading-relaxed">
                    <strong className="text-amber-300">Intellectual property notice.</strong>{' '}
                    Modo AI Gateway is © Modo. All rights reserved. The source code is
                    distributed under a permissive license for non-commercial use only.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0"/>
                  <div className="text-[11px] t2 leading-relaxed">
                    <strong className="text-amber-300">Not for production use.</strong>{' '}
                    This download is for personal, evaluation, research and educational
                    purposes only. Routing live customer traffic, processing paid services,
                    or any commercial use requires a separate commercial license — please{' '}
                    <Link href="/#contact" className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
                      contact us
                    </Link>{' '}
                    before deploying to production.
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input type="checkbox" required checked={agree} onChange={e => setAgree(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 accent-indigo-500"/>
                <span className="text-[11px] t2 leading-relaxed">
                  I&apos;ve read and agree to the non-commercial license terms above, and
                  understand commercial use requires a separate license.
                </span>
              </label>

              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 text-[11px] text-red-300">
                  <AlertTriangle size={12} className="mt-0.5 flex-shrink-0"/>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={busy || !agree}
                className="btn-primary w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed">
                {busy ? 'Sending…' : <><Download size={15}/> Send my download link</>}
              </button>

              <p className="text-[10px] t4 text-center">
                We&apos;ll never spam you. One email with your download link and a short welcome note.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function Sent({ name }: { name: string }) {
  return (
    <div className="glass-strong rounded-3xl p-10 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.40)' }}>
        <Check size={28} className="text-emerald-300"/>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-3">Check your inbox{name ? `, ${name.split(' ')[0]}` : ''}</h1>
      <p className="text-sm t2 max-w-md mx-auto leading-relaxed mb-2">
        Your download link is on its way. It includes your copy of Modo AI Gateway,
        quick-start instructions and the license terms.
      </p>
      <p className="text-[11px] t4 max-w-md mx-auto leading-relaxed mb-7">
        Didn&apos;t receive it within a few minutes? Check your spam folder or{' '}
        <Link href="/#contact" className="text-indigo-400 hover:text-indigo-300">contact us</Link>.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/"
          className="btn-secondary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
          <ArrowLeft size={14}/> Back to home
        </Link>
        <Link href="/#screenshots"
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
          <Sparkles size={14}/> Explore the product
        </Link>
      </div>
    </div>
  )
}
