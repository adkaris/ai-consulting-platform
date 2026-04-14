'use client'

import { useState } from 'react'
import { Plus, X, Briefcase, TrendingUp, Clock, Euro, Trash2, Bot, MonitorSmartphone } from 'lucide-react'
import { addUseCase } from '@/app/actions'

function RatingSlider({ name, label, hint, defaultValue = 3, lowLabel, highLabel }: {
    name: string; label: string; hint: string; defaultValue?: number; lowLabel: string; highLabel: string
}) {
    const [val, setVal] = useState(defaultValue)
    return (
        <div className="space-y-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400">{hint}</p>
                </div>
                <span className="text-2xl font-black text-indigo-600 leading-none">{val}<span className="text-xs font-normal text-slate-400">/10</span></span>
            </div>
            <input
                type="range" name={name} min="1" max="10" step="1"
                aria-label={label}
                value={val} onChange={e => setVal(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                <span>1·{lowLabel}</span>
                {[2,3,4,5,6,7,8,9].map(n => <span key={n}>{n}</span>)}
                <span>10·{highLabel}</span>
            </div>
        </div>
    )
}

type ROIType = 'MONEY' | 'PERFORMANCE' | 'TIME'

interface ROIEntry {
    id: number
    type: ROIType
    value: string
    unit: string
    description: string
}

const TIME_UNITS = ['hrs/week', 'hrs/month', 'days/year', 'mins/day']

const ROI_TYPE_CONFIG: Record<ROIType, { label: string; icon: React.ReactNode; defaultUnit: string; color: string }> = {
    MONEY:       { label: 'Financial',   icon: <Euro className="w-3.5 h-3.5" />,       defaultUnit: '€',        color: 'emerald' },
    PERFORMANCE: { label: 'Performance', icon: <TrendingUp className="w-3.5 h-3.5" />, defaultUnit: '%',        color: 'blue'    },
    TIME:        { label: 'Time Saved',  icon: <Clock className="w-3.5 h-3.5" />,       defaultUnit: 'hrs/week', color: 'violet'  },
}

let _id = 0
const nextId = () => ++_id

export default function UseCaseModal({
    customerId,
    customerTrack = 'GENERAL_AI',
}: {
    customerId: string
    customerTrack?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rois, setRois] = useState<ROIEntry[]>([])
    // For MIXED customers, default to GENERAL_AI; for pure COPILOT, lock to COPILOT
    const [useCaseType, setUseCaseType] = useState<'GENERAL_AI' | 'COPILOT'>(
        customerTrack === 'COPILOT' ? 'COPILOT' : 'GENERAL_AI'
    )

    const addROI = () => setRois(prev => [
        ...prev,
        { id: nextId(), type: 'MONEY', value: '', unit: '€', description: '' }
    ])

    const removeROI = (id: number) => setRois(prev => prev.filter(r => r.id !== id))

    const updateROI = (id: number, patch: Partial<ROIEntry>) =>
        setRois(prev => prev.map(r => {
            if (r.id !== id) return r
            const updated = { ...r, ...patch }
            // Auto-set unit when type changes
            if (patch.type) updated.unit = ROI_TYPE_CONFIG[patch.type].defaultUnit
            return updated
        }))

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const validRois = rois
            .filter(r => r.value !== '' && !isNaN(Number(r.value)))
            .map(({ type, value, unit, description }) => ({ type, value: Number(value), unit, description }))
        formData.set('rois', JSON.stringify(validRois))
        formData.set('useCaseType', useCaseType)
        try {
            await addUseCase(customerId, formData)
            setIsOpen(false)
            setRois([])
            setUseCaseType(customerTrack === 'COPILOT' ? 'COPILOT' : 'GENERAL_AI')
        } catch (error) {
            console.error(error)
            alert('Failed to add use case')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                title="Add Use Case"
                aria-label="Add Use Case"
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
                <Plus className="w-5 h-5 text-slate-700" aria-hidden="true" />
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">New AI Use Case</h2>
                        <p className="text-xs text-slate-500 mt-1">Catalog a new opportunity for evaluation.</p>
                    </div>
                    <button type="button" onClick={() => { setIsOpen(false); setRois([]) }} title="Close" aria-label="Close"
                        className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
                    <div className="p-8 space-y-5">

                        {/* Use Case Type — only show for MIXED customers */}
                        {customerTrack === 'MIXED' && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Use Case Type</label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setUseCaseType('GENERAL_AI')}
                                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                                            useCaseType === 'GENERAL_AI'
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                                                : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                                        }`}
                                    >
                                        <Bot className="w-4 h-4 text-blue-600 shrink-0" />
                                        <div className="text-left">
                                            <p className="text-xs font-black text-slate-800">General AI</p>
                                            <p className="text-[10px] text-slate-500">Custom AI / LLM</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUseCaseType('COPILOT')}
                                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                                            useCaseType === 'COPILOT'
                                                ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500/20'
                                                : 'border-slate-200 hover:border-violet-300 hover:bg-violet-50/50'
                                        }`}
                                    >
                                        <MonitorSmartphone className="w-4 h-4 text-violet-600 shrink-0" />
                                        <div className="text-left">
                                            <p className="text-xs font-black text-slate-800">Microsoft Copilot</p>
                                            <p className="text-[10px] text-slate-500">M365 / Copilot Studio</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Title</label>
                            <input
                                required
                                name="title"
                                placeholder="e.g. Demand Forecasting AI"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                            <textarea
                                name="description"
                                rows={2}
                                placeholder="Briefly describe the business problem and AI solution..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Department + Priority */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Department</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        name="department"
                                        placeholder="Sales, Ops..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Priority</label>
                                <select
                                    name="priority"
                                    title="Priority Level"
                                    aria-label="Priority Level"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white appearance-none cursor-pointer"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                        </div>

                        {/* Complexity + Value */}
                        <div className="grid grid-cols-2 gap-4">
                            <RatingSlider name="complexity" label="Complexity" hint="Implementation effort" lowLabel="Simple" highLabel="Complex" />
                            <RatingSlider name="value" label="Business Value" hint="Expected impact" lowLabel="Low" highLabel="High" />
                        </div>

                        {/* ROI Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Expected ROI</label>
                                <button
                                    type="button"
                                    onClick={addROI}
                                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all border border-indigo-100"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add ROI
                                </button>
                            </div>

                            {rois.length === 0 && (
                                <p className="text-xs text-slate-400 ml-1">
                                    No ROI added yet. Click <span className="font-semibold">Add ROI</span> to define expected returns.
                                </p>
                            )}

                            <div className="space-y-3">
                                {rois.map((roi) => (
                                    <ROIRow
                                        key={roi.id}
                                        roi={roi}
                                        onChange={(patch) => updateROI(roi.id, patch)}
                                        onRemove={() => removeROI(roi.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t border-slate-100 flex gap-3 shrink-0 bg-slate-50/30">
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); setRois([]) }}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                        >

                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Saving...' : <><Plus className="w-4 h-4" /> Add to Backlog</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function ROIRow({ roi, onChange, onRemove }: {
    roi: ROIEntry
    onChange: (patch: Partial<ROIEntry>) => void
    onRemove: () => void
}) {
    const cfg = ROI_TYPE_CONFIG[roi.type]
    return (
        <div className="flex items-start gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            {/* Type */}
            <select
                value={roi.type}
                onChange={e => onChange({ type: e.target.value as ROIType })}
                aria-label="ROI type"
                className="px-2 py-2 rounded-lg border border-slate-200 text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shrink-0"
            >
                {(Object.keys(ROI_TYPE_CONFIG) as ROIType[]).map(t => (
                    <option key={t} value={t}>{ROI_TYPE_CONFIG[t].label}</option>
                ))}
            </select>

            {/* Value */}
            <input
                type="number"
                min="0"
                step="any"
                value={roi.value}
                onChange={e => onChange({ value: e.target.value })}
                placeholder="0"
                aria-label="ROI value"
                className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shrink-0"
            />

            {/* Unit */}
            {roi.type === 'TIME' ? (
                <select
                    value={roi.unit}
                    onChange={e => onChange({ unit: e.target.value })}
                    aria-label="Time unit"
                    className="px-2 py-2 rounded-lg border border-slate-200 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shrink-0"
                >
                    {TIME_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            ) : (
                <span className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-500 shrink-0">
                    {roi.unit}
                </span>
            )}

            {/* Optional description */}
            <input
                type="text"
                value={roi.description}
                onChange={e => onChange({ description: e.target.value })}
                placeholder="Note (optional)"
                aria-label="ROI description"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-0"
            />

            {/* Remove */}
            <button type="button" onClick={onRemove} aria-label="Remove ROI"
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}
