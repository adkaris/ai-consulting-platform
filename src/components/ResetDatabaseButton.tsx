'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { resetDatabase } from '@/app/actions'
import { toastSuccess, toastError } from '@/lib/toast'

export default function ResetDatabaseButton() {
    const [confirming, setConfirming] = useState(false)
    const [running, setRunning] = useState(false)

    const handleReset = async () => {
        setRunning(true)
        try {
            await resetDatabase()
            toastSuccess('Database reset — all data has been cleared.')
            setConfirming(false)
            window.location.href = '/'
        } catch {
            toastError('Reset failed. Please try again.')
        } finally {
            setRunning(false)
        }
    }

    if (!confirming) {
        return (
            <button
                onClick={() => setConfirming(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-bold hover:bg-rose-100 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                Reset Database
            </button>
        )
    }

    return (
        <div className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50 space-y-4">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-rose-800">This will permanently delete all data</p>
                    <p className="text-xs text-rose-600 mt-1">
                        All customers, assessments, use cases, deliverables, and documents will be erased. This cannot be undone.
                        The assessment question bank is preserved.
                    </p>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => setConfirming(false)}
                    disabled={running}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleReset}
                    disabled={running}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    {running ? 'Resetting…' : 'Yes, Delete Everything'}
                </button>
            </div>
        </div>
    )
}
