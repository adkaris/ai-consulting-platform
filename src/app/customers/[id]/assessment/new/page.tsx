import prisma from '@/lib/prisma'
import { getAssessmentSchema, getCopilotAssessmentSchema } from '@/app/assessment-actions'
import AssessmentForm from '@/components/AssessmentForm'
import { redirect } from 'next/navigation'

export default async function NewAssessmentPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ track?: string }>
}) {
    const { id: customerId } = await params
    const { track } = await searchParams

    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { id: true, name: true, aiTrack: true },
    })

    if (!customer) redirect('/customers')

    // For MIXED customers with no track param, show a track selection screen
    if (customer.aiTrack === 'MIXED' && !track) {
        return <TrackSelector customerId={customerId} customerName={customer.name} />
    }

    const isCopilot =
        customer.aiTrack === 'COPILOT' ||
        (customer.aiTrack === 'MIXED' && track === 'COPILOT')

    const assessmentSchema = isCopilot
        ? await getCopilotAssessmentSchema()
        : await getAssessmentSchema()

    return (
        <AssessmentForm
            customerId={customerId}
            assessmentSchema={assessmentSchema as any}
            trackType={isCopilot ? 'COPILOT' : 'GENERAL'}
        />
    )
}

function TrackSelector({ customerId, customerName }: { customerId: string; customerName: string }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <h1 className="text-2xl font-black text-slate-900 mb-1">Start Assessment</h1>
                    <p className="text-slate-500 text-sm mb-8">
                        <span className="font-semibold text-slate-700">{customerName}</span> is on a Mixed track.
                        Which assessment would you like to run?
                    </p>

                    <div className="space-y-3">
                        <a
                            href={`/customers/${customerId}/assessment/new?track=GENERAL`}
                            className="flex items-center gap-4 p-5 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                        >
                            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-black text-slate-900">General AI Readiness</p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    8 domains covering strategy, data, tech, security, skills, ops, governance &amp; financial readiness
                                </p>
                            </div>
                        </a>

                        <a
                            href={`/customers/${customerId}/assessment/new?track=COPILOT`}
                            className="flex items-center gap-4 p-5 rounded-xl border-2 border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-all group"
                        >
                            <div className="p-3 bg-violet-100 rounded-xl group-hover:bg-violet-200 transition-colors">
                                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-black text-slate-900">Microsoft Copilot Readiness</p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    8 domains covering M365 foundation, identity, content governance, adoption &amp; Copilot-specific use cases
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
