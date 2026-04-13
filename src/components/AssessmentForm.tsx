'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { calculateWeightedScore } from '@/lib/assessment-data'
import { saveAssessment } from '@/app/actions'
import {
    Check, ChevronRight, ChevronLeft, Send,
    RotateCcw, Save, BookOpen, StickyNote, Info,
} from 'lucide-react'

interface Question {
    id: string
    text: string
    weight: string
    scoringGuide: string
}

interface Domain {
    id: string
    name: string
    description: string | null
    weight: number
    questions: Question[]
}

const DOMAIN_ICONS: Record<string, string> = {
    Strategy: '🎯',
    Data: '🗄️',
    Tech: '⚙️',
    Security: '🔒',
    Skills: '🧠',
    Ops: '🔄',
    Governance: '📋',
    Financial: '💰',
}

// Maps DB domain names → saveAssessment score keys
const NAME_TO_SCORE_KEY: Record<string, string> = {
    'AI Strategy & Vision': 'Strategy',
    'Data Readiness': 'Data',
    'Technical Infrastructure': 'Tech',
    'Cybersecurity & Risk': 'Security',
    'Talent & Skills': 'Skills',
    'Operational Processes': 'Ops',
    'Compliance & Governance': 'Governance',
    'Financial Commitment': 'Financial',
}

export default function AssessmentForm({
    customerId,
    assessmentSchema: initialSchema,
}: {
    customerId: string
    assessmentSchema: Domain[]
}) {
    const router = useRouter()
    const DRAFT_KEY = `assessment_draft_${customerId}`

    const [currentDomainIdx, setCurrentDomainIdx] = useState(0)
    const [scores, setScores] = useState<Record<string, number>>({})
    const [notes, setNotes] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [pendingDraft, setPendingDraft] = useState<{
        scores: Record<string, number>
        notes: Record<string, string>
        currentDomainIdx: number
        savedAt: string
    } | null>(null)

    const assessmentData = initialSchema

    // ── On mount: check for saved draft ───────────────────────────────────────
    useEffect(() => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY)
            if (raw) {
                const draft = JSON.parse(raw)
                if (draft.savedAt && draft.scores) {
                    setPendingDraft(draft)
                }
            }
        } catch { /* ignore */ }
        setMounted(true)
    }, [DRAFT_KEY])

    // ── Auto-save draft on every change ───────────────────────────────────────
    useEffect(() => {
        if (!mounted) return
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({
                scores, notes, currentDomainIdx,
                savedAt: new Date().toISOString(),
            }))
        } catch { /* ignore */ }
    }, [scores, notes, currentDomainIdx, mounted, DRAFT_KEY])

    const handleResumeDraft = () => {
        if (!pendingDraft) return
        setScores(pendingDraft.scores ?? {})
        setNotes(pendingDraft.notes ?? {})
        setCurrentDomainIdx(pendingDraft.currentDomainIdx ?? 0)
        setPendingDraft(null)
    }

    const handleDiscardDraft = () => {
        localStorage.removeItem(DRAFT_KEY)
        setPendingDraft(null)
    }

    // ── Scoring helpers ────────────────────────────────────────────────────────
    const handleScoreChange = (questionId: string, score: number) => {
        setScores(prev => ({ ...prev, [questionId]: score }))
    }

    const handleNotesChange = (domainId: string, value: string) => {
        setNotes(prev => ({ ...prev, [domainId]: value }))
    }

    const isDomainComplete = (domainIdx: number) =>
        assessmentData[domainIdx].questions.every(q => scores[q.id] !== undefined)

    const completedCount = assessmentData.filter((_, i) => isDomainComplete(i)).length
    const totalDomains = assessmentData.length
    const progressPct = Math.round((completedCount / totalDomains) * 100)

    const currentDomain = assessmentData[currentDomainIdx]
    const canGoNext = isDomainComplete(currentDomainIdx)
    const isLastDomain = currentDomainIdx === totalDomains - 1
    const allCompleted = completedCount === totalDomains

    const nextDomain = () => {
        if (currentDomainIdx < totalDomains - 1) setCurrentDomainIdx(i => i + 1)
    }
    const prevDomain = () => {
        if (currentDomainIdx > 0) setCurrentDomainIdx(i => i - 1)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const domainAverages: Record<string, number> = {}
            assessmentData.forEach(domain => {
                const scoreKey = NAME_TO_SCORE_KEY[domain.name] ?? domain.id
                domainAverages[scoreKey] = parseFloat(
                    calculateWeightedScore(domain as any, scores).toFixed(2)
                )
            })
            const assessment = await saveAssessment(customerId, domainAverages)
            localStorage.removeItem(DRAFT_KEY)
            router.push(`/customers/${customerId}/assessment/results?assessmentId=${assessment.id}`)
        } catch (error) {
            console.error('Failed to save assessment:', error)
            alert('Error saving assessment. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const domainIcon = DOMAIN_ICONS[currentDomain.id] ?? '📊'

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Draft resume banner ──────────────────────────────────────── */}
            {pendingDraft && (
                <div className="flex items-center gap-4 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                    <Save className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="flex-1 text-amber-800 font-semibold">
                        You have an unfinished draft saved{' '}
                        <span className="font-normal text-amber-700">
                            ({new Date(pendingDraft.savedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})
                        </span>
                    </span>
                    <button
                        type="button"
                        onClick={handleResumeDraft}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                        Resume Draft
                    </button>
                    <button
                        type="button"
                        onClick={handleDiscardDraft}
                        className="px-3 py-1.5 border border-amber-300 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                        <RotateCcw className="h-3 w-3" /> Start Fresh
                    </button>
                </div>
            )}

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="border-b border-slate-200 pb-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Maturity Assessment</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Evaluating readiness across {totalDomains} domains
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-2xl font-black text-slate-900 leading-none">{progressPct}%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
                            {completedCount}/{totalDomains} domains done
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <progress
                    value={completedCount}
                    max={totalDomains}
                    className="w-full h-2 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-indigo-500 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-moz-progress-bar]:bg-indigo-500 [&::-moz-progress-bar]:rounded-full"
                />
                {allCompleted && (
                    <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                        <Check className="h-3 w-3" /> All domains complete — ready to submit
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* ── Left sidebar: domain nav ─────────────────────────────── */}
                <div className="lg:col-span-1 space-y-1.5">
                    {assessmentData.map((domain, idx) => {
                        const active = idx === currentDomainIdx
                        const complete = isDomainComplete(idx)
                        return (
                            <button
                                key={domain.id}
                                type="button"
                                onClick={() => setCurrentDomainIdx(idx)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border flex items-center gap-2.5
                                    ${active
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                                        : complete
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="text-base leading-none">{DOMAIN_ICONS[domain.id] ?? '📊'}</span>
                                <span className="text-xs font-semibold flex-1 truncate">{domain.name}</span>
                                {complete
                                    ? <Check className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-emerald-500'}`} />
                                    : <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-white' : 'bg-slate-300'}`} />
                                }
                            </button>
                        )
                    })}

                    {/* Auto-save indicator */}
                    {mounted && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 px-1 pt-1">
                            <Save className="h-2.5 w-2.5" /> Auto-saved locally
                        </p>
                    )}
                </div>

                {/* ── Main content ─────────────────────────────────────────── */}
                <div className="lg:col-span-3 space-y-5">

                    {/* Domain introduction card (5.3) */}
                    <div className="bg-gradient-to-r from-indigo-50 to-slate-50 rounded-2xl border border-indigo-100 px-6 py-5">
                        <div className="flex items-start gap-4">
                            <span className="text-3xl leading-none mt-0.5">{domainIcon}</span>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                        Domain {currentDomainIdx + 1} of {totalDomains}
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">{currentDomain.name}</h2>
                                {currentDomain.description && (
                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed flex items-start gap-1.5">
                                        <Info className="h-3.5 w-3.5 text-indigo-400 mt-0.5 shrink-0" />
                                        {currentDomain.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Questions card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <div className="space-y-10">
                            {currentDomain.questions.map((q, qIdx) => {
                                const scoringGuide = JSON.parse(q.scoringGuide || '{}')
                                return (
                                    <div key={q.id} className="space-y-4">
                                        {/* Question header */}
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs font-black text-slate-400 mt-0.5 w-5 shrink-0">
                                                Q{qIdx + 1}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <label className="text-sm font-bold text-slate-800 leading-snug">
                                                        {q.text}
                                                    </label>
                                                    <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                                        q.weight === 'Critical' ? 'bg-rose-50 border-rose-100 text-rose-600'
                                                        : q.weight === 'High' ? 'bg-orange-50 border-orange-100 text-orange-600'
                                                        : 'bg-slate-50 border-slate-200 text-slate-500'
                                                    }`}>
                                                        {q.weight}
                                                    </span>
                                                </div>
                                                {/* Scale hint (5.2) */}
                                                <p className="text-[10px] text-slate-400 mb-3">
                                                    Select the option that best describes your organisation · Scale: 1 (lowest) → 5 (highest)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Score options */}
                                        <div className="grid grid-cols-1 gap-2.5 ml-7">
                                            {[1, 2, 4, 5].map(score => {
                                                const isSelected = scores[q.id] === score
                                                const guideText = scoringGuide[score]
                                                if (!guideText) return null
                                                return (
                                                    <button
                                                        key={score}
                                                        type="button"
                                                        onClick={() => handleScoreChange(q.id, score)}
                                                        className={`group flex items-start text-left gap-3.5 p-4 rounded-xl transition-all border
                                                            ${isSelected
                                                                ? 'bg-indigo-50 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                                                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                                            ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}
                                                        `}>
                                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className={`text-xs font-black mr-2 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>
                                                                {score}
                                                            </span>
                                                            <span className={`text-sm leading-relaxed transition-colors ${
                                                                isSelected ? 'text-indigo-900 font-medium' : 'text-slate-600 group-hover:text-slate-800'
                                                            }`}>
                                                                {guideText}
                                                            </span>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* ── Assessor notes (5.4) ──────────────────────────── */}
                        <div className="mt-10 pt-8 border-t border-slate-100">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                                <StickyNote className="h-3.5 w-3.5" />
                                Assessor Notes — {currentDomain.name}
                                <span className="font-normal text-slate-400">(optional · saved locally)</span>
                            </label>
                            <textarea
                                value={notes[currentDomain.id] ?? ''}
                                onChange={e => handleNotesChange(currentDomain.id, e.target.value)}
                                placeholder="Add context, caveats, or observations about this domain…"
                                rows={3}
                                className="w-full text-sm text-slate-700 placeholder:text-slate-300 border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-shadow"
                            />
                        </div>

                        {/* ── Pagination footer ─────────────────────────────── */}
                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={prevDomain}
                                disabled={currentDomainIdx === 0}
                                className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                            </button>

                            {isLastDomain ? (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!allCompleted || isSubmitting}
                                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    {isSubmitting ? 'Saving…' : (
                                        <>Submit Final Assessment <Send className="w-4 h-4" /></>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={nextDomain}
                                    disabled={!canGoNext}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    Next Domain <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
