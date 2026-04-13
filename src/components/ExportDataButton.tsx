'use client'

import { useTransition } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { exportPortfolioData } from '@/app/actions'
import { toastSuccess, toastError } from '@/lib/toast'

export default function ExportDataButton() {
    const [isPending, startTransition] = useTransition()

    const handleExport = () => {
        startTransition(async () => {
            try {
                const data = await exportPortfolioData()
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `ai-platform-export-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
                toastSuccess('Portfolio data exported successfully')
            } catch {
                toastError('Export failed — please try again')
            }
        })
    }

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isPending ? 'Exporting…' : 'Export JSON'}
        </button>
    )
}
