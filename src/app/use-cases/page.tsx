import { getAllUseCases } from '@/app/actions'
import { Briefcase, Zap, Euro, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import SearchInput from '@/components/SearchInput'
import UseCaseFilters from '@/components/UseCaseFilters'

export default async function UseCasesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; priority?: string; sort?: string }>
}) {
    const { q, priority, sort } = await searchParams
    const allUseCases = await getAllUseCases()

    // Filter by search query
    let useCases = q
        ? allUseCases.filter(uc =>
            uc.title.toLowerCase().includes(q.toLowerCase()) ||
            (uc.description ?? '').toLowerCase().includes(q.toLowerCase()) ||
            (uc.department ?? '').toLowerCase().includes(q.toLowerCase())
        )
        : allUseCases

    // Filter by priority
    if (priority && priority !== 'ALL') {
        useCases = useCases.filter(uc => uc.priority === priority)
    }

    // Sort
    const moneyROI = (uc: (typeof allUseCases)[0]) =>
        (uc.rois ?? []).filter(r => r.type === 'MONEY').reduce((s, r) => s + r.value, 0)

    if (sort === 'roi') {
        useCases = [...useCases].sort((a, b) => moneyROI(b) - moneyROI(a))
    } else if (sort === 'priority') {
        const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }
        useCases = [...useCases].sort((a, b) =>
            (order[a.priority as keyof typeof order] ?? 3) - (order[b.priority as keyof typeof order] ?? 3)
        )
    }
    // default 'date': already ordered by createdAt desc from the action

    const totalROI = allUseCases.reduce((sum, uc) =>
        sum + (uc.rois ?? []).filter(r => r.type === 'MONEY').reduce((s, r) => s + r.value, 0), 0)
    const highPriorityCount = allUseCases.filter(uc => uc.priority === 'HIGH').length

    return (
        <div className="space-y-8 animate-in fade-in fill-mode-both duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Use Case Backlog</h1>
                    <p className="text-slate-500">Cross-portfolio AI initiatives and opportunity prioritization.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">Total Est. ROI</p>
                        <p className="text-lg font-bold text-emerald-700">€{totalROI.toLocaleString()}</p>
                    </div>
                    <div className="px-4 py-2 bg-rose-50 rounded-xl border border-rose-100">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-rose-600">High Priority</p>
                        <p className="text-lg font-bold text-rose-700">{highPriorityCount}</p>
                    </div>
                </div>
            </div>

            {/* Search + Filter + Sort toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-full sm:w-80">
                    <Suspense>
                        <SearchInput placeholder="Search initiatives..." />
                    </Suspense>
                </div>
                <Suspense>
                    <UseCaseFilters />
                </Suspense>
                {(q || priority || sort) && (
                    <p className="text-xs text-slate-400 shrink-0 sm:ml-auto">
                        {useCases.length} result{useCases.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-bold text-slate-500">Initiative</th>
                                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-bold text-slate-500">Customer</th>
                                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-bold text-slate-500">Department</th>
                                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-bold text-slate-500">Priority</th>
                                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-bold text-slate-500">ROI Estimate</th>
                                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-bold text-slate-500">Status</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {useCases.length > 0 ? (
                                useCases.map((uc) => (
                                    <tr key={uc.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-slate-900 leading-none">{uc.title}</p>
                                            {uc.description && <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">{uc.description}</p>}
                                        </td>
                                        <td className="px-6 py-5">
                                            <Link href={`/customers/${uc.customerId}`} className="flex items-center text-sm font-medium text-blue-600 hover:underline">
                                                <Building2 className="w-3.5 h-3.5 mr-1.5" /> {uc.customer.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg w-fit">
                                                <Briefcase className="w-3 h-3 mr-1.5" /> {uc.department || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase
                                                ${uc.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                    uc.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-slate-100 text-slate-600 border border-slate-200'}
                                            `}>
                                                {uc.priority || 'LOW'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {uc.rois && uc.rois.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {uc.rois.map((roi) => (
                                                        <span key={roi.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold w-fit ${
                                                            roi.type === 'MONEY'       ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                            roi.type === 'PERFORMANCE' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                                                                                         'bg-violet-50 text-violet-700 border border-violet-100'
                                                        }`}>
                                                            {roi.type === 'MONEY'       ? <Euro className="w-3 h-3" /> :
                                                             roi.type === 'PERFORMANCE' ? <span className="text-[9px]">%</span> :
                                                                                          <span className="text-[9px]">⏱</span>}
                                                            {roi.type === 'MONEY'       ? `€${Number(roi.value).toLocaleString()}` :
                                                             roi.type === 'PERFORMANCE' ? `+${roi.value}%` :
                                                                                          `${roi.value} ${roi.unit}`}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-semibold">TBD</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${uc.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{uc.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link href={`/customers/${uc.customerId}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors inline-block">
                                                <Zap className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <Zap className="h-12 w-12 mb-3" />
                                            <p className="text-slate-500 text-sm font-medium">
                                                {q || priority ? 'No use cases match the current filters.' : 'No use cases found in the portfolio.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
