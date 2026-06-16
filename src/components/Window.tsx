import { ReactNode } from 'react'

/** macOS-style window chrome wrapper. */
export function Window({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`window lift ${className}`}>
      <div className="window-bar">
        <div className="window-dot" style={{ background: '#ff5f57' }}/>
        <div className="window-dot" style={{ background: '#febc2e' }}/>
        <div className="window-dot" style={{ background: '#28c840' }}/>
        {title && <div className="flex-1 text-center text-[11px] t4 font-mono -ml-12">{title}</div>}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
