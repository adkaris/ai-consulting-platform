import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    Sparkles, ArrowRight, BarChart3, ChevronRight,
    TrendingUp, AlertTriangle, CheckCircle2, Layout,
    Database, Settings, Shield, Users, Activity, Scale, Coins,
    FileText, ClipboardList,
} from 'lucide-react'
import { getAssessmentById } from '@/app/assessment-actions'
import { generateRecommendations } from '@/lib/ai-advisor'
import AssessmentRadarChart from '@/components/AssessmentRadarChart'

// ── Domain metadata ────────────────────────────────────────────────────────────
const DOMAINS = [
    { key: 'scoreStrategy',   label: 'AI Strategy',           radarKey: 'Strategy',   Icon: Layout    },
    { key: 'scoreData',       label: 'Data Readiness',         radarKey: 'Data',       Icon: Database  },
    { key: 'scoreTech',       label: 'Tech Infrastructure',    radarKey: 'Tech',       Icon: Settings  },
    { key: 'scoreSecurity',   label: 'Cybersecurity & Risk',   radarKey: 'Security',   Icon: Shield    },
    { key: 'scoreSkills',     label: 'Talent & Skills',        radarKey: 'Skills',     Icon: Users     },
    { key: 'scoreOps',        label: 'Operations',             radarKey: 'Ops',        Icon: Activity  },
    { key: 'scoreGovernance', label: 'Governance',             radarKey: 'Governance', Icon: Scale     },
    { key: 'scoreFinancial',  label: 'Financial Commitment',   radarKey: 'Financial',  Icon: Coins     },
] as const

// Which phase does each domain's gap drive action toward?
const DOMAIN_PHASE: Record<string, number> = {
    'AI Strategy':          1,
    'Data Readiness':       1,
    'Technical Infrastructure': 1,
    'Cybersecurity & Risk': 1,
    'Talent & Skills':      4,
    'Operational Processes': 2,
    'Compliance & Governance': 4,
    'Financial Commitment': 2,
}

const PHASE_LABELS: Record<number, string> = {
    1: 'Discovery',
    2: 'Strategy',
    3: 'PoV',
    4: 'Change Mgmt',
    5: 'Realisation',
}

function scoreColor(s: number) {
    if (s < 2.5) return 'text-rose-600'
    if (s < 4)   return 'text-amber-600'
    return 'text-emerald-600'
}
function barColor(s: number) {
    if (s < 2.5) return 'bg-rose-500'
    if (s < 4)   return 'bg-amber-400'
    return 'bg-emerald-500'
}
function badgeClass(status: string) {
    return status === 'CRITICAL'
        ? 'bg-rose-100 text-rose-700 border border-rose-200'
        : status === 'OPTIMIZED'
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            : 'bg-amber-100 text-amber-700 border border-amber-200'
}

function formatDate(d: Date | null | undefined) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AssessmentResultsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ assessmentId?: string }>
}) {
    const { id: customerId } = await params
    const { assessmentId } = await searchParams

    if (!assessmentId) redirect(`/customers/${customerId}`)

    const assessment = await getAssessmentById(assessmentId)
    if (!assessment || assessment.customerId !== customerId) {
        redirect(`/customers/${customerId}`)
    }

    // Build per-domain display data from real DB values
    const domainScores = DOMAINS.map(d => ({
        key:      d.key,
        label:    d.label,
        radarKey: d.radarKey,
        Icon:     d.Icon,
        score:    (assessment as Record<string, number | null>)[d.key] ?? 0,
    }))

    const overallScore = domainScores.reduce((s, d) => s + d.score, 0) / domainScores.length
    const hasNullScores = domainScores.some(d => d.score === 0)

    // Recommendations derived from real scores (deterministic, no API call)
    const recommendations = generateRecommendations(assessment)
    const critical = recommendations.filter(r => r.status === 'CRITICAL')
    const gaps = [...critical, ...recommendations.filter(r => r.status === 'STABLE' && r.score < 3)]
        .slice(0, 4) // show top 4 gaps

    const customerName = assessment.customer?.name ?? 'Customer'

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Hero header ─────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-10 py-10 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-[10px] uppercase tracking-[0.18em] font-black">
                            <Sparkles className="w-3 h-3" /> Assessment Complete
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                            {customerName}
                            <span className="block text-slate-400 text-xl font-semibold mt-1">AI Maturity Results</span>
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Assessed {formatDate(assessment.completedAt)} · {DOMAINS.length} domains · {recommendations.length} recommendations generated
                        </p>
                    </div>

                    {/* Overall score */}
                    <div className="shrink-0 text-center bg-white/5 border border-white/10 rounded-2xl px-8 py-5">
                        <p className={`text-5xl font-black ${scoreColor(overallScore)} brightness-150`}>
                            {overallScore.toFixed(1)}
                        </p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">out of 5.0</p>
                        <p className="text-slate-300 text-sm font-semibold mt-2">Overall Maturity</p>
                        <p className={`text-xs mt-1 font-bold ${overallScore < 2.5 ? 'text-rose-400' : overallScore < 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {overallScore < 2.5 ? 'Foundation Stage' : overallScore < 4 ? 'Developing Stage' : 'Advanced Stage'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Null-score warning ───────────────────────────────────────── */}
            {hasNullScores && (
                <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                        Some domain scores are missing (showing as 0.0). This can happen if the assessment was submitted before a recent update.
                        Consider running a new assessment to get accurate results.
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Left: Heatmap + Radar ────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Domain heatmap */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                            <BarChart3 className="w-5 h-5 text-indigo-600" /> Domain Scores
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {domainScores.map(d => (
                                <div key={d.key} className="group p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                                                <d.Icon className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{d.label}</span>
                                        </div>
                                        <span className={`text-lg font-black ${scoreColor(d.score)}`}>
                                            {d.score.toFixed(1)}
                                        </span>
                                    </div>
                                    <progress
                                        value={d.score}
                                        max={5}
                                        className={`w-full h-1.5 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-moz-progress-bar]:rounded-full ${
                                            d.score < 2.5
                                                ? '[&::-webkit-progress-value]:bg-rose-500 [&::-moz-progress-bar]:bg-rose-500'
                                                : d.score < 4
                                                    ? '[&::-webkit-progress-value]:bg-amber-400 [&::-moz-progress-bar]:bg-amber-400'
                                                    : '[&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500'
                                        }`}
                                    />
                                    <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-medium">
                                        <span>
                                            {d.score < 2.5 ? '⚠ Critical' : d.score < 4 ? '◆ Developing' : '✓ Advanced'}
                                        </span>
                                        <span>/ 5.0</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Radar chart */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">Maturity Radar</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Your organisation vs. industry average baseline
                                </p>
                            </div>
                        </div>
                        <AssessmentRadarChart domainScores={domainScores} />
                    </div>
                </div>

                {/* ── Right: Gaps + Next steps ─────────────────────────────── */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Strategic gaps */}
                    <div className="bg-slate-900 rounded-2xl p-7 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black">Priority Gaps</h3>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Action required</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {gaps.length === 0 ? (
                                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    No critical gaps — all domains are developing or advanced.
                                </div>
                            ) : gaps.map((gap, i) => {
                                const phaseNum = DOMAIN_PHASE[gap.domain]
                                return (
                                    <div key={i} className="pb-5 border-b border-white/10 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${gap.status === 'CRITICAL' ? 'bg-rose-500/25 text-rose-400 border border-rose-500/30' : 'bg-amber-500/25 text-amber-400 border border-amber-500/30'}`}>
                                                {gap.status === 'CRITICAL' ? 'Critical' : 'High'}
                                            </span>
                                            <span className="text-xs font-bold text-slate-300">{gap.domain}</span>
                                        </div>
                                        <p className="text-xs text-slate-200 leading-relaxed mb-2">{gap.finding}</p>
                                        <div className="flex items-start gap-1.5 text-xs text-indigo-400 font-semibold">
                                            <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" />
                                            <span>{gap.action}</span>
                                        </div>
                                        {phaseNum && (
                                            <Link
                                                href={`/customers/${customerId}?phase=${phaseNum}`}
                                                className="mt-2 inline-flex items-center gap-1 text-[10px] text-indigo-300/70 hover:text-indigo-300 transition-colors font-bold"
                                            >
                                                <ChevronRight className="w-3 h-3" />
                                                Phase {phaseNum} · {PHASE_LABELS[phaseNum]}
                                            </Link>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {gaps.length > 0 && (
                            <Link
                                href={`/customers/${customerId}/report`}
                                className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-black transition-colors"
                            >
                                <FileText className="w-4 h-4" /> Full Gap Analysis Report
                            </Link>
                        )}
                    </div>

                    {/* All recommendations summary */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-slate-500" />
                            All Domain Ratings
                        </h4>
                        <div className="space-y-2">
                            {recommendations.map((r, i) => (
                                <div key={i} className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-slate-600 truncate">{r.domain}</span>
                                    <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full ${badgeClass(r.status)}`}>
                                        {r.status === 'CRITICAL' ? '⚠ Critical' : r.status === 'OPTIMIZED' ? '✓ Advanced' : '◆ Developing'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next steps */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            Next Steps
                        </h4>
                        <div className="space-y-3">
                            <Link
                                href={`/customers/${customerId}`}
                                className="flex items-center justify-between gap-3 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-800 transition-colors group"
                            >
                                <span>Back to Profile</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                href={`/customers/${customerId}/report`}
                                className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors group"
                            >
                                <span>Generate Report</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                href={`/customers/${customerId}/assessment/new`}
                                className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors group"
                            >
                                <span>Run New Assessment</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
