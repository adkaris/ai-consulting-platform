'use client'

import { useState } from 'react'
import { X, Save, Plus } from 'lucide-react'
import { upsertChangeManagementItem } from '@/app/actions'

const CATEGORIES = [
    { value: 'STAKEHOLDER', label: 'Stakeholder Alignment' },
    { value: 'LITERACY',    label: 'AI Literacy Program'  },
    { value: 'RESKILLING',  label: 'Talent Reskilling'    },
    { value: 'GOVERNANCE',  label: 'Ethical Guardrails'   },
    { value: 'CUSTOM',      label: 'Custom Initiative'    },
]

const STATUSES = [
    { value: 'NOT_STARTED', label: 'Not Started', color: 'text-slate-500 bg-slate-50 border-slate-200'  },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'text-amber-600 bg-amber-50 border-amber-100'   },
    { value: 'COMPLETED',   label: 'Completed',   color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { value: 'AT_RISK',     label: 'At Risk',     color: 'text-rose-600 bg-rose-50 border-rose-100'       },
]

interface ChangeItem {
    id?: string
    category: string
    title: string
    description?: string | null
    status: string
    owner?: string | null
    dueDate?: string | null
    notes?: string | null
}

export default function ChangeItemModal({
    customerId,
    item,
    trigger,
}: {
    customerId: string
    item?: ChangeItem
    trigger: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEdit = !!item?.id

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        if (item?.id) formData.set('id', item.id)
        try {
            await upsertChangeManagementItem(customerId, formData)
            setIsOpen(false)
        } catch (err) {
            console.error(err)
            alert('Failed to save initiative')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <span onClick={() => setIsOpen(true)} className="cursor-pointer">{trigger}</span>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Initiative' : 'New Initiative'}</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Change management workstream</p>
                            </div>
                            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close"
                                className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto">
                            {/* Category + Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Category</label>
                                    <select name="category" defaultValue={item?.category ?? 'CUSTOM'} aria-label="Category"
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm bg-white cursor-pointer">
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Status</label>
                                    <select name="status" defaultValue={item?.status ?? 'NOT_STARTED'} aria-label="Status"
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm bg-white cursor-pointer">
                                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Title</label>
                                <input required name="title" defaultValue={item?.title ?? ''}
                                    placeholder="e.g. Executive AI Steering Committee"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea name="description" rows={2} defaultValue={item?.description ?? ''}
                                    placeholder="What does this initiative involve?"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm resize-none" />
                            </div>

                            {/* Owner + Due Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Owner</label>
                                    <input name="owner" defaultValue={item?.owner ?? ''}
                                        placeholder="Name or team"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Due / Target</label>
                                    <input name="dueDate" defaultValue={item?.dueDate ?? ''}
                                        placeholder="e.g. Q3 2025"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm" />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Notes</label>
                                <textarea name="notes" rows={2} defaultValue={item?.notes ?? ''}
                                    placeholder="Progress notes, blockers, context..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm resize-none" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsOpen(false)}
                                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                                    {isSubmitting ? 'Saving...' : isEdit
                                        ? <><Save className="w-4 h-4" /> Save Changes</>
                                        : <><Plus className="w-4 h-4" /> Add Initiative</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export { STATUSES, CATEGORIES }
