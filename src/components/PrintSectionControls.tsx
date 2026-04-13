'use client'

import { useState } from 'react'
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react'

const SECTIONS = [
    { id: 'report-section-domains',   label: 'Domain Maturity' },
    { id: 'report-section-gaps',      label: 'Critical Gaps' },
    { id: 'report-section-roadmap',   label: 'Strategic Roadmap' },
    { id: 'report-section-appendix',  label: 'Appendix' },
] as const

export default function PrintSectionControls() {
    const [visible, setVisible] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(SECTIONS.map((s) => [s.id, true])),
    )
    const [open, setOpen] = useState(false)

    const toggle = (id: string) => {
        const next = !visible[id]
        setVisible((prev) => ({ ...prev, [id]: next }))
        const el = document.getElementById(id)
        if (el) el.classList.toggle('hidden', !next)
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-xs font-bold px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-200"
            >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sections
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-3 min-w-[180px] z-50">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">Print Sections</p>
                    {SECTIONS.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => toggle(s.id)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-left"
                        >
                            {visible[s.id]
                                ? <Eye className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                : <EyeOff className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                            <span className={visible[s.id] ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                                {s.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
