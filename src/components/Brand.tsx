/** Modo gateway mark — pure shapes, no letters. Hex portal with a glowing core. */
export function ModoLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="modo-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#818cf8"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
        <linearGradient id="modo-g2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"  stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
        <radialGradient id="modo-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#a5b4fc"/>
          <stop offset="60%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#3730a3"/>
        </radialGradient>
      </defs>
      <path d="M16 2 L27.66 8.5 L27.66 23.5 L16 30 L4.34 23.5 L4.34 8.5 Z"
            stroke="url(#modo-g1)" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      <path d="M16 7 L23.39 11.25 L23.39 20.75 L16 25 L8.61 20.75 L8.61 11.25 Z"
            stroke="url(#modo-g2)" strokeWidth="1.3" strokeLinejoin="round" fill="none" opacity="0.7"/>
      <circle cx="16" cy="16" r="3.4" fill="url(#modo-core)"/>
      <circle cx="16" cy="16" r="3.4" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5"/>
      <circle cx="16" cy="2" r="1" fill="#22d3ee"/>
    </svg>
  )
}

export function Wordmark({ size = 18 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <ModoLogo size={size + 12}/>
      <span className="font-bold gradient-text tracking-tight" style={{ fontSize: size }}>Modo AI Gateway</span>
    </div>
  )
}
