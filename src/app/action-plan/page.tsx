import { getPendingConsultantWork, PendingActionItem } from '@/app/actions'
import { FileText, CheckSquare, ArrowRight, Building2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ActionPlanPage() {
    const pendingItems = await getPendingConsultantWork()

    const tasks = pendingItems.filter(item => item.type === 'TASK')
    const deliverables = pendingItems.filter(item => item.type === 'DELIVERABLE')

    const hasNoWork = pendingItems.length === 0

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-2">My Tasks</p>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Consultant Action Plan</h1>
                    <div className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 shadow-sm">
                        {pendingItems.length} Pending Actions
                    </div>
                </div>
            </div>

            {hasNoWork ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <CheckSquare className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h2>
                    <p className="text-slate-500">There are no pending tasks or missing deliverables across any active engagements.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Column 1: Mandatory Deliverables */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-none">Missing Deliverables</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Required Generation</p>
                            </div>
                            <span className="ml-auto bg-rose-100 text-rose-700 text-xs font-black px-2.5 py-1 rounded-full">{deliverables.length}</span>
                        </div>

                        <div className="space-y-4">
                            {deliverables.map((item) => (
                                <ActionCard key={item.id} item={item} />
                            ))}
                            {deliverables.length === 0 && (
                                <div className="p-8 text-center text-slate-400 font-semibold border-2 border-dashed border-slate-200 rounded-2xl">
                                    No deliverables pending.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Pending Phase Tasks */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <CheckSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-none">Manual Actions</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Checklist Tasks</p>
                            </div>
                            <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-black px-2.5 py-1 rounded-full">{tasks.length}</span>
                        </div>

                        <div className="space-y-4">
                            {tasks.map((item) => (
                                <ActionCard key={item.id} item={item} />
                            ))}
                            {tasks.length === 0 && (
                                <div className="p-8 text-center text-slate-400 font-semibold border-2 border-dashed border-slate-200 rounded-2xl">
                                    No tasks pending.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ActionCard({ item }: { item: PendingActionItem }) {
    const isDeliverable = item.type === 'DELIVERABLE'
    
    // Determine the deep link: 
    // If it's a deliverable that needs generation, link to the Report Generator.
    // Otherwise, generic tasks link to the customer profile phase tracker.
    let linkHref = `/customers/${item.customerId}`
    if (isDeliverable && item.phase === 1) linkHref = `/customers/${item.customerId}/report`
    // (Future phases could have specific generator URLs if implemented differently)

    return (
        <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                        Phase {item.phase}
                    </span>
                    {isDeliverable && item.hasDraft && (
                        <span className="px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <AlertCircle className="w-3 h-3" /> Draft Saved
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{item.customerName}</span>
                </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {item.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {item.description}
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {isDeliverable ? (item.hasDraft ? 'Needs Approval' : 'Action Required') : 'Pending Completion'}
                </span>
                
                <Link 
                    href={linkHref}
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {isDeliverable ? 'Review Doc' : 'Resolve Task'}
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    )
}
