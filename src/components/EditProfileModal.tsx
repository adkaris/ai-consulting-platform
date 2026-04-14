'use client'

import { useState } from 'react'
import { X, Building2, Save, Bot, MonitorSmartphone, Layers } from 'lucide-react'
import { updateCustomer } from '@/app/actions'

interface Customer {
    id: string
    name: string
    industry: string | null
    employees: string | null
    ambitionLevel: number | null
    aiTrack?: string | null
}

const TRACK_OPTIONS = [
    {
        value: 'GENERAL_AI',
        label: 'General AI',
        desc: 'Full 8-domain AI readiness',
        icon: <Bot className="w-4 h-4" />,
        colors: 'border-blue-200 bg-blue-50 text-blue-700',
        activeRing: 'ring-2 ring-blue-500',
    },
    {
        value: 'COPILOT',
        label: 'Microsoft Copilot',
        desc: 'Copilot-focused readiness',
        icon: <MonitorSmartphone className="w-4 h-4" />,
        colors: 'border-violet-200 bg-violet-50 text-violet-700',
        activeRing: 'ring-2 ring-violet-500',
    },
    {
        value: 'MIXED',
        label: 'Mixed',
        desc: 'Both AI + Copilot tracks',
        icon: <Layers className="w-4 h-4" />,
        colors: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        activeRing: 'ring-2 ring-emerald-500',
    },
]

export default function EditProfileModal({ customer }: { customer: Customer }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedTrack, setSelectedTrack] = useState(customer.aiTrack ?? 'GENERAL_AI')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        formData.set('aiTrack', selectedTrack)
        try {
            await updateCustomer(customer.id, formData)
            setIsOpen(false)
        } catch (error) {
            console.error(error)
            alert('Failed to update profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-200 shadow-sm"
            >
                Edit Profile
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Edit Customer Profile</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Update organisation details.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close"
                        className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Company Name <span className="text-rose-500">*</span></label>
                        <input
                            required
                            name="name"
                            defaultValue={customer.name}
                            placeholder="e.g. Acme Corporation"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Industry</label>
                        <input
                            name="industry"
                            defaultValue={customer.industry ?? ''}
                            placeholder="e.g. Financial Services, Healthcare..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="edit-employees" className="text-sm font-semibold text-slate-700 ml-1">Employees</label>
                            <select
                                id="edit-employees"
                                name="employees"
                                defaultValue={customer.employees ?? ''}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white text-sm cursor-pointer"
                            >
                                <option value="">Select range</option>
                                <option value="1-50">1 – 50</option>
                                <option value="50-200">50 – 200</option>
                                <option value="200-1000">200 – 1,000</option>
                                <option value="1000-5000">1,000 – 5,000</option>
                                <option value="5000+">5,000+</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="edit-ambition" className="text-sm font-semibold text-slate-700 ml-1">AI Ambition Level</label>
                            <select
                                id="edit-ambition"
                                name="ambitionLevel"
                                defaultValue={customer.ambitionLevel ?? ''}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white text-sm cursor-pointer"
                            >
                                <option value="">Select level</option>
                                <option value="1">1 – Exploratory</option>
                                <option value="2">2 – Committed</option>
                                <option value="3">3 – Scaling</option>
                                <option value="4">4 – Advanced</option>
                                <option value="5">5 – AI-First</option>
                            </select>
                        </div>
                    </div>

                    {/* Engagement Track */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Engagement Track</label>
                        <div className="grid grid-cols-3 gap-2">
                            {TRACK_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setSelectedTrack(opt.value)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${opt.colors} ${selectedTrack === opt.value ? opt.activeRing : 'opacity-60 hover:opacity-90'}`}
                                >
                                    {opt.icon}
                                    <span className="text-[11px] font-black leading-tight">{opt.label}</span>
                                    <span className="text-[9px] opacity-70 leading-tight">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                        {selectedTrack !== (customer.aiTrack ?? 'GENERAL_AI') && (
                            <p className="text-[10px] text-amber-600 font-semibold ml-1">
                                Changing track will affect which assessment types are available.
                            </p>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
