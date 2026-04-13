'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Presentation, Loader2 } from 'lucide-react'
import { exportCustomerStrategyToPptx } from '@/app/actions'

export default function ExportDropdown({ customerId, customerName }: { customerId: string; customerName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  async function handlePptx() {
    setIsOpen(false)
    setIsExporting(true)
    try {
      const base64 = await exportCustomerStrategyToPptx(customerId)
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
      const blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${customerName.replace(/\s+/g, '_')}_AI_Strategy.pptx`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error(err)
      alert('Failed to generate PowerPoint. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(v => !v)}
        disabled={isExporting}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50"
      >
        {isExporting
          ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          : <Presentation className="w-4 h-4 text-slate-400" />
        }
        {isExporting ? 'Exporting…' : 'Export'}
        {!isExporting && (
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Export As</p>
          </div>
          <button
            onClick={handlePptx}
            className="w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 transition-colors text-left group"
          >
            <div className="p-1.5 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors shrink-0">
              <Presentation className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">PowerPoint</p>
              <p className="text-[10px] text-slate-400">AI Strategy Deck (.pptx)</p>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
