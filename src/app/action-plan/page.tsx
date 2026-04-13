import { getPendingConsultantWork, type PendingActionItem } from '@/app/actions'
import { FileText, CheckSquare, ArrowRight, Building2, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import QuickCompleteButton from '@/components/QuickCompleteButton'

export const dynamic = 'force-dynamic'

export default async function ActionPlanPage({
    searchParams,
}: {
    searchParams: Promise<{ phase?: string }>
}) {
    const { phase } = await searchParams
    const activePhase = phase ? parseInt(phase, 10) : null

    const allItems = await getPendingConsultantWork()

    const pendingItems = activePhase
        ? allItems.filter((i) => i.phase === activePhase)
        : allItems

    const hasNoWork = pendingItems.length === 0

    // Unique phases present across all items (for filter pills)
    const phases = Array.from(new Set(allItems.map((i) => i.phase))).sort()

    // Group filtered items by customer
    const byCustomer = pendingItems.reduce<Map<string, { name: string; id: string; items: PendingActionItem[] }>>(
        (map, item) => {
            const existing = map.get(item.customerId)
            if (existing) {
                existing.items.push(item)
            } else {
                map.set(item.customerId, { name: item.customerName, id: item.customerId, items: [item] })
            }
            return map
        },
        new Map(),
    )

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-2">My Tasks</p>
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Consultant Action Plan</h1>
                    <div className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 shadow-sm shrink-0">
                        {pendingItems.length} Pending Actions
                    </div>
                </div>
            </div>

            {/* Phase filter pills */}
            {phases.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/action-plan"
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            !activePhase ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        All Phases
                    </Link>
                    {phases.map((p) => (
                        <Link
                            key={p}
                            href={`/action-plan?phase=${p}`}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activePhase === p ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Phase {p}
                        </Link>
                    ))}
                </div>
            )}

            {hasNoWork ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h2>
                    <p className="text-slate-500">
                        {activePhase
                            ? `No pending items in Phase ${activePhase}.`
                            : 'No pending tasks or missing deliverables across any active engagements.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Array.from(byCustomer.values()).map(({ name, id, items }) => {
                        const customerTasks = items.filter((i) => i.type === 'TASK')
                        const customerDeliverables = items.filter((i) => i.type === 'DELIVERABLE')

                        return (
                            <div key={id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Customer header */}
                                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <Link
                                        href={`/customers/${id}`}
                                        className="text-base font-black text-slate-900 hover:text-blue-600 transition-colors"
                                    >
                                        {name}
                                    </Link>
                                    <span className="ml-auto text-xs font-bold text-slate-400">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                                </div>

                                {/* Items grid */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {customerDeliverables.map((item) => (
                                        <ActionCard key={item.id} item={item} />
                                    ))}
                                    {customerTasks.map((item) => (
                                        <ActionCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function ActionCard({ item }: { item: PendingActionItem }) {
    const isDeliverable = item.type === 'DELIVERABLE'

    let linkHref = `/customers/${item.customerId}?phase=${item.phase}`
    if (isDeliverable && item.phase === 1) linkHref = `/customers/${item.customerId}/report`

    return (
        <div className="group rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-2">
                <span className={`p-1 rounded ${isDeliverable ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                    {isDeliverable ? <FileText className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                    Phase {item.phase}
                </span>
                {isDeliverable && item.hasDraft && (
                    <span className="px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <AlertCircle className="w-3 h-3" /> Draft
                    </span>
                )}
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {item.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                {item.description}
            </p>

            <div className="flex items-center gap-2">
                {!isDeliverable && (
                    <QuickCompleteButton
                        customerId={item.customerId}
                        phaseNumber={item.phase}
                        taskKey={item.key}
                    />
                )}
                <Link
                    href={linkHref}
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors ml-auto"
                >
                    {isDeliverable ? 'Review Doc' : 'Open'}
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    )
}
