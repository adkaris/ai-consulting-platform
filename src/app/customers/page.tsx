import { getCustomersWithStats } from '../actions'
// Implemented: 2026-04-05 — Proposals section 2 (Customer Portfolio UX)
import { Building2, ArrowRight, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import SearchInput from '@/components/SearchInput'
import CustomerFilters from '@/components/CustomerFilters'
import NewCustomerModal from '@/components/NewCustomerModal'

const PHASE_SHORT = ['Discovery', 'Strategy', 'PoV Execution', 'Change Mgt', 'Realization']

function formatTimeAgo(date: Date | string): string {
    const d = new Date(date)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'yesterday'
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

type SearchParams = {
    q?: string
    phase?: string
    sort?: string
    industry?: string
}

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const { q, phase, sort, industry } = await searchParams
    const allCustomers = await getCustomersWithStats()

    // Derive unique industries for the filter component
    const industries = [...new Set(
        allCustomers.map(c => c.industry).filter((i): i is string => Boolean(i))
    )]

    // Apply filters
    let customers = allCustomers

    if (q) {
        customers = customers.filter(c =>
            c.name.toLowerCase().includes(q.toLowerCase()) ||
            (c.industry ?? '').toLowerCase().includes(q.toLowerCase())
        )
    }
    if (phase) {
        customers = customers.filter(c => c.currentPhase === Number(phase))
    }
    if (industry) {
        customers = customers.filter(c =>
            (c.industry ?? '').toLowerCase() === industry.toLowerCase()
        )
    }

    // Apply sort (default: updatedAt desc, already from DB)
    if (sort === 'alpha') {
        customers = [...customers].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'phase-asc') {
        customers = [...customers].sort((a, b) => a.currentPhase - b.currentPhase)
    } else if (sort === 'phase-desc') {
        customers = [...customers].sort((a, b) => b.currentPhase - a.currentPhase)
    }

    const isFiltered = Boolean(q || phase || industry)
    const inExecutionPhases = allCustomers.filter(c => c.currentPhase >= 3).length

    return (
        <div className="space-y-8 animate-in fade-in fill-mode-both duration-300">

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Customer Portfolio</h1>
                    <p className="text-slate-500 text-sm">
                        {allCustomers.length} customer{allCustomers.length !== 1 ? 's' : ''} registered
                        {inExecutionPhases > 0 && (
                            <span className="ml-1 text-slate-400">· {inExecutionPhases} in execution phases</span>
                        )}
                    </p>
                </div>
                <NewCustomerModal />
            </div>

            {/* ── Search + Filters ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <Suspense>
                        <SearchInput placeholder="Search by name or industry…" />
                    </Suspense>
                    {isFiltered && (
                        <Link
                            href="/customers"
                            className="shrink-0 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Clear filters
                        </Link>
                    )}
                </div>
                <div className="flex items-start gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mt-1.5 shrink-0" />
                    <Suspense>
                        <CustomerFilters industries={industries} />
                    </Suspense>
                </div>
            </div>

            {/* ── Result summary ───────────────────────────────────────────────── */}
            {isFiltered && (
                <p className="text-sm text-slate-500 -mt-4">
                    Showing <span className="font-bold text-slate-700">{customers.length}</span> of {allCustomers.length} customers
                    {q && <span> matching <span className="font-semibold text-slate-700">&ldquo;{q}&rdquo;</span></span>}
                </p>
            )}

            {/* ── Empty state ──────────────────────────────────────────────────── */}
            {customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50">
                    <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-700 font-bold mb-1">
                        {isFiltered ? 'No customers match your filters' : 'No Customers Yet'}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                        {isFiltered
                            ? 'Try adjusting your search or filters.'
                            : 'Add your first customer to begin their AI transformation journey.'}
                    </p>
                    {isFiltered && (
                        <Link href="/customers" className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            Clear all filters →
                        </Link>
                    )}
                </div>
            ) : (

                /* ── Customer Cards Grid ─────────────────────────────────────── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map((customer) => {

                        // ── Maturity from latest assessment
                        const assessment = customer.assessments[0] ?? null
                        const scores = assessment ? [
                            assessment.scoreStrategy,
                            assessment.scoreData,
                            assessment.scoreTech,
                            assessment.scoreSecurity,
                            assessment.scoreSkills,
                            assessment.scoreOps,
                            assessment.scoreGovernance,
                            assessment.scoreFinancial,
                        ].filter((s): s is number => s != null) : []
                        const maturity = scores.length > 0
                            ? scores.reduce((a, b) => a + b, 0) / scores.length
                            : null

                        // ── Risk colour
                        const riskBadge = maturity === null
                            ? 'text-slate-500 bg-slate-100'
                            : maturity < 2.5
                                ? 'text-rose-700 bg-rose-50 border border-rose-100'
                                : maturity < 3.5
                                    ? 'text-amber-700 bg-amber-50 border border-amber-100'
                                    : 'text-emerald-700 bg-emerald-50 border border-emerald-100'

                        // ── Use case counts by status
                        const ucCounts = {
                            PRODUCTION: customer.useCases.filter(u => u.status === 'PRODUCTION').length,
                            PILOTING: customer.useCases.filter(u => u.status === 'PILOTING').length,
                            APPROVED: customer.useCases.filter(u => u.status === 'APPROVED').length,
                            DRAFT: customer.useCases.filter(u => u.status === 'DRAFT').length,
                        }
                        const totalUC = customer.useCases.length

                        return (
                            <div
                                key={customer.id}
                                className="group flex flex-col rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Card body */}
                                <div className="p-6 flex-1 space-y-4">

                                    {/* Row 1: icon + maturity + industry */}
                                    <div className="flex items-start justify-between">
                                        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                            <Building2 className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {maturity !== null && (
                                                <span className={`text-xs font-black px-2 py-1 rounded-lg ${riskBadge}`}>
                                                    {maturity.toFixed(1)} / 5
                                                </span>
                                            )}
                                            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold tracking-wider text-blue-700 capitalize">
                                                {customer.industry || 'Tech'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Row 2: Company name */}
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                                        {customer.name}
                                    </h3>

                                    {/* Row 3: Phase progress bar */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                                Phase {customer.currentPhase} of 5
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-500">
                                                {PHASE_SHORT[customer.currentPhase - 1]}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(p => (
                                                <div
                                                    key={p}
                                                    className={`h-1.5 flex-1 rounded-full transition-colors ${p < customer.currentPhase
                                                        ? 'bg-blue-500'
                                                        : p === customer.currentPhase
                                                            ? 'bg-blue-300'
                                                            : 'bg-slate-100'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Row 4: Use case status pills */}
                                    {totalUC > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {ucCounts.PRODUCTION > 0 && (
                                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                                                    {ucCounts.PRODUCTION} Production
                                                </span>
                                            )}
                                            {ucCounts.PILOTING > 0 && (
                                                <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                                                    {ucCounts.PILOTING} Piloting
                                                </span>
                                            )}
                                            {ucCounts.APPROVED > 0 && (
                                                <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                                                    {ucCounts.APPROVED} Approved
                                                </span>
                                            )}
                                            {ucCounts.DRAFT > 0 && (
                                                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                    {ucCounts.DRAFT} Draft
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-slate-300 font-semibold italic">
                                            No use cases yet
                                        </p>
                                    )}

                                    {/* Row 5: Last activity */}
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                        Updated {formatTimeAgo(customer.updatedAt)}
                                    </p>
                                </div>

                                {/* Card footer */}
                                <div className="border-t border-slate-100 px-6 py-3.5 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
                                    <span className="text-[10px] font-semibold text-slate-400">
                                        {customer.employees ? `${customer.employees} employees` : 'Size unknown'}
                                    </span>
                                    <Link
                                        href={`/customers/${customer.id}`}
                                        className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Manage <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
