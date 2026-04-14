'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Building2, Users, Zap, Bot, MonitorSmartphone, Layers } from 'lucide-react'
import { createCustomer } from '@/app/actions'

const AMBITION_LABELS: Record<number, string> = {
  1: 'Exploratory',
  2: 'Moderate',
  3: 'Ambitious',
  4: 'Aggressive',
  5: 'Transformational',
}

const EMPLOYEE_OPTIONS = ['1–50', '50–200', '200–1,000', '1,000–5,000', '5,000+']

const TRACKS = [
  {
    value: 'GENERAL_AI',
    label: 'General AI',
    icon: Bot,
    description: 'Custom AI models, data pipelines, LLMs & agents',
    color: 'blue',
  },
  {
    value: 'COPILOT',
    label: 'Microsoft Copilot',
    icon: MonitorSmartphone,
    description: 'M365 Copilot, Copilot Studio & Teams AI features',
    color: 'violet',
  },
  {
    value: 'MIXED',
    label: 'Mixed',
    icon: Layers,
    description: 'Both General AI and Microsoft Copilot initiatives',
    color: 'emerald',
  },
] as const

type TrackValue = 'GENERAL_AI' | 'COPILOT' | 'MIXED'

const TRACK_STYLES: Record<TrackValue, { selected: string; hover: string; icon: string; dot: string }> = {
  GENERAL_AI: {
    selected: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20',
    hover: 'hover:border-blue-300 hover:bg-blue-50/50',
    icon: 'bg-blue-100 text-blue-600',
    dot: 'bg-blue-500',
  },
  COPILOT: {
    selected: 'border-violet-500 bg-violet-50 ring-2 ring-violet-500/20',
    hover: 'hover:border-violet-300 hover:bg-violet-50/50',
    icon: 'bg-violet-100 text-violet-600',
    dot: 'bg-violet-500',
  },
  MIXED: {
    selected: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20',
    hover: 'hover:border-emerald-300 hover:bg-emerald-50/50',
    icon: 'bg-emerald-100 text-emerald-600',
    dot: 'bg-emerald-500',
  },
}

export default function NewCustomerModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [ambition, setAmbition] = useState(3)
  const [aiTrack, setAiTrack] = useState<TrackValue>('GENERAL_AI')
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('ambitionLevel', String(ambition))
    formData.set('aiTrack', aiTrack)
    startTransition(async () => {
      await createCustomer(formData)
      setIsOpen(false)
      formRef.current?.reset()
      setAmbition(3)
      setAiTrack('GENERAL_AI')
      router.refresh()
    })
  }

  function handleClose() {
    if (!isPending) setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        New Customer
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">New Customer Profile</h2>
                  <p className="text-xs text-slate-500">Start tracking their AI transformation journey</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Company Name */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  name="name"
                  required
                  autoFocus
                  placeholder="e.g. ACME Corporation"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Engagement Type */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Engagement Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {TRACKS.map(track => {
                    const Icon = track.icon
                    const styles = TRACK_STYLES[track.value]
                    const isSelected = aiTrack === track.value
                    return (
                      <button
                        key={track.value}
                        type="button"
                        onClick={() => setAiTrack(track.value)}
                        className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                          isSelected
                            ? styles.selected
                            : `border-slate-200 bg-white ${styles.hover}`
                        }`}
                      >
                        {isSelected && (
                          <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${styles.dot}`} />
                        )}
                        <span className={`p-2 rounded-lg ${styles.icon}`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-black text-slate-800 text-center leading-tight">
                          {track.label}
                        </span>
                        <span className="text-[10px] text-slate-500 text-center leading-tight">
                          {track.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Industry + Employees */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Industry
                  </label>
                  <input
                    name="industry"
                    placeholder="e.g. Finance, Retail"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> Employees
                    </span>
                  </label>
                  <select
                    name="employees"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select range</option>
                    {EMPLOYEE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {/* Ambition Level */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> AI Ambition Level
                  </span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setAmbition(level)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                        ambition === level
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1.5 text-center font-semibold">
                  {AMBITION_LABELS[ambition]}
                </p>
              </div>

              {/* Footer actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  {isPending ? 'Creating…' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
