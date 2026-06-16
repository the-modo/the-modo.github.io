import Link from 'next/link'
import { Download } from 'lucide-react'
import { Wordmark } from './Brand'

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 px-6 mt-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2">
            <Wordmark/>
            <p className="text-sm t3 mt-4 max-w-xs leading-relaxed">
              The fastest open-source AI gateway. Built in Rust for production traffic at any scale.
            </p>
            <Link href="/download"
              className="btn-primary inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl text-sm font-semibold text-white">
              <Download size={14}/> Download
            </Link>
          </div>
          <div>
            <div className="text-xs font-semibold t1 mb-3">Product</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#features"    className="t3 hover:t1 transition-colors">Features</a></li>
              <li><a href="#screenshots" className="t3 hover:t1 transition-colors">Product tour</a></li>
              <li><a href="#workflows"   className="t3 hover:t1 transition-colors">Workflows</a></li>
              <li><a href="#pricing"     className="t3 hover:t1 transition-colors">License</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold t1 mb-3">Resources</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#opensource"  className="t3 hover:t1 transition-colors">Open source</a></li>
              <li><a href="#contact"     className="t3 hover:t1 transition-colors">Contact</a></li>
              <li><Link href="/download" className="t3 hover:t1 transition-colors">Download</Link></li>
            </ul>
          </div>
        </div>

        <div className="divider-gradient mb-6"/>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs t4">
          <div>© {new Date().getFullYear()} Modo AI Gateway · Free for non-commercial use</div>
          <div>Made with ♥ in Rust</div>
        </div>
      </div>
    </footer>
  )
}
