import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Building2, Calendar, Activity, BrainCircuit,
  AlertTriangle, FileCheck
} from 'lucide-react'
import ProfileWorkflow from '@/components/ProfileWorkflow'
import EditProfileModal from '@/components/EditProfileModal'
import GenerateReportButton from '@/components/GenerateReportButton'
import ExportDropdown from '@/components/ExportDropdown'
import { getCustomerPhaseData } from '@/app/actions'

const PHASE_NAMES = [
  'Discovery & Readiness',
  'Strategy Alignment',
  'PoV Execution',
  'Change Management',
  'Value Realization',
]

function formatTimeAgo(date: Date | string): string {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default async function CustomerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [customer, phaseData] = await Promise.all([
    prisma.customer.findUnique({
      where: { id },
      include: {
        assessments: { orderBy: { completedAt: 'desc' } },
        useCases: { orderBy: { createdAt: 'desc' }, include: { rois: true } },
        changeItems: { orderBy: { createdAt: 'asc' } },
      }
    }),
    getCustomerPhaseData(id),
  ])

  if (!customer) return notFound()

  // ── Maturity from latest assessment ────────────────────────────────────────
  const latestAssessment = customer.assessments[0] ?? null
  const domainScores = latestAssessment ? [
    latestAssessment.scoreStrategy,
    latestAssessment.scoreData,
    latestAssessment.scoreTech,
    latestAssessment.scoreSecurity,
    latestAssessment.scoreSkills,
    latestAssessment.scoreOps,
    latestAssessment.scoreGovernance,
    latestAssessment.scoreFinancial,
  ].filter((s): s is number => s != null) : []
  const maturity = domainScores.length > 0
    ? domainScores.reduce((a, b) => a + b, 0) / domainScores.length
    : null

  const maturityColor = maturity === null ? 'text-slate-400'
    : maturity < 2.5 ? 'text-rose-600'
    : maturity < 3.5 ? 'text-amber-600'
    : 'text-emerald-600'

  // ── Use case summary ────────────────────────────────────────────────────────
  const ucTotal = customer.useCases.length
  const ucLive = customer.useCases.filter(u => u.status === 'PILOTING' || u.status === 'PRODUCTION').length

  // ── Health banner conditions ────────────────────────────────────────────────
  const daysSinceAssessment = latestAssessment
    ? Math.floor((Date.now() - new Date(latestAssessment.createdAt).getTime()) / 86_400_000)
    : null
  const assessmentStale = daysSinceAssessment !== null && daysSinceAssessment > 30
  const allUCsDraft = ucTotal > 0 && customer.useCases.every(u => u.status === 'DRAFT')
  const pendingApprovalCount = phaseData.deliverables.filter(
    d => d.phaseNumber === customer.currentPhase && d.status === 'DRAFT'
  ).length

  type Banner = {
    level: 'amber' | 'blue'
    text: string
    action?: { label: string; href: string }
  }
  const rawBanners: Banner[] = []

  if (assessmentStale) {
    rawBanners.push({
      level: 'amber',
      text: `Readiness assessment is ${daysSinceAssessment} days old. Consider re-assessing to reflect current state.`,
      action: { label: 'Re-assess now', href: `/customers/${id}/assessment/new` },
    })
  }
  if (customer.currentPhase >= 2 && allUCsDraft) {
    rawBanners.push({
      level: 'amber',
      text: 'All use cases are in Draft — approve at least one to start tracking delivery velocity.',
    })
  }
  if (pendingApprovalCount > 0) {
    rawBanners.push({
      level: 'blue',
      text: `${pendingApprovalCount} deliverable draft${pendingApprovalCount !== 1 ? 's are' : ' is'} ready for your review and approval.`,
    })
  }

  // Show amber first, cap at 2
  const banners = rawBanners
    .sort((a, b) => (a.level === 'amber' ? -1 : 1) - (b.level === 'amber' ? -1 : 1))
    .slice(0, 2)

  return (
    <div className="space-y-6 animate-in fade-in fill-mode-both duration-300">

      {/* ── Profile Header ─────────────────────────────────────────────────── */}
      <div className="pb-6 border-b border-slate-200 space-y-5">

        {/* Row 1: Identity + Context stats */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

          {/* Left: logo + name + industry + phase bar */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1 leading-tight">
                {customer.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  {customer.industry || 'General Tech'}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Added {new Date(customer.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              {/* Phase progress bar */}
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1 w-28">
                  {[1, 2, 3, 4, 5].map(p => (
                    <div
                      key={p}
                      className={`h-1.5 flex-1 rounded-full ${p < customer.currentPhase ? 'bg-blue-500' : p === customer.currentPhase ? 'bg-blue-300' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Phase {customer.currentPhase} · {PHASE_NAMES[customer.currentPhase - 1]}
                </span>
              </div>
            </div>
          </div>

          {/* Right: maturity, use cases, assessment date */}
          <div className="flex items-start gap-5 shrink-0">
            {maturity !== null && (
              <div className="text-center">
                <p className={`text-2xl font-black leading-none ${maturityColor}`}>{maturity.toFixed(1)}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">Maturity / 5</p>
              </div>
            )}
            {ucTotal > 0 && (
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 leading-none">{ucTotal}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">Use Cases</p>
                {ucLive > 0 && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{ucLive} live</p>
                )}
              </div>
            )}
            <div className="text-right">
              {latestAssessment ? (
                <>
                  <p className="text-xs font-bold text-slate-600">Last assessed</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatTimeAgo(latestAssessment.createdAt)}</p>
                  {assessmentStale && (
                    <p className="text-[10px] text-amber-600 font-bold mt-0.5">Stale</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-slate-400">Not assessed</p>
                  <Link
                    href={`/customers/${id}/assessment/new`}
                    className="text-[10px] text-blue-600 font-bold hover:underline mt-0.5 block"
                  >
                    Start now →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Action buttons — primary first, secondary after separator */}
        <div className="flex flex-wrap items-center gap-2">
          <GenerateReportButton customerId={id} />
          <Link
            href={`/customers/${id}/intake`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm"
          >
            <BrainCircuit className="w-4 h-4" />
            AI Intake
          </Link>

          <div className="w-px h-7 bg-slate-200 mx-1" />

          <ExportDropdown customerId={id} customerName={customer.name} />
          <EditProfileModal customer={customer} />
        </div>
      </div>

      {/* ── Health Banners ──────────────────────────────────────────────────── */}
      {banners.length > 0 && (
        <div className="space-y-2">
          {banners.map((banner, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
                banner.level === 'amber'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <span className={`mt-0.5 shrink-0 ${banner.level === 'amber' ? 'text-amber-500' : 'text-blue-500'}`}>
                {banner.level === 'amber'
                  ? <AlertTriangle className="w-4 h-4" />
                  : <FileCheck className="w-4 h-4" />
                }
              </span>
              <span className="flex-1 font-semibold">{banner.text}</span>
              {banner.action && (
                <Link
                  href={banner.action.href}
                  className={`shrink-0 text-xs font-black hover:underline underline-offset-2 ${
                    banner.level === 'amber' ? 'text-amber-700' : 'text-blue-700'
                  }`}
                >
                  {banner.action.label} →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Phase Workflow ──────────────────────────────────────────────────── */}
      <ProfileWorkflow customer={customer} phaseData={phaseData} />
    </div>
  )
}
