import { getAllAssessments } from '@/app/actions'
import { Building2, Activity, Shield, Database, Layout, Users, Settings, Scale, Coins, ExternalLink, Gauge } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'

export default async function AssessmentsPage() {
    const assessments = await getAllAssessments()

    const avgMaturity = assessments.length > 0
        ? assessments.reduce((sum, a) => {
            const domainScores = [a.scoreStrategy, a.scoreData, a.scoreTech, a.scoreSecurity, a.scoreSkills, a.scoreOps, a.scoreGovernance, a.scoreFinancial].map(s => s ?? 0)
            const avg = domainScores.reduce((s: number, score: number) => s + score, 0) / domainScores.length
            return sum + avg
        }, 0) / assessments.length
        : 0

    return (
        <div className="space-y-8 animate-in fade-in fill-mode-both duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Readiness Benchmarks</h1>
                    <p className="text-slate-500">Global maturity rankings and domain-specific analysis across all engagements.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                        <Gauge className="h-5 w-5 text-blue-600" />
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Avg. Portfolio Maturity</p>
                            <p className="text-xl font-bold text-blue-700">{avgMaturity.toFixed(1)} / 5.0</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {assessments.length > 0 ? (
                    assessments.map((a) => {
                        const domains = [
                            { label: 'Strategy', score: a.scoreStrategy, icon: Layout },
                            { label: 'Data', score: a.scoreData, icon: Database },
                            { label: 'Tech', score: a.scoreTech, icon: Settings },
                            { label: 'Security', score: a.scoreSecurity, icon: Shield },
                            { label: 'Skills', score: a.scoreSkills, icon: Users },
                            { label: 'Ops', score: a.scoreOps, icon: Activity },
                            { label: 'Governance', score: a.scoreGovernance, icon: Scale },
                            { label: 'Finance', score: a.scoreFinancial, icon: Coins },
                        ]
                        const overall = domains.reduce((s, d) => s + (d.score || 0), 0) / domains.length

                        return (
                            <div key={a.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                            <Building2 className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{a.customer.name}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">Assessed on {new Date(a.completedAt || '').toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">Overall</p>
                                        <p className="text-lg font-bold text-indigo-700">{overall.toFixed(1)}</p>
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                                    {domains.map((d) => (
                                        <div key={d.label} className="space-y-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <d.icon className="h-3 w-3 text-slate-400" />
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{d.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-md font-bold text-slate-900">{d.score?.toFixed(1) || '0.0'}</span>
                                                <div
                                                    className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden"
                                                    style={{ '--bar': `${((d.score || 0) / 5) * 100}%` } as CSSProperties}
                                                >
                                                    <div
                                                        className={`h-full w-[var(--bar)] rounded-full ${(d.score || 0) < 2.5 ? 'bg-rose-500' : (d.score || 0) < 3.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                    <Link href={`/customers/${a.customerId}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                                        Deep Dive Engagement <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-white/50">
                        <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-slate-900 font-bold text-lg">No Assessments Found</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">Go to the customer list to start a new discovery assessment for your first engagement.</p>
                        <Link href="/customers" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                            View Customer Portfolio
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
