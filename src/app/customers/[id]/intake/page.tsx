'use client'

import React, { useState, use, useEffect } from 'react'
import { processMeetingNotes, applyIntakeResults } from '@/app/actions'
import { IntakeResults } from '@/lib/ai-intake'
import { loadLlmConfig, PROVIDER_LABELS, type LlmConfig } from '@/lib/llm-config'
import {
    Sparkles, ArrowRight, BrainCircuit, FileText, CheckCircle2,
    ChevronLeft, Zap, TrendingUp, AlertCircle, Info, Building2,
    Upload, FileUp, X, Check, ShieldCheck, Target, BarChart3,
    Bot, TestTube2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AIIntakePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: customerId } = use(params)
    const router = useRouter()
    
    // UI State: 'INPUT' | 'ANALYZING' | 'REVIEW' | 'SAVING'
    const [step, setStep] = useState<'INPUT' | 'ANALYZING' | 'REVIEW' | 'SAVING'>('INPUT')
    const [notes, setNotes] = useState('')
    const [isDragging, setIsDragging] = useState(false)

    // LLM config — loaded from localStorage on mount
    const [llmConfig, setLlmConfig] = useState<LlmConfig>({ provider: 'mock' })
    useEffect(() => { setLlmConfig(loadLlmConfig()) }, [])

    // Analysis results and approval state
    const [rawResults, setRawResults] = useState<IntakeResults | null>(null)
    const [approvedScores, setApprovedScores] = useState<Record<string, boolean>>({})
    const [approvedUseCases, setApprovedUseCases] = useState<Record<number, boolean>>({})

    const handleAnalyze = async () => {
        if (!notes.trim()) return
        setStep('ANALYZING')
        try {
            const data = await processMeetingNotes(customerId, notes, llmConfig)
            setRawResults(data)
            
            // Initialize all as approved by default
            const initialScores: Record<string, boolean> = {}
            Object.keys(data.readinessScores).forEach(domain => initialScores[domain] = true)
            setApprovedScores(initialScores)
            
            const initialUCs: Record<number, boolean> = {}
            data.useCases.forEach((_, i) => initialUCs[i] = true)
            setApprovedUseCases(initialUCs)
            
            setStep('REVIEW')
        } catch (error) {
            console.error(error)
            alert('Analysis failed. Please try again.')
            setStep('INPUT')
        }
    }

    const handleApply = async () => {
        if (!rawResults) return
        setStep('SAVING')
        
        // Filter out rejected items
        const filteredScores: Record<string, number> = {}
        Object.entries(rawResults.readinessScores).forEach(([domain, score]) => {
            if (approvedScores[domain]) filteredScores[domain] = score
        })
        
        const filteredUseCases = rawResults.useCases.filter((_, i) => approvedUseCases[i])
        
        try {
            await applyIntakeResults(customerId, {
                readinessScores: filteredScores,
                useCases: filteredUseCases
            })
            router.push(`/customers/${customerId}`)
        } catch (error) {
            console.error(error)
            alert('Failed to save data.')
            setStep('REVIEW')
        }
    }

    const toggleScore = (domain: string) => {
        setApprovedScores(prev => ({ ...prev, [domain]: !prev[domain] }))
    }

    const toggleUseCase = (index: number) => {
        setApprovedUseCases(prev => ({ ...prev, [index]: !prev[index] }))
    }

    const activeScoresCount = Object.values(approvedScores).filter(Boolean).length
    const activeUCsCount = Object.values(approvedUseCases).filter(Boolean).length

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header / Stepper Overlay */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <Link 
                        href={`/customers/${customerId}`}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-2 w-fit"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Profile
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Intake</h1>
                </div>

                <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                    {[
                        { id: 'INPUT', label: 'Upload' },
                        { id: 'ANALYZING', label: 'Analyze' },
                        { id: 'REVIEW', label: 'Approve' },
                        { id: 'SAVING', label: 'Finish' }
                    ].map((s, idx) => (
                        <div key={s.id} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                step === s.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 
                                (['ANALYZING','REVIEW','SAVING'].includes(step) && idx < 2) || (step === 'REVIEW' && idx === 1) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {idx + 1}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step === s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                                {s.label}
                            </span>
                            {idx < 3 && <div className="w-4 h-px bg-slate-200 mx-1 hidden sm:block" />}
                        </div>
                    ))}
                </div>
            </div>

            {step === 'INPUT' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Info & Requirements */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
                            <BrainCircuit className="w-10 h-10 mb-6 text-indigo-300" />
                            <h2 className="text-2xl font-black mb-4 leading-tight">Strategic Content Analysis</h2>
                            <p className="text-indigo-100/70 text-sm leading-relaxed mb-6">
                                Upload your workshop findings, meeting transcripts, or discovery notes. Our Strategic Intelligence Layer will automatically:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { icon: <ShieldCheck className="w-4 h-4" />, text: "Map Readiness (Phase 1 Alignment)" },
                                    { icon: <Target className="w-4 h-4" />, text: "Identify Phase 2 Initiatives" },
                                    { icon: <BarChart3 className="w-4 h-4" />, text: "Sync updates with Strategic Roadmap" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="p-1.5 bg-white/10 rounded-lg text-white">
                                            {item.icon}
                                        </div>
                                        <span className="text-xs font-bold leading-relaxed">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Ingestion Parameters</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-bold">Formats</span>
                                    <span className="font-black text-slate-900">PDF, DOCX, TXT</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-bold">Max Size</span>
                                    <span className="font-black text-slate-900">10 MB</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-bold">Language</span>
                                    <span className="font-black text-slate-900">Multi-lingual Support</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Upload/Paste Zone */}
                    <div className="lg:col-span-8 space-y-6">
                        <div 
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* Handle file drop */ }}
                            className={`relative rounded-[3rem] border-4 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center min-h-[500px] ${
                                isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                            <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center">
                                <input type="file" className="hidden" accept=".pdf,.docx,.txt" />
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <FileUp className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Drag & Drop or Paste Content</h3>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8">
                                    Drag archives or transcripts here, or use the field below to paste raw meeting notes for immediate processing.
                                </p>
                            </label>

                            <div className="w-full relative">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full h-64 p-6 rounded-3xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-medium leading-relaxed placeholder:text-slate-300 shadow-inner"
                                    placeholder="Paste notes here manually if you don't have a file..."
                                />
                                <div className="absolute top-4 right-4 text-[10px] font-black uppercase text-slate-300 tracking-widest">
                                    Strategic Input Field
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col items-center gap-4 w-full">
                                {/* LLM provider indicator */}
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    {llmConfig.provider === 'mock'
                                        ? <><TestTube2 className="w-3.5 h-3.5 text-slate-400" /><span>Dev Mode (keyword matching)</span></>
                                        : <><Bot className="w-3.5 h-3.5 text-indigo-500" /><span className="font-semibold text-indigo-700">{PROVIDER_LABELS[llmConfig.provider]}</span><span className="text-slate-400">— real LLM analysis</span></>
                                    }
                                    <Link href="/settings" className="text-indigo-500 hover:underline ml-1">Change</Link>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAnalyze}
                                    disabled={!notes.trim()}
                                    className="px-10 py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-3"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Launch Strategic Analysis
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 'ANALYZING' && (
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20 bg-white rounded-[4rem] border border-slate-100 shadow-2xl">
                    <div className="relative mb-12">
                        <div className="w-32 h-32 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
                        <BrainCircuit className="w-12 h-12 absolute inset-0 m-auto text-indigo-600 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Analysing Notes…</h2>
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="flex items-center gap-2 justify-center text-sm text-slate-500">
                            {llmConfig.provider === 'mock'
                                ? <><TestTube2 className="w-4 h-4 text-slate-400" /> Dev Mode (keyword matching)</>
                                : <><Bot className="w-4 h-4 text-indigo-500" /><span className="font-semibold text-indigo-700">{PROVIDER_LABELS[llmConfig.provider]}</span> · real LLM analysis</>
                            }
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Mapping semantic content to the 8 maturity domains and identifying AI use cases…
                        </p>
                    </div>
                </div>
            )}

            {step === 'REVIEW' && rawResults && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
                    <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                        <div className="relative z-10 max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Analysis Complete</span>
                                <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Commit Findings below</span>
                            </div>
                            <h2 className="text-3xl font-black mb-4 leading-tight">Roadmap Update Preview</h2>
                            <p className="text-indigo-50 font-medium italic opacity-80 leading-relaxed border-l-4 border-white/20 pl-6">
                                "{rawResults.sentimentSummary}"
                            </p>
                        </div>
                        
                        <div className="relative z-10 shrink-0 text-center space-y-4">
                            <div className="flex gap-4 mb-2">
                                <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[100px]">
                                    <div className="text-2xl font-black">{activeScoresCount}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Scores</div>
                                </div>
                                <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[100px]">
                                    <div className="text-2xl font-black">{activeUCsCount}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Use Cases</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleApply}
                                disabled={activeScoresCount === 0 && activeUCsCount === 0}
                                className="w-full px-8 py-4 bg-emerald-400 text-emerald-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Commit Approved Items
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Domain Review Window */}
                        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            Strategic Readiness Updates 
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-full">Phase 1</span>
                                        </h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain-Level Maturity Mapping</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const allOff = Object.keys(approvedScores).reduce((acc, k) => ({...acc, [k]: false}), {})
                                            setApprovedScores(allOff)
                                        }}
                                        className="text-[10px] font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest"
                                    >
                                        Ignore All
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {Object.keys(rawResults.readinessScores).length > 0 ? (
                                    Object.entries(rawResults.readinessScores).map(([domain, score]) => (
                                        <div 
                                            key={domain} 
                                            onClick={() => toggleScore(domain)}
                                            className={`p-5 rounded-3xl border transition-all cursor-pointer group flex items-center justify-between ${
                                                approvedScores[domain] ? 'bg-indigo-50/50 border-indigo-100 shadow-sm' : 'bg-white border-slate-100 opacity-60 grayscale'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-xl transition-colors ${approvedScores[domain] ? 'bg-white text-indigo-600' : 'bg-slate-50 text-slate-300'}`}>
                                                    <Target className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{domain}</span>
                                                    <p className="text-[10px] font-bold text-slate-400">Proposed Score: {score.toFixed(1)} / 5.0</p>
                                                </div>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full p-1 transition-all ${approvedScores[domain] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${approvedScores[domain] ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center space-y-3">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Readiness Impacts Detected</p>
                                        <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">The content did not trigger any maturity baseline adjustments.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Use Case Review Window */}
                        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            Prioritized Initiatives
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full">Phase 2</span>
                                        </h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Roadmap Opportunities</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {rawResults.useCases.length > 0 ? (
                                    rawResults.useCases.map((uc, i) => (
                                        <div 
                                            key={i} 
                                            className={`p-6 rounded-[2rem] border transition-all group relative overflow-hidden ${
                                                approvedUseCases[i] ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-50 border-slate-100 grayscale opacity-50 shadow-inner'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="space-y-1">
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black tracking-[0.2em] uppercase rounded-full">UC-{(i+1).toString().padStart(2, '0')} · {uc.department}</span>
                                                    <h4 className="text-base font-black text-slate-900">{uc.title}</h4>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {approvedUseCases[i] ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleUseCase(i)}
                                                            className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                                                            title="Reject Proposal"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleUseCase(i)}
                                                            className="p-2 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-100 transition-colors"
                                                            title="Approve Proposal"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2 italic">"{uc.description}"</p>
                                            <div className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest pt-4 border-t border-slate-100">
                                                <TrendingUp className="w-3.5 h-3.5" /> Est. ROI: ${(uc.roiEstimate/1000).toFixed(0)}k
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center space-y-3">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Strategic Initiatives Identified</p>
                                        <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">The current strategic input did not reveal immediate implementation opportunities.</p>
                                    </div>
                                )}

                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                                    <Info className="w-5 h-5 text-slate-400 shrink-0" />
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                                        Approved use cases will be added to the Roadmap as **Drafts** in Phase 2 for further prioritization.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 'SAVING' && (
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-pulse">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Synchronizing Roadmap...</h2>
                    <p className="text-slate-500 font-medium">Approved intelligence is being mapped to the customer profile.</p>
                </div>
            )}
        </div>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
}
