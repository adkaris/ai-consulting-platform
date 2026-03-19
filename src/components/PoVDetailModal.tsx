'use client'

import { useState } from 'react'
import { X, Save, Target, Clock, FileText } from 'lucide-react'
import { updateUseCasePovDetails } from '@/app/actions'

interface UseCase {
    id: string
    customerId: string
    title: string
    povTimeframe?: string | null
    povSuccessCriteria?: string | null
    povNotes?: string | null
}

export default function PoVDetailModal({
    useCase,
    trigger,
}: {
    useCase: UseCase
    trigger: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        try {
            await updateUseCasePovDetails(useCase.id, useCase.customerId, formData)
            setIsOpen(false)
        } catch (err) {
            console.error(err)
            alert('Failed to save PoV details')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <span onClick={() => setIsOpen(true)} className="cursor-pointer">{trigger}</span>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-orange-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">PoV Details</h2>
                                <p className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{useCase.title}</p>
                            </div>
                            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close"
                                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            {/* Timeframe */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Clock className="w-4 h-4 text-orange-500" /> Timeframe to Complete
                                </label>
                                <input
                                    name="povTimeframe"
                                    defaultValue={useCase.povTimeframe ?? ''}
                                    placeholder="e.g. 8 weeks, Q3 2025, 3 months..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                                />
                            </div>

                            {/* Success Criteria */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Target className="w-4 h-4 text-orange-500" /> Success Criteria <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    name="povSuccessCriteria"
                                    rows={4}
                                    defaultValue={useCase.povSuccessCriteria ?? ''}
                                    placeholder="Define measurable success criteria, e.g.:&#10;• 15% reduction in forecast error&#10;• Processing time < 2 seconds&#10;• 90% user adoption in target team"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm resize-none"
                                />
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <FileText className="w-4 h-4 text-slate-400" /> Notes
                                </label>
                                <textarea
                                    name="povNotes"
                                    rows={2}
                                    defaultValue={useCase.povNotes ?? ''}
                                    placeholder="Additional context, blockers, dependencies..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsOpen(false)}
                                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                                    {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Details</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
