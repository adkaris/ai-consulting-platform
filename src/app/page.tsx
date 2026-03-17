import { getCustomers, getAllAssessments, getAllUseCases } from './actions'
import { Users, Gauge, TrendingUp, ArrowRight } from 'lucide-react'
import DashboardClient from '@/components/DashboardClient'
import Link from 'next/link'

export default async function Dashboard() {
  const [customers, assessments, useCases] = await Promise.all([
    getCustomers(),
    getAllAssessments(),
    getAllUseCases(),
  ])

  const totalRoi = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
  const realizedRoi = useCases
    .filter(uc => uc.status === 'PRODUCTION')
    .reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)

  // Calculate Average Maturity Across 8 Domains
  const domainAverages = assessments.length > 0 ? {
    Strategy: assessments.reduce((acc, a) => acc + (a.scoreStrategy || 0), 0) / assessments.length,
    Data: assessments.reduce((acc, a) => acc + (a.scoreData || 0), 0) / assessments.length,
    Tech: assessments.reduce((acc, a) => acc + (a.scoreTech || 0), 0) / assessments.length,
    Security: assessments.reduce((acc, a) => acc + (a.scoreSecurity || 0), 0) / assessments.length,
    Skills: assessments.reduce((acc, a) => acc + (a.scoreSkills || 0), 0) / assessments.length,
    Ops: assessments.reduce((acc, a) => acc + (a.scoreOps || 0), 0) / assessments.length,
    Governance: assessments.reduce((acc, a) => acc + (a.scoreGovernance || 0), 0) / assessments.length,
    Finance: assessments.reduce((acc, a) => acc + (a.scoreFinancial || 0), 0) / assessments.length,
  } : null

  // Calculate Phase Distribution
  const phaseDist = [1, 2, 3, 4, 5].map(p => ({
    phase: p,
    count: customers.filter(c => c.currentPhase === p).length
  }))

  const stats = [
    {
      name: 'Total Portfolio ROI',
      value: `$${totalRoi.toLocaleString()}`,
      icon: TrendingUp,
      sub: realizedRoi > 0 ? `$${realizedRoi.toLocaleString()} realized in Production` : 'All potential value',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Engagements',
      value: customers.length.toString(),
      icon: Users,
      sub: `${customers.filter(c => c.currentPhase >= 3).length} in execution phases`,
      changeType: 'neutral' as const,
    },
    {
      name: 'Portfolio Maturity',
      value: domainAverages ? (Object.values(domainAverages).reduce((a, b) => a + b, 0) / 8).toFixed(1) : '0.0',
      icon: Gauge,
      sub: 'Avg. score across 8 domains',
      changeType: 'neutral' as const,
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-2">Executive Overview</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Portfolio Intelligence</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600">Live Strategy Feed</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10" />
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.name}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight">{item.value}</p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-6">
              <span className={`text-xs font-bold ${item.changeType === 'positive' ? 'text-emerald-600' : 'text-slate-500'}`}>
                {item.sub}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Charts & Tables */}
      <DashboardClient customers={customers} assessments={assessments} useCases={useCases} />

    </div>
  )
}
