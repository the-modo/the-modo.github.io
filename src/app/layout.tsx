import type { Metadata } from 'next'
import './globals.css'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title: 'Modo AI Gateway — Open-source AI gateway with sub-2µs overhead',
  description: 'Modo is a free, open-source AI gateway in Rust. Unified OpenAI-compatible API across providers with routing, semantic caching, guardrails, content shield, and MCP. Free for non-commercial use.',
  icons: {
    icon:     [{ url: `${BASE}/favicon.svg`, type: 'image/svg+xml' }],
    shortcut: [`${BASE}/favicon.svg`],
    apple:    [{ url: `${BASE}/favicon.svg` }],
  },
  openGraph: {
    title: 'Modo AI Gateway',
    description: 'The fastest open-source AI gateway. Free for non-commercial use.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon"          href={`${BASE}/favicon.svg`} type="image/svg+xml"/>
        <link rel="shortcut icon" href={`${BASE}/favicon.svg`}/>
        <link rel="apple-touch-icon" href={`${BASE}/favicon.svg`}/>
      </head>
      <body>
        <div className="aurora"><div className="blob"/></div>
        <div className="grid-overlay"/>
        {children}
      </body>
    </html>
  )
}
