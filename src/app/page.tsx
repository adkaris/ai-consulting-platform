import { getCustomers, getAllAssessments, getAllUseCases } from './actions'
import { Users, FileText, Activity, Building2, ArrowRight, Zap, Gauge } from 'lucide-react'
import Link from 'next/link'

export default async function Dashboard() {
  const [customers, assessments, useCases] = await Promise.all([
    getCustomers(),
    getAllAssessments(),
    getAllUseCases(),
  ])

  const totalRoi = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
  const inProgressAssessments = assessments.filter(a => a.status === 'IN_PROGRESS').length

  const stats = [
    {
      name: 'Total Customers',
      value: customers.length.toString(),
      icon: Users,
      sub: customers.length === 0 ? 'No customers yet' : `${customers.filter(c => c.currentPhase > 1).length} past Phase 1`,
      changeType: 'neutral' as const,
    },
    {
      name: 'Completed Assessments',
      value: assessments.length.toString(),
      icon: Activity,
      sub: inProgressAssessments > 0 ? `${inProgressAssessments} in progress` : 'All completed',
      changeType: 'neutral' as const,
    },
    {
      name: 'Portfolio ROI Potential',
      value: `$${totalRoi.toLocaleString()}`,
      icon: FileText,
      sub: `Across ${useCases.length} use case${useCases.length !== 1 ? 's' : ''}`,
      changeType: 'positive' as const,
    },
  ]

  const formatPhase = (phase: number) => {
    switch (phase) {
      case 1: return 'Discovery & Readiness'
      case 2: return 'Strategy Alignment'
      case 3: return 'PoV Execution'
      case 4: return 'Change Management'
      case 5: return 'Value Realization'
      default: return 'Unknown'
    }
  }

  const recentCustomers = customers.slice(0, 5)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">AI Journey Portfolio</h1>
        <p className="text-slate-500">Manage consulting engagements, assessments, and AI transition roadmaps.</p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="truncate text-sm font-medium text-slate-500">{item.name}</p>
              <item.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
            </div>
            <div className="flex items-baseline mb-2">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{item.value}</p>
            </div>
            <p className="text-xs font-medium mt-3 border-t border-slate-100 pt-3">
              <span className={item.changeType === 'positive' ? 'text-emerald-600' : 'text-slate-500'}>
                {item.sub}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Recent Engagements */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Recent Engagements</h2>
            <p className="text-sm text-slate-500">Activity across AI consulting portfolio.</p>
          </div>
          <Link
            href="/customers"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
            <Users className="h-10 w-10 text-slate-400 mb-4" />
            <h3 className="text-slate-700 font-medium mb-1">No customers yet</h3>
            <p className="text-slate-500 text-sm max-w-sm">Get started by adding a customer profile to track their AI journey and assess readiness.</p>
            <Link
              href="/customers"
              className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              + New Customer
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between py-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{customer.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Gauge className="w-3 h-3" />
                      Phase {customer.currentPhase}: {formatPhase(customer.currentPhase)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:block text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    {customer.industry || 'General'}
                  </span>
                  <Link
                    href={`/customers/${customer.id}`}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Zap className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
