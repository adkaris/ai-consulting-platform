'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { generateDeliverable } from '@/app/actions'

export default function GenerateReportButton({ customerId }: { customerId: string }) {
    const router = useRouter()
    const [generating, setGenerating] = useState(false)

    const handleGenerate = async () => {
        setGenerating(true)
        try {
            await generateDeliverable(customerId, 1, 'readiness_report')
            router.refresh()
            router.push(`/customers/${customerId}/report`)
        } catch (error) {
            console.error(error)
            alert('Failed to generate report.')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
            <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating...' : 'Generate Report'}
        </button>
    )
}
