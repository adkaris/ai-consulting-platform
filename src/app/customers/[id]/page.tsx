import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Building2, Calendar, Activity, Sparkles, BrainCircuit } from 'lucide-react'
import ProfileWorkflow from '@/components/ProfileWorkflow'
import EditProfileModal from '@/components/EditProfileModal'
import GenerateReportButton from '@/components/GenerateReportButton'
import ExportPptxButton from '@/components/ExportPptxButton'
import { getCustomerPhaseData } from '@/app/actions'

export default async function CustomerProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [customer, phaseData] = await Promise.all([
        prisma.customer.findUnique({
            where: { id },
            include: {
                assessments: { orderBy: { completedAt: 'desc' } },
                useCases: { orderBy: { createdAt: 'desc' } },
            }
        }),
        getCustomerPhaseData(id),
    ])

    if (!customer) return notFound()

    return (
        <div className="space-y-8 animate-in fade-in fill-mode-both duration-300">

            {/* Customer Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg shadow-blue-500/20">
                        <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{customer.name}</h1>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="flex items-center"><Activity className="w-4 h-4 mr-1.5 text-blue-600" /> {customer.industry || 'General Tech'}</span>
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Added {new Date(customer.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Link
                        href={`/customers/${id}/intake`}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm"
                    >
                        <BrainCircuit className="w-4 h-4" />
                        AI Intake
                    </Link>
                    <ExportPptxButton customerId={id} customerName={customer.name} />
                    <EditProfileModal customer={customer} />
                    <GenerateReportButton customerId={id} />
                </div>
            </div>

            <ProfileWorkflow customer={customer} phaseData={phaseData} />
        </div>
    )
}
