'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
    open: boolean
    title?: string
    message: string
    confirmLabel?: string
    danger?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    open,
    title = 'Confirm Action',
    message,
    confirmLabel = 'Confirm',
    danger = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* Panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm mx-4 p-6 animate-in zoom-in-95 duration-150">
                <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl shrink-0 ${danger ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => { onConfirm(); }}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-xl transition-colors ${
                            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
