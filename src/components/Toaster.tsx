'use client'

import { useEffect, useState } from 'react'
import { subscribeToToasts, type Toast } from '@/lib/toast'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return subscribeToToasts((t) => {
      setToasts((prev) => [...prev, t])
      setTimeout(
        () => setToasts((prev) => prev.filter((x) => x.id !== t.id)),
        t.durationMs ?? 3500,
      )
    })
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg border text-sm font-medium transition-all animate-in slide-in-from-bottom-2 ${
            t.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : t.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}
        >
          {t.type === 'success' && <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />}
          {t.type === 'error'   && <XCircle     className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />}
          {t.type === 'info'    && <Info         className="h-4 w-4 mt-0.5 shrink-0 text-indigo-500" />}
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
