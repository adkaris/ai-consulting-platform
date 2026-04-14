'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { SortAsc } from 'lucide-react'

const PHASE_LABELS: Record<number, string> = {
  1: 'Discovery',
  2: 'Strategy',
  3: 'PoV',
  4: 'Change Mgt',
  5: 'Realization',
}

const SORT_OPTIONS = [
  { val: 'updated', label: 'Recently Updated' },
  { val: 'alpha', label: 'A → Z' },
  { val: 'phase-asc', label: 'Phase ↑' },
  { val: 'phase-desc', label: 'Phase ↓' },
]

const TRACK_OPTIONS = [
  { val: '', label: 'All' },
  { val: 'GENERAL_AI', label: 'General AI' },
  { val: 'COPILOT', label: 'Copilot' },
  { val: 'MIXED', label: 'Mixed' },
]

export default function CustomerFilters({ industries }: { industries: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentPhase = searchParams.get('phase') ?? ''
  const currentSort = searchParams.get('sort') ?? 'updated'
  const currentIndustry = searchParams.get('industry') ?? ''
  const currentTrack = searchParams.get('track') ?? ''

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    // Remove param from URL when using default/empty value
    if (!value || (key === 'sort' && value === 'updated')) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const pill = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer'
  const active = 'bg-blue-600 text-white shadow-sm'
  const inactive = 'bg-slate-100 text-slate-600 hover:bg-slate-200'

  return (
    <div className="space-y-2.5">
      {/* Phase filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-14 shrink-0">Phase</span>
        <button onClick={() => update('phase', '')} className={`${pill} ${!currentPhase ? active : inactive}`}>All</button>
        {[1, 2, 3, 4, 5].map(p => (
          <button
            key={p}
            onClick={() => update('phase', String(p))}
            className={`${pill} ${currentPhase === String(p) ? active : inactive}`}
          >
            {p} · {PHASE_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Industry filter — only shown when there are known industries */}
      {industries.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-14 shrink-0">Industry</span>
          <button onClick={() => update('industry', '')} className={`${pill} ${!currentIndustry ? active : inactive}`}>All</button>
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => update('industry', ind)}
              className={`${pill} ${currentIndustry === ind ? active : inactive} capitalize`}
            >
              {ind}
            </button>
          ))}
        </div>
      )}

      {/* Track filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-14 shrink-0">Track</span>
        {TRACK_OPTIONS.map(opt => (
          <button
            key={opt.val}
            onClick={() => update('track', opt.val)}
            className={`${pill} ${currentTrack === opt.val ? active : inactive}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider w-14 shrink-0 flex items-center gap-0.5">
          <SortAsc className="w-3 h-3" /> Sort
        </span>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.val}
            onClick={() => update('sort', opt.val)}
            className={`${pill} ${currentSort === opt.val ? active : inactive}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
