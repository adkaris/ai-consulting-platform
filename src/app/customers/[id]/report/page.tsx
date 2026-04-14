import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    Building2, Activity, ShieldAlert, Sparkles, TrendingUp,
    ArrowLeft, Gauge, Target, Layers, Zap, MonitorSmartphone,
    BookOpen, UserCheck, Lightbulb, LockKeyhole, Users
} from 'lucide-react'
import { generateRecommendations } from '@/lib/ai-advisor'
import PrintButton from '@/components/PrintButton'
import PrintSectionControls from '@/components/PrintSectionControls'

export default async function CustomerReport({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
            assessments: { orderBy: { completedAt: 'desc' } },
            copilotAssessments: { orderBy: { completedAt: 'desc' } },
            useCases: { orderBy: { createdAt: 'desc' } }
        }
    })

    if (!customer) return notFound()

    const isCopilotOnly = customer.aiTrack === 'COPILOT'
    const isMixed      = customer.aiTrack === 'MIXED'
    const isGeneralAI  = !isCopilotOnly

    // ── General AI assessment ────────────────────────────────────────────────
    const assessment = customer.assessments[0] ?? null
    const recommendations = assessment ? generateRecommendations(assessment) : []
    const criticalGaps = recommendations.filter(r => r.status === 'CRITICAL')

    const domainScores = assessment ? [
        assessment.scoreStrategy, assessment.scoreData, assessment.scoreTech,
        assessment.scoreSecurity, assessment.scoreSkills, assessment.scoreOps,
        assessment.scoreGovernance, assessment.scoreFinancial
    ].filter((s): s is number => s !== null) : []
    const overallScore = domainScores.length > 0
        ? (domainScores.reduce((a, b) => a + b, 0) / domainScores.length).toFixed(1)
        : null

    // ── Copilot assessment ───────────────────────────────────────────────────
    const copilotAssessment = customer.copilotAssessments[0] ?? null
    const copilotDomainScores = copilotAssessment ? [
        copilotAssessment.scoreStrategy, copilotAssessment.scoreM365,
        copilotAssessment.scoreContent, copilotAssessment.scoreSecurity,
        copilotAssessment.scoreIdentity, copilotAssessment.scoreAdoption,
        copilotAssessment.scoreUseCases, copilotAssessment.scoreGovernance,
    ].filter((s): s is number => s !== null) : []
    const copilotOverallScore = copilotDomainScores.length > 0
        ? (copilotDomainScores.reduce((a, b) => a + b, 0) / copilotDomainScores.length).toFixed(1)
        : null

    // Score shown in the hero badge
    const displayScore = isCopilotOnly ? copilotOverallScore : overallScore

    const totalRoi = customer.useCases.reduce((acc, curr) => acc + (curr.roiEstimate || 0), 0)

    // ── Theming based on track ───────────────────────────────────────────────
    const accent  = isCopilotOnly ? 'violet' : 'indigo'
    const accentHex = isCopilotOnly ? '#7c3aed' : '#4f46e5'
    const accentBg  = isCopilotOnly ? 'bg-violet-600' : 'bg-indigo-600'
    const accentText = isCopilotOnly ? 'text-violet-600' : 'text-indigo-600'
    const accentBorder = isCopilotOnly ? 'border-violet-600' : 'border-indigo-600'
    const accentBar = isCopilotOnly ? 'bg-violet-600' : 'bg-indigo-600'
    const accentShadow = isCopilotOnly ? 'shadow-violet-100' : 'shadow-indigo-100'
    const accentBadgeBg = isCopilotOnly ? 'bg-violet-50 text-violet-700' : 'bg-indigo-50 text-indigo-700'

    const reportTitle = isCopilotOnly ? 'Copilot Readiness Report'
        : isMixed ? 'AI & Copilot Readiness Report'
        : 'AI Readiness & Roadmap'
    const reportLabel = isCopilotOnly ? 'Copilot Readiness' : 'Strategic Deliverable'
    const scoreLabel  = isCopilotOnly ? 'Copilot Score' : 'Maturity Score'
    const scoreStatus = isCopilotOnly
        ? (Number(displayScore) > 3.5 ? 'Deployment Ready' : 'Foundation Phase')
        : (Number(displayScore) > 3.5 ? 'Market Ready' : 'Foundation Phase')

    // ── Copilot domain grid data ──────────────────────────────────────────────
    const COPILOT_DOMAINS = [
        { label: 'Strategy & Vision',        score: copilotAssessment?.scoreStrategy,   icon: Target         },
        { label: 'M365 Foundation',           score: copilotAssessment?.scoreM365,       icon: Layers         },
        { label: 'Content & Data',            score: copilotAssessment?.scoreContent,    icon: BookOpen       },
        { label: 'Security & Compliance',     score: copilotAssessment?.scoreSecurity,   icon: ShieldAlert    },
        { label: 'Identity & Access',         score: copilotAssessment?.scoreIdentity,   icon: LockKeyhole    },
        { label: 'User Adoption',             score: copilotAssessment?.scoreAdoption,   icon: UserCheck      },
        { label: 'Use Case Value',            score: copilotAssessment?.scoreUseCases,   icon: Lightbulb      },
        { label: 'Copilot Governance',        score: copilotAssessment?.scoreGovernance, icon: Gauge          },
    ]

    // Copilot gaps: domains scoring below 3.5
    const copilotGaps = COPILOT_DOMAINS
        .filter(d => d.score != null && d.score < 3.5)
        .sort((a, b) => (a.score ?? 5) - (b.score ?? 5))
        .slice(0, 4)

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-8 px-4 animate-in fade-in duration-700">

            {/* Report Toolset - Non-print */}
            <div className="flex items-center justify-between print:hidden bg-slate-900 text-white p-4 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-4">
                    <Link href={`/customers/${id}`} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{reportLabel}</p>
                        <h4 className="text-sm font-bold">{customer.name}</h4>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <PrintSectionControls />
                    <PrintButton />
                </div>
            </div>

            {/* THE ACTUAL REPORT BOARD */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] overflow-hidden print:shadow-none print:border-none">

                {/* 1. Header & Title Block */}
                <div className="p-12 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-[400px] h-[400px] ${isCopilotOnly ? 'bg-violet-500/5' : 'bg-indigo-500/5'} rounded-full blur-[100px] -mr-48 -mt-48`} />
                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 ${accentBg} rounded-2xl text-white shadow-xl ${accentShadow}`}>
                                    {isCopilotOnly ? <MonitorSmartphone className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                </div>
                                <div>
                                    <p className={`text-xs font-black uppercase tracking-[0.2em] ${accentText}`}>{reportLabel}</p>
                                    <h1 className="text-3xl font-black text-slate-900 uppercase">{reportTitle}</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 pt-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Company</p>
                                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-400" /> {customer.name}
                                    </p>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Industry</p>
                                    <p className={`text-sm font-bold text-slate-900 flex items-center gap-2`}>
                                        <Activity className={`w-4 h-4 ${accentText}`} /> {customer.industry || 'Enterprise'}
                                    </p>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Date</p>
                                    <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                        {displayScore && (
                            <div className="text-right">
                                <div className={`inline-flex flex-col items-center p-6 bg-white border-2 ${accentBorder} rounded-[2rem] shadow-xl ${accentShadow}`}>
                                    <p className={`text-[10px] font-black uppercase ${accentText} mb-1`}>{scoreLabel}</p>
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter">{displayScore}<span className="text-2xl text-slate-300">/5</span></p>
                                    <div className={`mt-2 px-3 py-1 ${accentBadgeBg} text-[10px] font-black rounded-full uppercase`}>
                                        {scoreStatus}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Analytical Summary */}
                <div className="p-12 space-y-12">

                    {/* ── General AI Domain Grid (shown for GENERAL_AI and MIXED) ── */}
                    {isGeneralAI && assessment && (
                        <section id="report-section-domains">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {isMixed ? 'General AI — Domain Maturity' : 'Technical Domain Maturity'}
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Strategy',      score: assessment.scoreStrategy,   icon: Target    },
                                    { label: 'Data',          score: assessment.scoreData,        icon: Layers    },
                                    { label: 'Infrastructure',score: assessment.scoreTech,        icon: Zap       },
                                    { label: 'Security',      score: assessment.scoreSecurity,    icon: ShieldAlert },
                                    { label: 'Talent',        score: assessment.scoreSkills,      icon: Users     },
                                    { label: 'Operations',    score: assessment.scoreOps,         icon: Gauge     },
                                    { label: 'Governance',    score: assessment.scoreGovernance,  icon: Activity  },
                                    { label: 'Financial',     score: assessment.scoreFinancial,   icon: TrendingUp },
                                ].map((d) => (
                                    <div key={d.label} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group">
                                        <d.icon className="w-5 h-5 text-slate-400 mb-3 group-hover:text-indigo-600 transition-colors" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{d.label}</p>
                                        <p className="text-2xl font-black text-slate-900 mb-3">{d.score?.toFixed(1) || '0.0'}</p>
                                        <progress value={d.score || 0} max={5} className="w-full h-1.5 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-indigo-600 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Copilot Domain Grid (shown for COPILOT and MIXED) ── */}
                    {(isCopilotOnly || isMixed) && copilotAssessment && (
                        <section id="report-section-copilot-domains">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-2 h-6 bg-violet-600 rounded-full" />
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {isMixed ? 'Microsoft Copilot — Readiness Domains' : 'Copilot Readiness Domains'}
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {COPILOT_DOMAINS.map((d) => (
                                    <div key={d.label} className="p-6 rounded-3xl bg-violet-50/30 border border-violet-100 hover:bg-white hover:shadow-xl hover:border-violet-200 transition-all group">
                                        <d.icon className="w-5 h-5 text-violet-400 mb-3 group-hover:text-violet-600 transition-colors" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{d.label}</p>
                                        <p className="text-2xl font-black text-slate-900 mb-3">{d.score?.toFixed(1) || '0.0'}</p>
                                        <progress value={d.score || 0} max={5} className="w-full h-1.5 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-violet-600 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-violet-600" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Gap Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                        <section id="report-section-gaps">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-2 h-6 bg-rose-600 rounded-full" />
                                <h3 className="text-xl font-black text-rose-600 uppercase tracking-tight">Critical Gaps</h3>
                            </div>
                            <div className="space-y-4">
                                {/* General AI gaps */}
                                {isGeneralAI && criticalGaps.length > 0 && criticalGaps.map((gap, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-rose-50/30 border border-rose-100 relative group">
                                        <div className="flex gap-4">
                                            <div className="p-2 bg-rose-500 rounded-xl text-white h-fit scale-90">
                                                <ShieldAlert className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 uppercase mb-1">{gap.domain}</p>
                                                <p className="text-[13px] text-slate-600 leading-relaxed italic mb-4">&ldquo;{gap.finding}&rdquo;</p>
                                                <div className="inline-flex items-center px-3 py-1 bg-white text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100 shadow-sm">
                                                    RESOLUTION: {gap.action}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Copilot gaps */}
                                {(isCopilotOnly || isMixed) && copilotGaps.map((gap, i) => (
                                    <div key={`copilot-gap-${i}`} className="p-6 rounded-3xl bg-rose-50/30 border border-rose-100">
                                        <div className="flex gap-4">
                                            <div className="p-2 bg-rose-500 rounded-xl text-white h-fit scale-90">
                                                <ShieldAlert className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 uppercase mb-1">{gap.label}</p>
                                                <p className="text-[13px] text-slate-600 leading-relaxed italic mb-2">
                                                    Score {gap.score?.toFixed(1)} — requires improvement before full Copilot deployment.
                                                </p>
                                                <div className="inline-flex items-center px-3 py-1 bg-white text-violet-600 text-[10px] font-black rounded-lg border border-violet-100 shadow-sm">
                                                    COPILOT TRACK · Priority Focus Area
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isGeneralAI && criticalGaps.length === 0 && copilotGaps.length === 0 && (
                                    <p className="text-slate-400 italic text-sm">No critical gaps identified in the current assessment session.</p>
                                )}
                            </div>
                        </section>

                        <section id="report-section-roadmap">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-2 h-6 bg-emerald-600 rounded-full" />
                                <h3 className="text-xl font-black text-emerald-600 uppercase tracking-tight">Strategic Roadmap</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-8 rounded-[2rem] bg-emerald-600 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
                                    <TrendingUp className="absolute top-0 right-0 w-32 h-32 text-white/10 -mr-12 -mt-12" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-2">Portfolio Potential</p>
                                    <p className="text-4xl font-black tracking-tighter">${totalRoi.toLocaleString()}</p>
                                    <p className="text-[11px] font-bold text-emerald-100 mt-2">Projected Annual Savings / Value Across {customer.useCases.length} Initiatives</p>
                                </div>
                                <div className="space-y-3">
                                    {customer.useCases.slice(0, 3).map((uc) => (
                                        <div key={uc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <Zap className="w-4 h-4 text-amber-500 fill-current" />
                                                <span className="text-sm font-bold text-slate-900">{uc.title}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-black text-emerald-600">${(uc.roiEstimate || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {customer.useCases.length > 3 && (
                                        <p className="text-[10px] text-center font-black text-slate-400 uppercase pt-2">+{customer.useCases.length - 3} Additional Initiatives Listed in Appendix</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 3. Methodology Appendix */}
                    <div id="report-section-appendix" className="pt-12 mt-12 border-t border-slate-100 space-y-4">
                        <div className="grid grid-cols-3 gap-8 text-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
                            <p>UniSystems AI Consulting Framework v2.0</p>
                            <p>{isCopilotOnly ? 'Microsoft Copilot Readiness Matrix' : 'Proprietary Maturity Matrix'}</p>
                            <p>Confidential Client Advisor</p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-4 border-t border-slate-100">
                            <span>
                                Report generated:{' '}
                                <span className="font-bold text-slate-600">
                                    {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </span>
                            {(assessment || copilotAssessment) && (
                                <span>
                                    Assessment date:{' '}
                                    <span className="font-bold text-slate-600">
                                        {(() => {
                                            const a = isCopilotOnly ? copilotAssessment : assessment
                                            return a?.completedAt ? new Date(a.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'
                                        })()}
                                    </span>
                                </span>
                            )}
                            <span className="font-bold text-slate-500">{customer.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styling */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; }
                    body { background: white; }
                    .print\\:hidden { display: none !important; }
                    .max-w-5xl { max-width: 100% !important; padding: 0 !important; }
                    .bg-slate-50 { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; }
                    .bg-indigo-600 { background-color: #4f46e5 !important; -webkit-print-color-adjust: exact; }
                    .bg-violet-600 { background-color: #7c3aed !important; -webkit-print-color-adjust: exact; }
                    .bg-emerald-600 { background-color: #059669 !important; -webkit-print-color-adjust: exact; }
                }
            `}} />
        </div>
    )
}

