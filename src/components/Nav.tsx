'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Download } from 'lucide-react'
import { Wordmark } from './Brand'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#screenshots',     label: 'Product' },
    { href: '#routing',         label: 'Routing' },
    { href: '#content-shield',  label: 'Content Shield' },
    { href: '#guardrails',      label: 'Guardrails' },
    { href: '#workflows',       label: 'Workflows' },
    { href: '#pricing',         label: 'License' },
    { href: '#contact',         label: 'Contact' },
  ]

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'nav-blur py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center"><Wordmark/></Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm t2 hover:t1 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/download"
            className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white">
            <Download size={13}/> Download
          </Link>
        </div>

        <button className="md:hidden t2" onClick={() => setOpen(o => !o)} aria-label="menu">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden mt-3 mx-6 glass-strong rounded-2xl p-4 space-y-2">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm t2 hover:bg-white/5">
              {l.label}
            </a>
          ))}
          <Link href="/download" onClick={() => setOpen(false)}
            className="btn-primary block mt-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white text-center">
            Download
          </Link>
        </div>
      )}
    </header>
  )
}
