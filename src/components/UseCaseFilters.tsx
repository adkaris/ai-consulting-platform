'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const PRIORITIES = ['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const
const TYPE_OPTIONS = [
    { value: 'ALL', label: 'All Types' },
    { value: 'GENERAL_AI', label: 'General AI' },
    { value: 'COPILOT', label: 'Copilot' },
] as const
const SORT_OPTIONS = [
    { value: 'date', label: 'Newest' },
    { value: 'roi', label: 'Highest ROI' },
    { value: 'priority', label: 'Priority' },
]

export default function UseCaseFilters({ departments = [] }: { departments?: string[] }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const activePriority = searchParams.get('priority') ?? 'ALL'
    const activeDept = searchParams.get('dept') ?? 'ALL'
    const activeSort = searchParams.get('sort') ?? 'date'
    const activeType = searchParams.get('type') ?? 'ALL'

    const update = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'ALL' || value === 'date') {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Priority Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {PRIORITIES.map(p => (
                    <button
                        type="button"
                        key={p}
                        onClick={() => update('priority', p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activePriority === p
                                ? 'bg-white shadow-sm text-slate-900'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {p === 'ALL' ? 'All' : p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Department Filter */}
            {departments.length > 0 && (
                <select
                    value={activeDept}
                    onChange={(e) => update('dept', e.target.value)}
                    aria-label="Filter by department"
                    className="text-xs font-semibold text-slate-600 bg-slate-100 border-0 rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                    <option value="ALL">All Depts</option>
                    {departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            )}

            {/* Type Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {TYPE_OPTIONS.map(t => (
                    <button
                        type="button"
                        key={t.value}
                        onClick={() => update('type', t.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeType === t.value
                                ? 'bg-white shadow-sm text-slate-900'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {SORT_OPTIONS.map(s => (
                    <button
                        type="button"
                        key={s.value}
                        onClick={() => update('sort', s.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeSort === s.value
                                ? 'bg-white shadow-sm text-slate-900'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
