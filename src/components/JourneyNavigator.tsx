'use client'

import { Zap, CheckCircle2, AlertTriangle } from 'lucide-react'
import { updateCustomerPhase } from '@/app/actions'
import { useState } from 'react'

interface PhaseStats {
    phaseNum: number
    totalTasks: number
    completedTasks: number
    totalDeliverables: number
    completedDeliverables: number
}

interface Phase {
    num: number
    title: string
    desc: string
}

export default function JourneyNavigator({
    customerId,
    currentPhase,
    selectedPhase,
    onPhaseSelect,
    phaseStats = [],
}: {
    customerId: string
    currentPhase: number
    selectedPhase: number
    onPhaseSelect: (num: number) => void
    phaseStats?: PhaseStats[]
}) {
    const [isUpdating, setIsUpdating] = useState(false)

    const phases: Phase[] = [
        { num: 1, title: 'Discovery & Readiness', desc: 'Assess 8 Core Domains' },
        { num: 2, title: 'Strategy Alignment', desc: 'Prioritize Use Cases' },
        { num: 3, title: 'PoV Execution', desc: 'Deploy Initial Pilots' },
        { num: 4, title: 'Change Management', desc: 'Rollout & Adopt' },
        { num: 5, title: 'Value Realization', desc: 'Measure ROI & KPIs' },
    ]

    const handleAdvance = async (num: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (num <= currentPhase || isUpdating) return
        setIsUpdating(true)
        try {
            await updateCustomerPhase(customerId, num)
            onPhaseSelect(num)
        } catch (error) {
            console.error(error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="space-y-4 flex-1">
            {phases.map((phase, idx) => {
                const isActive = currentPhase === phase.num
                const isPast = currentPhase > phase.num
                const isNext = currentPhase + 1 === phase.num
                const isSelected = selectedPhase === phase.num
                const stats = phaseStats.find(s => s.phaseNum === phase.num)

                // A past phase is "incomplete" if tasks or deliverables aren't all done
                const isIncomplete = isPast && stats != null && (
                    stats.completedTasks < stats.totalTasks ||
                    stats.completedDeliverables < stats.totalDeliverables
                )
                const isFullyComplete = isPast && !isIncomplete

                return (
                    <div
                        key={phase.num}
                        onClick={() => onPhaseSelect(phase.num)}
                        className={`relative flex gap-4 transition-all duration-300 p-3 -m-1 rounded-xl cursor-pointer group/phase
                            ${isSelected ? 'bg-blue-50/80 outline outline-1 outline-blue-200 shadow-sm' : 'hover:bg-slate-50'}
                        `}
                    >
                        {/* Vertical connector line */}
                        {idx !== 4 && (
                            <div className={`absolute left-7 top-14 bottom-[-16px] w-0.5 transition-colors duration-500 ${isPast ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        )}

                        {/* Phase circle */}
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 transition-all duration-300
                                ${isSelected
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-md ring-4 ring-blue-50 scale-105'
                                    : isActive
                                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md ring-4 ring-blue-50'
                                        : isFullyComplete
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : isIncomplete
                                                ? 'border-amber-400 bg-amber-50 text-amber-600'
                                                : isNext
                                                    ? 'border-slate-300 bg-white text-slate-400 group-hover/phase:border-blue-400 group-hover/phase:text-blue-500'
                                                    : 'border-slate-200 bg-slate-50 text-slate-400'
                                }`}
                        >
                            {isFullyComplete
                                ? <CheckCircle2 className="w-4 h-4" />
                                : isIncomplete
                                    ? <AlertTriangle className="w-3.5 h-3.5" />
                                    : phase.num}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-sm font-bold transition-colors truncate ${isSelected ? 'text-blue-900' : isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {phase.title}
                                </h4>
                                {isNext && !isUpdating && (
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter bg-blue-100/50 px-1.5 py-0.5 rounded border border-blue-200 animate-pulse shrink-0">
                                        Action Required
                                    </span>
                                )}
                                {isIncomplete && !isSelected && (
                                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-tighter bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                                        Incomplete
                                    </span>
                                )}
                            </div>

                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{phase.desc}</p>

                            {/* Completion progress — shown for past and active phases */}
                            {(isPast || isActive) && stats && stats.totalTasks > 0 && (
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className={`text-[10px] font-bold ${stats.completedTasks === stats.totalTasks ? 'text-blue-600' : 'text-amber-600'}`}>
                                        {stats.completedTasks}/{stats.totalTasks} tasks
                                    </span>
                                    <span className="text-slate-200">·</span>
                                    <span className={`text-[10px] font-bold ${stats.completedDeliverables === stats.totalDeliverables ? 'text-blue-600' : 'text-amber-600'}`}>
                                        {stats.completedDeliverables}/{stats.totalDeliverables} deliverables
                                    </span>
                                </div>
                            )}

                            {isNext && (
                                <button
                                    onClick={(e) => handleAdvance(phase.num, e)}
                                    disabled={isUpdating}
                                    className="mt-2 text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1 group/btn transition-all"
                                >
                                    {isUpdating ? 'Updating...' : 'Start Phase'}
                                    {!isUpdating && <Zap className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />}
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
