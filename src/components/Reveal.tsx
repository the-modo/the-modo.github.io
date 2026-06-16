'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: 0 | 1 | 2 | 3 | 4
  className?: string
  as?: 'div' | 'section' | 'span' | 'li' | 'h2' | 'h3' | 'p'
}

export function Reveal({ children, delay = 0, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!ref.current || shown) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect() } },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [shown])

  const cls = `reveal ${shown ? 'in' : ''} ${delay ? `reveal-delay-${delay}` : ''} ${className}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any
  return <Tag ref={ref} className={cls}>{children}</Tag>
}
