import { getAssessmentSchema } from '@/app/assessment-actions'
import AssessmentForm from '@/components/AssessmentForm'

export default async function NewAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: customerId } = await params
    const assessmentSchema = await getAssessmentSchema()

    return <AssessmentForm customerId={customerId} assessmentSchema={assessmentSchema as any} />
}
