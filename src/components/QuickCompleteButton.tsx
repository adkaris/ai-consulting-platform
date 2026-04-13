'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { togglePhaseTask } from '@/app/actions'
import { toastSuccess, toastError } from '@/lib/toast'

export default function QuickCompleteButton({
    customerId,
    phaseNumber,
    taskKey,
}: {
    customerId: string
    phaseNumber: number
    taskKey: string
}) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleComplete = () => {
        startTransition(async () => {
            try {
                await togglePhaseTask(customerId, phaseNumber, taskKey, true)
                toastSuccess('Task marked complete')
                router.refresh()
            } catch {
                toastError('Failed to complete task')
            }
        })
    }

    return (
        <button
            type="button"
            onClick={handleComplete}
            disabled={isPending}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            title="Mark complete"
        >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Done
        </button>
    )
}
