'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateUseCaseStatus } from '@/app/actions'
import { toastSuccess, toastError } from '@/lib/toast'

type Status = 'DRAFT' | 'APPROVED' | 'PILOTING' | 'PRODUCTION'

const STATUS_STYLES: Record<Status, string> = {
    DRAFT:      'bg-slate-100  text-slate-600  border-slate-200',
    APPROVED:   'bg-emerald-50 text-emerald-700 border-emerald-100',
    PILOTING:   'bg-amber-50   text-amber-700   border-amber-100',
    PRODUCTION: 'bg-blue-50    text-blue-700    border-blue-100',
}

export default function UseCaseStatusSelect({
    useCaseId,
    currentStatus,
}: {
    useCaseId: string
    currentStatus: string
}) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Status
        startTransition(async () => {
            try {
                await updateUseCaseStatus(useCaseId, newStatus)
                toastSuccess(`Status updated to ${newStatus.charAt(0) + newStatus.slice(1).toLowerCase()}`)
                router.refresh()
            } catch {
                toastError('Failed to update status')
            }
        })
    }

    const style = STATUS_STYLES[currentStatus as Status] ?? STATUS_STYLES.DRAFT

    return (
        <select
            value={currentStatus}
            onChange={handleChange}
            disabled={isPending}
            className={`text-[10px] font-bold uppercase tracking-wide border rounded-lg px-2 py-1 cursor-pointer transition-opacity ${style} ${isPending ? 'opacity-50' : ''}`}
        >
            <option value="DRAFT">Draft</option>
            <option value="APPROVED">Approved</option>
            <option value="PILOTING">Piloting</option>
            <option value="PRODUCTION">Production</option>
        </select>
    )
}
