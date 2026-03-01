'use client'

import { useState, useTransition } from 'react'
import { CheckSquare2, Square, ChevronDown, ChevronUp } from 'lucide-react'
import { togglePhaseTask } from '@/app/actions'
import type { SubTask } from '@/lib/methodology'

interface PhaseTask {
    id: string
    taskKey: string
    completed: boolean
    completedAt: Date | null
}

interface PhaseSubtaskListProps {
    customerId: string
    phaseNumber: number
    subtasks: SubTask[]
    tasks: PhaseTask[]
}

export default function PhaseSubtaskList({
    customerId,
    phaseNumber,
    subtasks,
    tasks,
}: PhaseSubtaskListProps) {
    const [, startTransition] = useTransition()
    const [expanded, setExpanded] = useState<string | null>(null)

    const taskMap = new Map(tasks.map(t => [t.taskKey, t]))

    const completedCount = subtasks.filter(s => taskMap.get(s.key)?.completed).length

    const toggle = (taskKey: string, current: boolean) => {
        startTransition(async () => {
            await togglePhaseTask(customerId, phaseNumber, taskKey, !current)
        })
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-800">Phase Subtasks</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{completedCount} of {subtasks.length} completed</p>
                </div>
                {/* Progress pip bar */}
                <div className="flex gap-1">
                    {subtasks.map(s => {
                        const done = taskMap.get(s.key)?.completed ?? false
                        return (
                            <div
                                key={s.key}
                                className={`h-2 w-8 rounded-full transition-colors ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Task list */}
            <div className="divide-y divide-slate-100">
                {subtasks.map(subtask => {
                    const task = taskMap.get(subtask.key)
                    const isCompleted = task?.completed ?? false
                    const isExpanded = expanded === subtask.key

                    return (
                        <div key={subtask.key} className={`transition-colors ${isCompleted ? 'bg-emerald-50/40' : 'bg-white hover:bg-slate-50/60'}`}>
                            <div className="flex items-start gap-3 px-6 py-4">
                                {/* Checkbox */}
                                <button
                                    type="button"
                                    onClick={() => toggle(subtask.key, isCompleted)}
                                    className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                                    aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                >
                                    {isCompleted
                                        ? <CheckSquare2 className="h-5 w-5 text-emerald-500" />
                                        : <Square className="h-5 w-5" />
                                    }
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`text-sm font-medium leading-snug ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                            {subtask.title}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setExpanded(isExpanded ? null : subtask.key)}
                                            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {isExpanded
                                                ? <ChevronUp className="h-4 w-4" />
                                                : <ChevronDown className="h-4 w-4" />
                                            }
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                            {subtask.description}
                                        </p>
                                    )}

                                    {isCompleted && task?.completedAt && (
                                        <p className="text-xs text-emerald-600 mt-1">
                                            Completed {new Date(task.completedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
