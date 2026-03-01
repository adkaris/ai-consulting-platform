import { getCustomers, createCustomer } from '../actions'
import { Building2, ArrowRight, Activity, Zap } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import SearchInput from '@/components/SearchInput'

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const allCustomers = await getCustomers()

    const customers = q
        ? allCustomers.filter(c =>
            c.name.toLowerCase().includes(q.toLowerCase()) ||
            (c.industry ?? '').toLowerCase().includes(q.toLowerCase())
        )
        : allCustomers

    const formatPhase = (phase: number) => {
        switch (phase) {
            case 1: return '1: Discovery & Readiness'
            case 2: return '2: Strategy Alignment'
            case 3: return '3: PoV Execution'
            case 4: return '4: Change Management'
            case 5: return '5: Value Realization'
            default: return 'Unknown'
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in fill-mode-both duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Customer Portfolio</h1>
                    <p className="text-slate-500">Manage organizations and track their AI journey progress.</p>
                </div>

                <form action={createCustomer} className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <input
                        name="name"
                        required
                        placeholder="Company Name"
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-slate-300 transition-colors"
                    />
                    <input
                        name="industry"
                        placeholder="Industry"
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-slate-300 transition-colors"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        Add Profile
                    </button>
                </form>
            </div>

            {/* Live Search */}
            <div className="flex items-center gap-4">
                <Suspense>
                    <SearchInput placeholder="Search by name or industry..." />
                </Suspense>
                {q && (
                    <p className="text-sm text-slate-500 shrink-0">
                        {customers.length} result{customers.length !== 1 ? 's' : ''} for <span className="font-semibold text-slate-700">"{q}"</span>
                    </p>
                )}
            </div>

            {customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50">
                    <Building2 className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-slate-700 font-medium mb-1">
                        {q ? `No customers match "${q}"` : 'No Customers Registered'}
                    </h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        {q ? 'Try a different search term.' : 'Add your first customer to begin their AI Journey tracking and run a Readiness Assessment.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map((customer) => (
                        <div key={customer.id} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-500/50 hover:shadow-md transition-all duration-300">

                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                                    <Building2 className="h-6 w-6 text-slate-500" />
                                </div>
                                <div className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold tracking-wider text-blue-700 capitalize">
                                    {customer.industry || 'Tech'}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{customer.name}</h3>
                                <div className="flex items-center text-xs text-slate-500 space-x-3 mt-3">
                                    <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> Phase {customer.currentPhase}</span>
                                    <span className="flex items-center"><Zap className="w-3 h-3 text-amber-500 mr-1" /> Readiness Assess</span>
                                </div>
                            </div>

                            <div className="mt-auto border-t border-slate-100 pt-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 text-xs font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                                        {formatPhase(customer.currentPhase)}
                                    </span>
                                    <Link
                                        href={`/customers/${customer.id}`}
                                        className="flex justify-center items-center text-blue-600 hover:text-blue-700 font-medium text-xs transition-colors"
                                    >
                                        Manage <ArrowRight className="ml-1 w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
