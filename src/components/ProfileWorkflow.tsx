'use client'

import { useState } from 'react'
import JourneyNavigator from './JourneyNavigator'
import {
    Building2, Plus, Calendar, Activity, Zap, ArrowRight, Gauge, ShieldAlert, Sparkles,
    Rocket, Users, BarChart3, CheckSquare, Target, Clock, TrendingUp, Handshake, BookOpen, ListTodo, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import UseCaseModal from './UseCaseModal'
import { generateRecommendations } from '@/lib/ai-advisor'
import { generateDeliverable } from '@/app/actions'
import { METHODOLOGY, getPhase } from '@/lib/methodology'
import PhaseSubtaskList from './PhaseSubtaskList'
import DeliverablePanel from './DeliverablePanel'
import PhaseDocuments from './PhaseDocuments'

interface PhaseTask {
    id: string
    phaseNumber: number
    taskKey: string
    completed: boolean
    completedAt: Date | null
}

interface DeliverableRecord {
    id: string
    phaseNumber: number
    deliverableKey: string
    status: string
    generatedContent: string | null
    generatedAt: Date | null
    completedAt: Date | null
}

interface DocumentRecord {
    id: string
    phaseNumber: number
    taskKey: string | null
    fileName: string
    fileSize: number
    mimeType: string
    filePath: string
    category: string
    uploadedAt: Date
}

interface PhaseData {
    tasks: PhaseTask[]
    deliverables: DeliverableRecord[]
    documents: DocumentRecord[]
}

interface ProfileWorkflowProps {
    customer: any
    phaseData: PhaseData
}

export default function ProfileWorkflow({ customer, phaseData }: ProfileWorkflowProps) {
    const [selectedPhase, setSelectedPhase] = useState(customer.currentPhase || 1)
    const [generating, setGenerating] = useState(false)

    const handleGlobalGenerate = async (key: string, phase: number) => {
        setGenerating(true)
        try {
            await generateDeliverable(customer.id, phase, key)
            // Scroll to deliverables if possible or just show success
        } catch (error) {
            console.error('Failed to generate deliverable:', error)
            alert('Error generating document.')
        } finally {
            setGenerating(false)
        }
    }

    const renderMethodologySection = (phaseNumber: number) => {
        const phase = getPhase(phaseNumber)
        if (!phase) return null

        const phaseTasks = phaseData.tasks.filter(t => t.phaseNumber === phaseNumber)
        const phaseDeliverables = phaseData.deliverables.filter(d => d.phaseNumber === phaseNumber)
        const phaseDocuments = phaseData.documents.filter(d => d.phaseNumber === phaseNumber)

        return (
            <div className="space-y-4">
                <PhaseSubtaskList
                    customerId={customer.id}
                    phaseNumber={phaseNumber}
                    subtasks={phase.subtasks}
                    tasks={phaseTasks}
                />

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800">Deliverables</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{phase.deliverables.length} deliverable{phase.deliverables.length !== 1 ? 's' : ''} for this phase</p>
                    </div>
                    <div className="p-4 space-y-3">
                        {phase.deliverables.map(def => {
                            const record = phaseDeliverables.find(d => d.deliverableKey === def.key) ?? null
                            return (
                                <DeliverablePanel
                                    key={def.key}
                                    customerId={customer.id}
                                    phaseNumber={phaseNumber}
                                    definition={def}
                                    record={record}
                                    documents={phaseDocuments}
                                />
                            )
                        })}
                    </div>
                </div>

                <PhaseDocuments
                    customerId={customer.id}
                    phaseNumber={phaseNumber}
                    documents={phaseDocuments}
                    taskOptions={phase.subtasks.map(s => ({ key: s.key, title: s.title }))}
                />
            </div>
        )
    }

    const renderPhaseContent = () => {
        switch (selectedPhase) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Phase 1 Focus - Assessment */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/10" />
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Discovery & Readiness</h2>
                                    <p className="text-slate-500 text-sm max-w-lg">Technical and strategic gap analysis across the 8-domain framework.</p>
                                </div>
                                <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] uppercase tracking-widest font-black text-indigo-600">
                                    Phase 1
                                </div>
                            </div>

                            {customer.assessments.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(() => {
                                        const latest = customer.assessments[0]
                                        const domains = [
                                            { label: 'Strategy', score: latest.scoreStrategy },
                                            { label: 'Data', score: latest.scoreData },
                                            { label: 'Tech', score: latest.scoreTech },
                                            { label: 'Security', score: latest.scoreSecurity },
                                            { label: 'Skills', score: latest.scoreSkills },
                                            { label: 'Ops', score: latest.scoreOps },
                                            { label: 'Governance', score: latest.scoreGovernance },
                                            { label: 'Finance', score: latest.scoreFinancial },
                                        ]
                                        return domains.map((domain) => (
                                            <div key={domain.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100 group/item hover:border-indigo-200 transition-colors">
                                                <p className="text-xs text-slate-500 mb-1 font-medium">{domain.label}</p>
                                                <p className="text-xl font-bold text-slate-900">{domain.score?.toFixed(1) || '0.0'}/5</p>
                                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                                    <div
                                                        className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                                                        style={{ '--width': `${((domain.score || 0) / 5) * 100}%` } as React.CSSProperties}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    })()}
                                    <div className="col-span-full mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <Gauge className="w-4 h-4 mr-1.5 text-indigo-600" />
                                            Last completed: {new Date(customer.assessments[0].completedAt || '').toLocaleDateString()}
                                        </div>
                                        <Link href={`/customers/${customer.id}/assessment/new`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group">
                                            Run Diagnostic <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
                                    <Activity className="h-10 w-10 text-indigo-600 mb-4" />
                                    <h3 className="text-slate-800 font-medium mb-1">No Assessment Data</h3>
                                    <p className="text-slate-500 text-sm max-w-sm mb-6">Start Phase 1 by evaluating the current technology landscape and readiness.</p>
                                    <Link
                                        href={`/customers/${customer.id}/assessment/new`}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 scale-100 hover:scale-105"
                                    >
                                        Launch Discovery Tool
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* AI Advisor Insights */}
                        {customer.assessments.length > 0 && (
                            <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-8 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-400/10 transition-all" />
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 leading-tight">Advisor Intelligence</h2>
                                        <p className="text-[10px] uppercase tracking-widest font-black text-blue-600">Automated Gap Analysis</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {generateRecommendations(customer.assessments[0])
                                        .filter(r => r.status === 'CRITICAL')
                                        .slice(0, 4)
                                        .map((gap, i) => (
                                            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-blue-100/50 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="p-2 h-fit bg-rose-50 rounded-lg">
                                                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 mb-1">Critical: {gap.domain}</p>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed italic mb-3">"{gap.finding}"</p>
                                                    <div className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">
                                                        Fix: {gap.action}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <button
                                    onClick={() => handleGlobalGenerate('readiness_report', 1)}
                                    disabled={generating}
                                    className="block w-full text-center py-4 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-2xl transition-all mt-6 shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
                                >
                                    <Sparkles className={`w-5 h-5 ${generating ? 'animate-spin' : 'animate-pulse'}`} />
                                    {generating ? 'Processing Data...' : 'Generate Intelligence Report & Strategy Map'}
                                    {!generating && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        )}

                        {renderMethodologySection(1)}
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Phase 2 Focus - Use Cases */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/10" />
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Strategy Alignment</h2>
                                    <p className="text-slate-500 text-sm max-w-lg">Prioritizing high-ROI AI initiatives into a validated implementation backlog.</p>
                                </div>
                                <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] uppercase tracking-widest font-black text-emerald-600">
                                    Phase 2
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Total Initiatives</p>
                                        <p className="text-xl font-black text-slate-900">{customer.useCases.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Est. Portfolio Value</p>
                                        <p className="text-xl font-black text-emerald-600">${customer.useCases.reduce((acc: any, curr: any) => acc + (curr.roiEstimate || 0), 0).toLocaleString()}</p>
                                    </div>
                                </div>
                                <UseCaseModal customerId={customer.id} />
                            </div>

                            {customer.useCases.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {customer.useCases.map((uc: any) => (
                                        <div key={uc.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className={`p-3 rounded-xl shadow-sm ${uc.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    <Zap className="w-5 h-5 fill-current" />
                                                </div>
                                                <div>
                                                    <h4 className="text-md font-black text-slate-900 mb-1">{uc.title}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest border ${
                                                            uc.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            uc.status === 'PILOTING' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-200'
                                                        }`}>
                                                            {uc.status}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                        <span className="text-[10px] uppercase tracking-widest font-black text-blue-600">{uc.priority} Priority</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-6">
                                                <div>
                                                    <p className="text-lg font-black text-slate-900 leading-none">{uc.roiEstimate ? `$${uc.roiEstimate.toLocaleString()}` : 'Valuating...'}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Projected ROI</p>
                                                </div>
                                                <div className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/20">
                                    <Plus className="h-8 w-8 text-slate-300 mb-4" />
                                    <p className="text-slate-500 text-sm font-medium">Identify specific AI use cases to build the strategy roadmap.</p>
                                </div>
                            )}
                        </div>

                        {renderMethodologySection(2)}
                    </div>
                )
            case 3:
                const pilots = customer.useCases.filter((uc: any) => uc.status === 'PILOTING' || uc.status === 'APPROVED')
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Phase 3 Focus - PoV Execution */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-orange-500/10" />
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">PoV & Pilot Execution</h2>
                                    <p className="text-slate-500 text-sm max-w-lg">Executing Proof of Values (PoVs) to validate technical feasibility and business impact.</p>
                                </div>
                                <div className="px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-[10px] uppercase tracking-widest font-black text-orange-600">
                                    Phase 3
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pilots.length > 0 ? pilots.map((pilot: any) => (
                                    <div key={pilot.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 relative group/card hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                                <Rocket className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border ${pilot.status === 'PILOTING' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                                                }`}>
                                                {pilot.status}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-1">{pilot.title}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 italic">"{pilot.description}"</p>

                                        <div className="space-y-3 pt-4 border-t border-slate-200/60">
                                            <div className="flex justify-between text-[11px] font-bold">
                                                <span className="text-slate-400">Launch Timeline</span>
                                                <span className="text-slate-700 flex items-center gap-1"><Clock className="w-3 h-3" /> 8-12 Weeks</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] font-bold">
                                                <span className="text-slate-400">Target KPI</span>
                                                <span className="text-emerald-600 flex items-center gap-1"><Target className="w-3 h-3" /> Efficiency Gain</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-50">
                                        <Clock className="w-12 h-12 text-slate-300 mb-4" />
                                        <p className="text-slate-500 font-medium">No pilots active. Filter use cases for piloting in Phase 2.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {renderMethodologySection(3)}
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Phase 4 Focus - Change Management */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/10" />
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Change & Adoption</h2>
                                    <p className="text-slate-500 text-sm max-w-lg">Orchestrating the organizational shift towards AI-enabled workflows and culture.</p>
                                </div>
                                <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] uppercase tracking-widest font-black text-indigo-600">
                                    Phase 4
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { icon: Handshake, title: 'Stakeholder Alignment', status: 'In Progress', desc: 'Securing multi-level executive buy-in.' },
                                    { icon: BookOpen, title: 'AI Literacy Program', status: 'Planned', desc: 'Scaling technical and user awareness training.' },
                                    { icon: Users, title: 'Talent Reskilling', status: 'Standard', desc: 'Identifying new roles and structural adjustments.' },
                                    { icon: ShieldAlert, title: 'Ethical Guardrails', status: 'Critical', desc: 'Deploying AI ethics and governance frameworks.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 h-fit">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-black text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-xs text-slate-500 leading-tight mb-3">{item.desc}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest border ${item.status === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    item.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-slate-50 text-slate-500 border-slate-200'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {renderMethodologySection(4)}
                    </div>
                )
            case 5:
                const productionCases = customer.useCases.filter((uc: any) => uc.status === 'PRODUCTION')
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Phase 5 Focus - Value Realization */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/10" />
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Value Realization</h2>
                                    <p className="text-slate-500 text-sm max-w-lg">Measuring realized ROI and tracking KPIs across the production AI portfolio.</p>
                                </div>
                                <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] uppercase tracking-widest font-black text-emerald-600">
                                    Phase 5
                                </div>
                            </div>

                            {productionCases.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                                            <p className="text-[10px] font-black uppercase text-emerald-700 mb-1">Portfolio ROI</p>
                                            <p className="text-3xl font-black text-slate-900">$1.2M</p>
                                            <p className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1 font-bold">
                                                <TrendingUp className="w-3 h-3" /> +15% vs Target
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Live Agents</p>
                                            <p className="text-3xl font-black text-slate-900">{productionCases.length}</p>
                                            <p className="text-[10px] text-slate-500 mt-2 font-bold">Active in Production</p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Token Efficiency</p>
                                            <p className="text-3xl font-black text-slate-900">92%</p>
                                            <p className="text-[10px] text-slate-500 mt-2 font-bold">Latency Optimization</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-slate-100">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Value Benchmarks</h3>
                                        {productionCases.map((uc: any) => (
                                            <div key={uc.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-emerald-300 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                                        <BarChart3 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-slate-900">{uc.title}</p>
                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Realized Value</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-slate-900">${(uc.roiEstimate * 1.1).toLocaleString()}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">Captured to Date</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                                        <TrendingUp className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-1">No Realized Value Yet</h3>
                                    <p className="text-slate-500 text-sm max-w-sm">Scale your Phase 3 pilots to production to begin tracking real-world business impact and ROI.</p>
                                </div>
                            )}
                        </div>

                        {renderMethodologySection(5)}
                    </div>
                )
            default:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center min-h-[400px] border border-dashed border-slate-200 rounded-3xl bg-slate-50/30">
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-6">
                            {selectedPhase === 3 ? <Rocket className="w-10 h-10 text-orange-500" /> :
                                selectedPhase === 4 ? <Users className="w-10 h-10 text-indigo-500" /> :
                                    <BarChart3 className="w-10 h-10 text-emerald-500" />}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">
                            {selectedPhase === 3 ? 'PoV Execution' :
                                selectedPhase === 4 ? 'Change Management' :
                                    'Value Realization'}
                        </h3>
                        <p className="text-slate-500 text-sm max-w-xs text-center leading-relaxed">
                            This phase is locked until Phase {selectedPhase - 1} reaches full maturity. Update the Navigator to begin active planning for this milestone.
                        </p>
                    </div>
                )
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Navigator */}
            <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col h-full shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-black text-slate-900 mb-1">AI Strategic Roadmap</h2>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Client Success Framework</p>
                </div>

                <JourneyNavigator
                    customerId={customer.id}
                    currentPhase={customer.currentPhase}
                    selectedPhase={selectedPhase}
                    onPhaseSelect={setSelectedPhase}
                />

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                        <p className="text-xs font-bold text-orange-800 flex items-center gap-2 mb-1">
                            <Zap className="w-3 h-3 text-orange-600" /> Interactive Mode
                        </p>
                        <p className="text-[10px] text-orange-700 leading-tight">
                            Click any phase above to switch the work area view and manage specific deliverables.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column - Dynamic Work Area */}
            <div className="lg:col-span-2">
                {renderPhaseContent()}
            </div>
        </div>
    )
}
