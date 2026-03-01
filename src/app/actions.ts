'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { unlink } from 'fs/promises'
import path from 'path'
import { generateDeliverableContent } from '@/lib/deliverable-generators'

export async function createCustomer(formData: FormData) {
    const name = formData.get('name') as string
    const industry = formData.get('industry') as string
    const employees = formData.get('employees') as string
    const ambitionLevel = formData.get('ambitionLevel') ? Number(formData.get('ambitionLevel')) : 1

    await prisma.customer.create({
        data: {
            name,
            industry,
            employees,
            ambitionLevel,
            currentPhase: 1 // Default to Phase 1: Discovery & Readiness Assessment
        }
    })

    revalidatePath('/customers')
}

export async function getCustomers() {
    return await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function saveAssessment(customerId: string, scores: Record<string, number>) {
    await prisma.assessment.create({
        data: {
            customerId,
            scoreStrategy: scores['Strategy'],
            scoreData: scores['Data'],
            scoreTech: scores['Tech'],
            scoreSecurity: scores['Security'],
            scoreSkills: scores['Skills'],
            scoreOps: scores['Ops'],
            scoreGovernance: scores['Governance'],
            scoreFinancial: scores['Financial'],
            status: 'COMPLETED',
            completedAt: new Date()
        }
    })

    // Advance to Phase 2 if completing assessment for the first time
    await prisma.customer.update({
        where: { id: customerId },
        data: { currentPhase: 2 }
    })

    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/')
}

export async function addUseCase(customerId: string, formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const department = formData.get('department') as string
    const priority = formData.get('priority') as string
    const roiEstimate = formData.get('roiEstimate') ? Number(formData.get('roiEstimate')) : null

    await prisma.useCase.create({
        data: {
            customerId,
            title,
            description,
            department,
            priority,
            roiEstimate,
            status: 'DRAFT',
            phase: 2
        }
    })

    revalidatePath(`/customers/${customerId}`)
}

export async function getAllUseCases() {
    return await prisma.useCase.findMany({
        include: {
            customer: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getAllAssessments() {
    return await prisma.assessment.findMany({
        include: {
            customer: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function updateCustomerPhase(customerId: string, newPhase: number) {
    await prisma.customer.update({
        where: { id: customerId },
        data: { currentPhase: newPhase }
    })
    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/')
}

export async function updateCustomer(customerId: string, formData: FormData) {
    const name = formData.get('name') as string
    const industry = formData.get('industry') as string
    const employees = formData.get('employees') as string
    const ambitionLevel = formData.get('ambitionLevel') ? Number(formData.get('ambitionLevel')) : undefined

    await prisma.customer.update({
        where: { id: customerId },
        data: {
            name,
            industry: industry || null,
            employees: employees || null,
            ambitionLevel,
        }
    })

    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/customers')
    revalidatePath('/')
}

// ─── Phase Tasks ──────────────────────────────────────────────────────────────

export async function togglePhaseTask(
    customerId: string,
    phaseNumber: number,
    taskKey: string,
    completed: boolean
) {
    await prisma.phaseTask.upsert({
        where: {
            customerId_phaseNumber_taskKey: { customerId, phaseNumber, taskKey }
        },
        update: {
            completed,
            completedAt: completed ? new Date() : null,
        },
        create: {
            customerId,
            phaseNumber,
            taskKey,
            completed,
            completedAt: completed ? new Date() : null,
        }
    })
    revalidatePath(`/customers/${customerId}`)
}

// ─── Deliverables ─────────────────────────────────────────────────────────────

export async function generateDeliverable(
    customerId: string,
    phaseNumber: number,
    deliverableKey: string
) {
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
            assessments: { orderBy: { completedAt: 'desc' }, take: 1 },
            useCases: { orderBy: { createdAt: 'desc' } },
        }
    })
    if (!customer) throw new Error('Customer not found')

    const assessment = customer.assessments[0] ?? null
    const useCases = customer.useCases

    const content = generateDeliverableContent(deliverableKey, customer, { assessment, useCases })

    const deliverable = await prisma.deliverable.upsert({
        where: {
            customerId_phaseNumber_deliverableKey: { customerId, phaseNumber, deliverableKey }
        },
        update: {
            generatedContent: content,
            generatedAt: new Date(),
            status: 'DRAFT',
        },
        create: {
            customerId,
            phaseNumber,
            deliverableKey,
            generatedContent: content,
            generatedAt: new Date(),
            status: 'DRAFT',
        }
    })

    revalidatePath(`/customers/${customerId}`)
    return deliverable
}

export async function updateDeliverableStatus(deliverableId: string, status: string) {
    await prisma.deliverable.update({
        where: { id: deliverableId },
        data: {
            status,
            completedAt: status === 'COMPLETED' ? new Date() : null,
        }
    })
    // We don't know the customerId here; caller should revalidate if needed
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function deleteDocument(documentId: string) {
    const doc = await prisma.document.findUnique({ where: { id: documentId } })
    if (!doc) return

    // Remove file from disk
    try {
        const fullPath = path.join(process.cwd(), 'uploads', doc.filePath)
        await unlink(fullPath)
    } catch {
        // File may already be gone — continue to delete DB record
    }

    await prisma.document.delete({ where: { id: documentId } })
    revalidatePath(`/customers/${doc.customerId}`)
}

// ─── Phase Data Loader ────────────────────────────────────────────────────────

export async function getCustomerPhaseData(customerId: string) {
    const [tasks, deliverables, documents] = await Promise.all([
        prisma.phaseTask.findMany({ where: { customerId } }),
        prisma.deliverable.findMany({ where: { customerId } }),
        prisma.document.findMany({ where: { customerId }, orderBy: { uploadedAt: 'desc' } }),
    ])
    return { tasks, deliverables, documents }
}
