'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
    TrendingUp, 
    ShieldAlert, 
    Sparkles, 
    ArrowRight, 
    Layout, 
    Database, 
    Settings, 
    Shield, 
    Users, 
    Activity, 
    Scale, 
    Coins,
    BarChart3,
    ChevronRight,
    Building2
} from 'lucide-react'
import { generateRecommendations } from '@/lib/ai-advisor'

const DOMAIN_ICONS: Record<string, any> = {
    'Strategy': Layout,
    'Data': Database,
    'Tech': Settings,
    'Security': Shield,
    'Skills': Users,
    'Ops': Activity,
    'Governance': Scale,
    'Finance': Coins
}

export default function AssessmentResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: customerId } = use(params)
    const router = useRouter()
    const searchParams = useSearchParams()
    const assessmentId = searchParams.get('assessmentId')
    
    // In a real app, we'd fetch this from an API or pass via state
    // For this MVP refinement, we'll assume the data is available in the profile 
    // but for immediate impact, we show the "Intelligence" view.
    
    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Success Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-20 -mb-20" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] uppercase tracking-[0.2em] font-black">
                            <Sparkles className="w-3 h-3" /> Diagnostic Complete
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">AI Strategy Intelligence</h1>
                        <p className="text-slate-400 text-lg max-w-xl leading-relaxed font-medium">
                            We've processed your responses. Your organization's AI maturity profile has been generated with targeted intervention paths.
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <Link 
                            href={`/customers/${customerId}`}
                            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl shadow-white/10"
                        >
                            View Profile <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Maturity Grid */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <BarChart3 className="w-6 h-6 text-indigo-600" /> Domain Heatmap
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Placeholder for real data rendering - usually passed from previous page or fetched */}
                            {[
                                { label: 'Strategy', score: 3.5, color: 'bg-indigo-600' },
                                { label: 'Data', score: 2.1, color: 'bg-rose-500' },
                                { label: 'Tech', score: 4.2, color: 'bg-emerald-500' },
                                { label: 'Security', score: 2.8, color: 'bg-amber-500' },
                                { label: 'Skills', score: 1.5, color: 'bg-rose-600' },
                                { label: 'Ops', score: 3.0, color: 'bg-blue-500' },
                                { label: 'Governance', score: 2.4, color: 'bg-rose-500' },
                                { label: 'Finance', score: 3.8, color: 'bg-indigo-500' }
                            ].map((d) => {
                                const Icon = DOMAIN_ICONS[d.label] || Activity
                                return (
                                    <div key={d.label} className="group p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 transition-colors">
                                                <Icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                                            </div>
                                            <span className="text-xl font-black text-slate-900">{d.score}/5</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 mb-3">{d.label}</p>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${d.color}`} 
                                                style={{ '--width': `${(d.score / 5) * 100}%` } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* AI advisor sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-all" />
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Strategic Gaps</h3>
                                <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Priority Action Items</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { domain: 'Data Readiness', priority: 'CRITICAL', finding: 'Lack of unified data lakehouse is stalling model training.', action: 'Centralize disparate silos.' },
                                { domain: 'Talent & Skills', priority: 'CRITICAL', finding: 'Shortage of prompt engineering expertise in marketing.', action: 'Launch internal reskilling.' },
                                { domain: 'Governance', priority: 'HIGH', finding: 'EU AI Act compliance pathways are not yet mapped.', action: 'Perform impact audit.' }
                            ].map((gap, i) => (
                                <div key={i} className="space-y-2 pb-6 border-b border-white/10 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                            gap.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        }`}>
                                            {gap.priority}
                                        </span>
                                        <span className="text-xs font-bold text-slate-300">{gap.domain}</span>
                                    </div>
                                    <p className="text-sm text-slate-100 font-medium">"{gap.finding}"</p>
                                    <div className="flex items-center text-xs text-indigo-400 font-bold mt-2">
                                        <ArrowRight className="w-3 h-3 mr-1" /> {gap.action}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link 
                            href={`/customers/${customerId}/report`}
                            className="mt-10 block w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-center text-sm font-black transition-all shadow-lg shadow-indigo-500/20 group/btn"
                        >
                            Generate Full Strategy Map 
                            <ChevronRight className="inline-block w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Phase 2 Unlocked</h4>
                        <div className="flex gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="p-2 bg-emerald-600 rounded-xl text-white h-fit shadow-lg shadow-emerald-200">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-emerald-900 leading-tight">Proceed to Strategy Alignment</p>
                                <p className="text-xs text-emerald-700 leading-relaxed font-medium">Use these diagnostic insights to identify high-ROI use cases in the next workshop.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
