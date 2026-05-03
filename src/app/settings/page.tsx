import { getCustomers, getAllAssessments, getAllUseCases } from '@/app/actions'
import { getAssessmentSchema, getCopilotAssessmentSchema } from '@/app/assessment-actions'
import MethodologyEditor from '@/components/MethodologyEditor'
import LlmSettings from '@/components/LlmSettings'
import ExportDataButton from '@/components/ExportDataButton'
import {
    Settings, Database, Layers, ShieldCheck, BookOpen,
    GitBranch, Users, Activity, FileText, CheckCircle, Bot, HardDriveDownload, MonitorSmartphone
} from 'lucide-react'
import ResetDatabaseButton from '@/components/ResetDatabaseButton'

export default async function SettingsPage() {
    const [customers, assessments, useCases, assessmentSchema, copilotSchema] = await Promise.all([
        getCustomers(),
        getAllAssessments(),
        getAllUseCases(),
        getAssessmentSchema(),
        getCopilotAssessmentSchema(),
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

            {/* LLM Configuration */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bot className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-base font-bold text-slate-900">AI / LLM Provider</h2>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
                        Intelligence Intake
                    </span>
                </div>
                <div className="p-8">
                    <LlmSettings />
                </div>
            </section>

            {/* Platform Info */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">Platform</h2>
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { label: 'Application Name', value: 'UniSystems AI Consulting Platform' },
                        { label: 'Version', value: '1.2.0' },
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
                    <ExportDataButton />
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
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Local Database Path</p>
                        <code className="text-xs font-mono text-slate-700">platform/prisma/dev.db</code>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Danger Zone</p>
                        <p className="text-sm text-slate-500 mb-4">Reset the database to a clean empty state. All customer data, assessments, use cases, and deliverables will be permanently deleted. The assessment question bank is preserved.</p>
                        <ResetDatabaseButton />
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

            {/* Assessment Question Bank — General AI */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-base font-bold text-slate-900">General AI — Assessment Question Bank</h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-widest">
                        <Bot className="w-3 h-3" /> General AI Track
                    </span>
                </div>
                <div className="p-8">
                    <p className="text-sm text-slate-500 mb-6">
                        Questions used in the <strong>General AI Readiness Assessment</strong> wizard — 8 domains covering strategy, data, technology, security, skills, operations, governance, and financial readiness.
                    </p>
                    <MethodologyEditor initialDomains={assessmentSchema as any} />
                </div>
            </section>

            {/* Assessment Question Bank — Microsoft Copilot */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MonitorSmartphone className="w-5 h-5 text-violet-600" />
                        <h2 className="text-base font-bold text-slate-900">Microsoft Copilot — Assessment Question Bank</h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-violet-50 text-violet-700 border border-violet-100 uppercase tracking-widest">
                        <MonitorSmartphone className="w-3 h-3" /> Copilot Track
                    </span>
                </div>
                <div className="p-8">
                    <p className="text-sm text-slate-500 mb-6">
                        Questions used in the <strong>Microsoft Copilot Readiness Assessment</strong> wizard — 8 Copilot-specific domains covering M365 foundation, identity, content governance, security, adoption, use cases, and Copilot governance.
                    </p>
                    <MethodologyEditor initialDomains={copilotSchema as any} />
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
