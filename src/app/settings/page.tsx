import { getCustomers, getAllAssessments, getAllUseCases } from '@/app/actions'
import {
    Settings, Database, Layers, ShieldCheck, BookOpen,
    GitBranch, Users, Activity, FileText, CheckCircle
} from 'lucide-react'

export default async function SettingsPage() {
    const [customers, assessments, useCases] = await Promise.all([
        getCustomers(),
        getAllAssessments(),
        getAllUseCases(),
    ])

    const dbStats = [
        { label: 'Customer Records', value: customers.length, icon: Users },
        { label: 'Assessments', value: assessments.length, icon: Activity },
        { label: 'Use Cases', value: useCases.length, icon: FileText },
    ]

    const methodology = [
        { phase: 1, title: 'Discovery & Readiness Assessment', domains: 8, questions: 47 },
        { phase: 2, title: 'Use Case Identification & Strategy Alignment', domains: 1, questions: null },
        { phase: 3, title: 'Proof of Value Execution', domains: 1, questions: null },
        { phase: 4, title: 'Deployment & Change Management', domains: 1, questions: null },
        { phase: 5, title: 'Value Realization & Continuous Improvement', domains: 1, questions: null },
    ]

    return (
        <div className="space-y-8 animate-in fade-in fill-mode-both duration-300 max-w-4xl">

            {/* Header */}
            <div className="pb-6 border-b border-slate-200">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Platform Settings</h1>
                <p className="text-slate-500">Configuration, methodology reference, and database overview.</p>
            </div>

            {/* Platform Info */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">Platform</h2>
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { label: 'Application Name', value: 'UniSystems AI Consulting Platform' },
                        { label: 'Version', value: 'MVP 1.0' },
                        { label: 'Framework', value: 'Next.js 16 (App Router)' },
                        { label: 'Database', value: 'SQLite via Prisma ORM' },
                        { label: 'Methodology', value: 'UniSystems 5-Phase AI Framework' },
                        { label: 'Assessment Model', value: '8-Domain Maturity Matrix v2.0' },
                    ].map((item) => (
                        <div key={item.label}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                            <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Database Status */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-base font-bold text-slate-900">Database</h2>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">Connected</span>
                    </div>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        {dbStats.map((stat) => (
                            <div key={stat.label} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                <stat.icon className="w-5 h-5 text-indigo-500 mx-auto mb-3" />
                                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Local Database Path</p>
                        <code className="text-xs font-mono text-slate-700">platform/prisma/dev.db</code>
                    </div>
                </div>
            </section>

            {/* Methodology Reference */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">5-Phase Consulting Methodology</h2>
                </div>
                <div className="p-8 space-y-3">
                    {methodology.map((m, idx) => (
                        <div key={m.phase} className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-indigo-200">
                                {m.phase}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{m.title}</p>
                            </div>
                            {m.questions && (
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{m.domains} Domains</p>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">{m.questions} Questions</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Assessment Domains Reference */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">8-Domain Maturity Framework</h2>
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { domain: 'AI Strategy & Vision', weight: '1.5×', critical: true },
                        { domain: 'Data Readiness & Governance', weight: '2.0×', critical: true },
                        { domain: 'Technology & Infrastructure', weight: '1.5×', critical: false },
                        { domain: 'Security & Compliance', weight: '1.5×', critical: true },
                        { domain: 'AI Skills & Talent', weight: '1.5×', critical: false },
                        { domain: 'Organisational Readiness', weight: '1.5×', critical: true },
                        { domain: 'AI Governance & Ethics', weight: '1.0×', critical: true },
                        { domain: 'Financial & Operational Readiness', weight: '1.0×', critical: false },
                    ].map((d, i) => (
                        <div key={d.domain} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black text-slate-400 w-5">{i + 1}</span>
                                <p className="text-sm font-semibold text-slate-800">{d.domain}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {d.critical && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 border border-rose-100 bg-rose-50 px-1.5 py-0.5 rounded">
                                        Critical
                                    </span>
                                )}
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                    {d.weight}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Security */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">Data & Privacy</h2>
                </div>
                <div className="p-8 space-y-4">
                    {[
                        'All data is stored locally on this machine — nothing is sent to external servers.',
                        'The SQLite database file is located at platform/prisma/dev.db and can be backed up manually.',
                        'Customer data and assessment results are confidential consulting assets.',
                    ].map((note, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-slate-600">{note}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    )
}
