'use client'

import React, { useState, use } from 'react'
import { processMeetingNotes, applyIntakeResults } from '@/app/actions'
import { IntakeResults } from '@/lib/ai-intake'
import { 
    Sparkles, ArrowRight, BrainCircuit, FileText, CheckCircle2, 
    ChevronLeft, Zap, TrendingUp, AlertCircle, Info, Building2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AIIntakePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: customerId } = use(params)
    const router = useRouter()
    
    // UI State: 'INPUT' | 'ANALYZING' | 'REVIEW' | 'SAVING'
    const [step, setStep] = useState<'INPUT' | 'ANALYZING' | 'REVIEW' | 'SAVING'>('INPUT')
    const [notes, setNotes] = useState('')
    const [results, setResults] = useState<IntakeResults | null>(null)

    const handleAnalyze = async () => {
        if (!notes.trim()) return
        setStep('ANALYZING')
        try {
            const data = await processMeetingNotes(customerId, notes)
            setResults(data)
            setStep('REVIEW')
        } catch (error) {
            console.error(error)
            alert('Analysis failed. Please try again.')
            setStep('INPUT')
        }
    }

    const handleApply = async () => {
        if (!results) return
        setStep('SAVING')
        try {
            await applyIntakeResults(customerId, results)
            router.push(`/customers/${customerId}`)
        } catch (error) {
            console.error(error)
            alert('Failed to save data.')
            setStep('REVIEW')
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Nav Header */}
            <div className="flex items-center justify-between">
                <Link 
                    href={`/customers/${customerId}`}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Profile
                </Link>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
                    Strategic Intelligence Layer
                </div>
            </div>

            {step === 'INPUT' && (
                <div className="space-y-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 animate-pulse">
                            <BrainCircuit className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Intelligence Intake</h1>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Paste raw meeting notes, transcripts, or workshop findings. The AI will curate a readiness assessment and draft high-value use cases for you.
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-10 shadow-xl shadow-slate-200/50">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-80 px-8 py-6 rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 leading-relaxed font-medium"
                            placeholder="Paste meeting conversation here... e.g. 'CTO mentioned that data is currently stored in legacy SQL servers and they want to move to Fabric...'"
                        />
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={!notes.trim()}
                                className="px-12 py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-md font-black uppercase tracking-widest shadow-xl shadow-indigo-200 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <Sparkles className="w-5 h-5" />
                                Run Strategic Analysis
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 'ANALYZING' && (
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
                    <div className="relative mb-10 text-indigo-600">
                        <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <BrainCircuit className="w-10 h-10 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Analyzing Meeting Intelligence</h2>
                    <div className="space-y-3">
                        <p className="text-slate-500 text-sm animate-pulse">Extracting readiness scores across 8 domains...</p>
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Simulating Semantic Mapping</p>
                    </div>
                </div>
            )}

            {step === 'REVIEW' && results && (
                <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex-1">
                                <h2 className="text-3xl font-black mb-4">Strategic Summary</h2>
                                <p className="text-indigo-100/80 leading-relaxed italic text-lg line-clamp-4">
                                    "{results.sentimentSummary}"
                                </p>
                            </div>
                            <div className="w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                                <button
                                    onClick={handleApply}
                                    title="Commit Findings"
                                    aria-label="Commit Findings"
                                    className="w-full px-8 py-4 bg-white text-indigo-900 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 group"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Commit findings to profile
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Domain Review */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Suggested Readiness Scores</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(results.readinessScores).map(([domain, score]) => (
                                    <div key={domain} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-300 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{domain}</span>
                                            <span className="text-sm font-black text-indigo-600">{score.toFixed(1)}</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    title={`Set ${domain} score to ${s}`}
                                                    aria-label={`Set ${domain} score to ${s}`}
                                                    onClick={() => setResults({...results, readinessScores: {...results.readinessScores, [domain]: s}})}
                                                    className={`h-1.5 flex-1 rounded-full transition-all ${s <= (results.readinessScores[domain] || 0) ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800">
                                <Info className="w-5 h-5 shrink-0" />
                                <p className="text-[11px] font-medium leading-relaxed">
                                    These scores are baseline suggestions derived from keyword density and semantic context. **Review carefully before saving.**
                                </p>
                            </div>
                        </div>

                        {/* Use Case Extraction */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Identified Use Cases</h3>
                            </div>
                            <div className="space-y-4">
                                {results.useCases.map((uc, i) => (
                                    <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-emerald-300 transition-all group flex gap-4">
                                        <div className="shrink-0 p-3 bg-emerald-50 rounded-xl h-fit">
                                            <PlusIcon className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-black text-slate-900">{uc.title}</h4>
                                                <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded">{uc.department}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3 italic">"{uc.description}"</p>
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-black italic text-[10px]">
                                                    <TrendingUp className="w-3 h-3" /> ~${(uc.roiEstimate/1000).toFixed(0)}k ROI
                                                </div>
                                                <button 
                                                    onClick={() => setResults({...results, useCases: results.useCases.filter((_, idx) => idx !== i)})}
                                                    className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 p-1"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 'SAVING' && (
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-pulse">
                    <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-6" />
                    <h2 className="text-2xl font-black text-slate-900">Updating Customer Strategy</h2>
                    <p className="text-slate-500">Writing baseline assessments and use cases to profile...</p>
                </div>
            )}
        </div>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
}
