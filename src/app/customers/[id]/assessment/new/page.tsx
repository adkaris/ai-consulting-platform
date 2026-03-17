'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { assessmentData, calculateWeightedScore } from '@/lib/assessment-data'
import { saveAssessment } from '@/app/actions'
import { Check, ChevronRight, ChevronLeft, Building2, Save, Send } from 'lucide-react'

export default function NewAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: customerId } = use(params)
    const router = useRouter()

    const [currentDomainIdx, setCurrentDomainIdx] = useState(0)
    const [scores, setScores] = useState<Record<string, number>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const currentDomain = assessmentData[currentDomainIdx]
    const progress = ((currentDomainIdx + 1) / assessmentData.length) * 100

    const handleScoreChange = (questionId: string, score: number) => {
        setScores(prev => ({ ...prev, [questionId]: score }))
    }

    const nextDomain = () => {
        if (currentDomainIdx < assessmentData.length - 1) {
            setCurrentDomainIdx(prev => prev + 1)
        }
    }

    const prevDomain = () => {
        if (currentDomainIdx > 0) {
            setCurrentDomainIdx(prev => prev - 1)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            // Calculate weighted average for each domain
            const domainAverages: Record<string, number> = {}
            assessmentData.forEach(domain => {
                const weightedAvg = calculateWeightedScore(domain, scores)
                domainAverages[domain.id] = parseFloat(weightedAvg.toFixed(2))
            })

            const assessment = await saveAssessment(customerId, domainAverages)
            router.push(`/customers/${customerId}/assessment/results?assessmentId=${assessment.id}`)
        } catch (error) {
            console.error('Failed to save assessment:', error)
            alert('Error saving assessment. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const isDomainComplete = (domainIdx: number) => {
        return assessmentData[domainIdx].questions.every(q => scores[q.id] !== undefined)
    }

    const canGoNext = isDomainComplete(currentDomainIdx)
    const isLastDomain = currentDomainIdx === assessmentData.length - 1
    const allCompleted = assessmentData.every((_, idx) => isDomainComplete(idx))

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Maturity Assessment</h1>
                        <p className="text-sm text-slate-500">Discovery Phase: Evaluating readiness across 8 domains</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">Overall Progress</div>
                    <div className="text-xs text-slate-500 mt-1">{Math.round(progress)}% Complete</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {assessmentData.map((domain, idx) => {
                        const active = idx === currentDomainIdx
                        const complete = isDomainComplete(idx)
                        return (
                            <button
                                key={domain.id}
                                onClick={() => setCurrentDomainIdx(idx)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all border flex items-center justify-between group
                                    ${active ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' :
                                        complete ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}
                                `}
                            >
                                <span className="text-sm font-medium">{domain.name}</span>
                                {complete ? (
                                    <Check className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-500'}`} />
                                ) : (
                                    <div className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-slate-200 group-hover:bg-indigo-300'}`} />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[500px] flex flex-col">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{currentDomain.name}</h2>
                            <p className="text-slate-500 text-sm">{currentDomain.description}</p>
                        </div>

                        <div className="space-y-10 flex-1">
                            {currentDomain.questions.map((q) => (
                                <div key={q.id} className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-md font-bold text-slate-800 leading-tight flex-1">{q.text}</label>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${q.weight === 'Critical' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                            q.weight === 'High' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                                'bg-slate-50 border-slate-200 text-slate-500'
                                            }`}>
                                            {q.weight}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-5 gap-3 max-w-2xl">
                                        {[1, 2, 3, 4, 5].map((score) => {
                                            const isSelected = scores[q.id] === score
                                            const guideText = q.scoringGuide?.[score]
                                            return (
                                                <button
                                                    key={score}
                                                    onClick={() => handleScoreChange(q.id, score)}
                                                    className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all border
                                                        ${isSelected
                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg ring-4 ring-indigo-50 transform scale-105 z-10'
                                                            : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:bg-slate-50'}
                                                    `}
                                                >
                                                    <span className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-indigo-600'}`}>{score}</span>
                                                    {guideText && (
                                                        <span className={`text-[11px] leading-snug font-semibold text-center mt-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                            {guideText}
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Footer */}
                        <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                            <button
                                onClick={prevDomain}
                                disabled={currentDomainIdx === 0}
                                className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                            </button>

                            {isLastDomain ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!allCompleted || isSubmitting}
                                    className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    {isSubmitting ? 'Saving...' : (
                                        <>Submit Final Assessment <Send className="ml-2 w-4 h-4" /></>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={nextDomain}
                                    disabled={!canGoNext}
                                    className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    Next Domain <ChevronRight className="ml-2 w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
