'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAssessmentById(assessmentId: string) {
    return await prisma.assessment.findUnique({
        where: { id: assessmentId },
        include: {
            customer: { select: { id: true, name: true, industry: true, currentPhase: true } }
        }
    })
}

export async function getCopilotAssessmentById(assessmentId: string) {
    return await prisma.copilotAssessment.findUnique({
        where: { id: assessmentId },
        include: {
            customer: { select: { id: true, name: true, industry: true, currentPhase: true } }
        }
    })
}

export async function getAssessmentSchema() {
    return await prisma.assessmentDomain.findMany({
        where: { trackType: 'GENERAL' },
        include: {
            questions: {
                orderBy: { id: 'asc' }
            }
        },
        orderBy: { name: 'asc' }
    })
}

export async function getCopilotAssessmentSchema() {
    return await prisma.assessmentDomain.findMany({
        where: { trackType: 'COPILOT' },
        include: {
            questions: {
                orderBy: { id: 'asc' }
            }
        },
        orderBy: { name: 'asc' }
    })
}

export async function saveCopilotAssessment(customerId: string, scores: Record<string, number>) {
    const assessment = await prisma.copilotAssessment.create({
        data: {
            customerId,
            scoreStrategy:   scores['Strategy']   ?? null,
            scoreM365:       scores['M365']        ?? null,
            scoreContent:    scores['Content']     ?? null,
            scoreSecurity:   scores['Security']    ?? null,
            scoreIdentity:   scores['Identity']    ?? null,
            scoreAdoption:   scores['Adoption']    ?? null,
            scoreUseCases:   scores['UseCases']    ?? null,
            scoreGovernance: scores['Governance']  ?? null,
            status: 'COMPLETED',
            completedAt: new Date(),
        }
    })
    revalidatePath(`/customers/${customerId}`)
    revalidatePath(`/customers/${customerId}/assessment/results`)
    return assessment
}

export async function updateQuestionAction(id: string, data: { text?: string, weight?: string }) {
    const updated = await prisma.assessmentQuestion.update({
        where: { id },
        data: {
            ...data
        }
    })
    revalidatePath('/settings')
    revalidatePath('/customers/[id]/assessment/new', 'page')
    return updated
}

export async function updateDomainAction(id: string, data: { name?: string, weight?: number, description?: string }) {
    const updated = await prisma.assessmentDomain.update({
        where: { id },
        data: {
            ...data
        }
    })
    revalidatePath('/settings')
    return updated
}

export async function deleteQuestionAction(id: string) {
    const deleted = await prisma.assessmentQuestion.delete({
        where: { id }
    })
    revalidatePath('/settings')
    revalidatePath('/customers/[id]/assessment/new', 'page')
    return deleted
}

export async function addQuestionAction(domainId: string, data: { text: string, weight: string, scoringGuide?: string }) {
    const newQuestion = await prisma.assessmentQuestion.create({
        data: {
            domainId,
            text: data.text,
            weight: data.weight,
            scoringGuide: data.scoringGuide || '{}'
        }
    })
    revalidatePath('/settings')
    revalidatePath('/customers/[id]/assessment/new', 'page')
    return newQuestion
}
