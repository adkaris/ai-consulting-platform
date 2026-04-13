import { getCustomers, getAllAssessments, getAllUseCases, getPendingConsultantWork } from './actions'
import {
  Users, Gauge, TrendingUp, ArrowRight,
  AlertCircle, FileText, ListTodo, CheckCircle2, Clock
} from 'lucide-react'
import DashboardClient from '@/components/DashboardClient'
import Link from 'next/link'

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
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default async function Dashboard() {
  const [customers, assessments, useCases, pendingWork] = await Promise.all([
    getCustomers(),
    getAllAssessments(),
    getAllUseCases(),
    getPendingConsultantWork(),
  ])

  // ── ROI Metrics ──────────────────────────────────────────────────────────────
  const totalRoi = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
  const realizedRoi = useCases
    .filter(uc => uc.status === 'PRODUCTION')
    .reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
  const productionCount = useCases.filter(uc => uc.status === 'PRODUCTION').length
  const realizationRate = totalRoi > 0 ? Math.round((realizedRoi / totalRoi) * 100) : 0

  // ── Portfolio Maturity ───────────────────────────────────────────────────────
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

  const overallMaturity = domainAverages
    ? Object.values(domainAverages).reduce((a, b) => a + b, 0) / 8
    : 0

  // ── Phase Distribution ───────────────────────────────────────────────────────
  const phaseDist = [1, 2, 3, 4, 5].map(p => ({
    phase: p,
    count: customers.filter(c => c.currentPhase === p).length
  }))
  const activePhases = phaseDist.filter(p => p.count > 0)
  const phaseSummary = activePhases.length > 0
    ? activePhases.map(p => `${p.count} in Ph${p.phase}`).join(' · ')
    : 'No customers yet'

  // ── Today's Focus ────────────────────────────────────────────────────────────
  const pendingDeliverables = pendingWork.filter(i => i.type === 'DELIVERABLE')
  const pendingTasks = pendingWork.filter(i => i.type === 'TASK')
  const affectedCustomerCount = new Set(pendingWork.map(i => i.customerId)).size
  const urgentItems = [...pendingWork]
    .sort((a, b) => {
      // Deliverables needing approval first
      if (a.hasDraft && !b.hasDraft) return -1
      if (!a.hasDraft && b.hasDraft) return 1
      // Deliverables before tasks
      if (a.type === 'DELIVERABLE' && b.type === 'TASK') return -1
      if (a.type === 'TASK' && b.type === 'DELIVERABLE') return 1
      return 0
    })
    .slice(0, 3)

  // ── Recent Activity ──────────────────────────────────────────────────────────
  const latestAssessment = assessments[0] ?? null
  const latestUseCase = useCases[0] ?? null

  // ── KPI Stats ────────────────────────────────────────────────────────────────
  const stats = [
    {
      name: 'Total Portfolio ROI',
      value: `$${totalRoi.toLocaleString()}`,
      icon: TrendingUp,
      sub: realizationRate > 0
        ? `${realizationRate}% realized · ${productionCount} in production`
        : 'All potential value — none in production yet',
      changeType: realizationRate > 0 ? 'positive' as const : 'neutral' as const,
      href: '/use-cases',
    },
    {
      name: 'Active Engagements',
      value: customers.length.toString(),
      icon: Users,
      sub: phaseSummary,
      changeType: 'neutral' as const,
      href: '/customers',
    },
    {
      name: 'Portfolio Maturity',
      value: domainAverages ? overallMaturity.toFixed(1) : '—',
      icon: Gauge,
      sub: assessments.length > 0
        ? `${assessments.length} assessment${assessments.length > 1 ? 's' : ''} · 8 domains`
        : 'No assessments yet',
      changeType: 'neutral' as const,
      href: '/assessments',
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 mb-2">Executive Overview</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Portfolio Intelligence</h1>
        </div>

        {/* Recent Activity — replaces the fake "Live Strategy Feed" */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm max-w-xs">
          {latestAssessment ? (
            <>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-600 truncate">
                <span className="font-black text-slate-800">{(latestAssessment as any).customer?.name}</span>
                {' '}assessed {formatTimeAgo(latestAssessment.createdAt)}
              </span>
            </>
          ) : latestUseCase ? (
            <>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-600 truncate">
                <span className="font-black text-slate-800">{latestUseCase.title}</span>
                {' '}added {formatTimeAgo(latestUseCase.createdAt)}
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
              <span className="text-xs font-semibold text-slate-400">No recent activity</span>
            </>
          )}
        </div>
      </div>

      {/* ── Today's Focus Banner ────────────────────────────────────────────────── */}
      {pendingWork.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-sm font-black text-amber-800 uppercase tracking-wider">Today&apos;s Focus</p>
            </div>
            <Link
              href="/action-plan"
              className="flex items-center gap-1 text-xs font-black text-amber-700 hover:text-amber-900 whitespace-nowrap transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-sm text-amber-700 mb-4">
            <span className="font-black text-amber-900">
              {pendingDeliverables.length} deliverable{pendingDeliverables.length !== 1 ? 's' : ''}
            </span>
            {' '}and{' '}
            <span className="font-black text-amber-900">
              {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''}
            </span>
            {' '}pending across{' '}
            <span className="font-black text-amber-900">
              {affectedCustomerCount} customer{affectedCustomerCount !== 1 ? 's' : ''}
            </span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {urgentItems.map(item => (
              <Link
                key={item.id}
                href={`/customers/${item.customerId}`}
                className="flex items-start gap-3 p-3 bg-white rounded-xl border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                  item.type === 'DELIVERABLE'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {item.type === 'DELIVERABLE'
                    ? <FileText className="w-3 h-3" />
                    : <ListTodo className="w-3 h-3" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-700 truncate group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                    {item.customerName} · Phase {item.phase}
                  </p>
                  {item.hasDraft && (
                    <span className="inline-block text-[10px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md mt-1">
                      Needs Approval
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-bold text-emerald-700">
            All caught up — no pending deliverables or tasks across your portfolio.
          </p>
        </div>
      )}

      {/* ── Primary KPI Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <Link
            key={item.name}
            href={item.href}
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
          </Link>
        ))}
      </div>

      {/* ── Interactive Charts & Tables ─────────────────────────────────────────── */}
      <DashboardClient
        customers={customers}
        assessments={assessments}
        useCases={useCases}
        phaseDist={phaseDist}
      />

    </div>
  )
}
