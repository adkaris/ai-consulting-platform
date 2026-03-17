'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { unlink } from 'fs/promises'
import path from 'path'
import { generateDeliverableContent } from '@/lib/deliverable-generators'
import { convertMarkdownToDocx } from '@/lib/docx-utils'
import { METHODOLOGY } from '@/lib/methodology'
import { USE_CASE_TEMPLATES } from '@/lib/use-case-templates'
import { analyzeMeetingNotes, IntakeResults } from '@/lib/ai-intake'
import { generateCustomerPptx } from '@/lib/pptx-utils'

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
    const assessment = await prisma.assessment.create({
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
    
    return assessment
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

export async function updateUseCase(useCaseId: string, customerId: string, formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const department = formData.get('department') as string
    const priority = formData.get('priority') as string
    const status = formData.get('status') as string
    const roiEstimate = formData.get('roiEstimate') ? Number(formData.get('roiEstimate')) : null

    await prisma.useCase.update({
        where: { id: useCaseId },
        data: {
            title,
            description,
            department,
            priority,
            status,
            roiEstimate
        }
    })

    revalidatePath(`/customers/${customerId}`)
}

export async function deleteUseCase(useCaseId: string, customerId: string) {
    await prisma.useCase.delete({
        where: { id: useCaseId }
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

export async function downloadDeliverableWord(deliverableId: string) {
    const record = await prisma.deliverable.findUnique({
        where: { id: deliverableId },
        include: { customer: true }
    })

    if (!record || !record.generatedContent) {
        throw new Error('Deliverable content not found.')
    }

    const buffer = await convertMarkdownToDocx(record.deliverableKey.replace(/_/g, ' '), record.generatedContent)
    return buffer.toString('base64')
}

// ─── Action Plan Aggregation ──────────────────────────────────────────────────

export type PendingActionItem = {
    id: string
    type: 'TASK' | 'DELIVERABLE'
    title: string
    description: string
    customerName: string
    customerId: string
    phase: number
    key: string
    hasDraft?: boolean
}

export async function getPendingConsultantWork(): Promise<PendingActionItem[]> {
    const customers = await prisma.customer.findMany({
        include: {
            phaseTasks: true,
            deliverables: true,
        }
    })

    const pendingItems: PendingActionItem[] = []

    for (const customer of customers) {
        if (customer.currentPhase > 5) continue

        const phaseDef = METHODOLOGY.find(p => p.number === customer.currentPhase)
        if (!phaseDef) continue

        // Check Phase Tasks
        for (const subtask of phaseDef.subtasks) {
            const isCompleted = customer.phaseTasks.find(pt => pt.phaseNumber === phaseDef.number && pt.taskKey === subtask.key)?.completed
            if (!isCompleted) {
                pendingItems.push({
                    id: `task-${customer.id}-${phaseDef.number}-${subtask.key}`,
                    type: 'TASK',
                    title: subtask.title,
                    description: subtask.description,
                    customerName: customer.name,
                    customerId: customer.id,
                    phase: phaseDef.number,
                    key: subtask.key,
                })
            }
        }

        // Check Deliverables
        for (const devDef of phaseDef.deliverables) {
            const existingDel = customer.deliverables.find(d => d.phaseNumber === phaseDef.number && d.deliverableKey === devDef.key)
            if (!existingDel || existingDel.status !== 'COMPLETED') {
                pendingItems.push({
                    id: `del-${customer.id}-${phaseDef.number}-${devDef.key}`,
                    type: 'DELIVERABLE',
                    title: devDef.title,
                    description: devDef.description,
                    customerName: customer.name,
                    customerId: customer.id,
                    phase: phaseDef.number,
                    key: devDef.key,
                    hasDraft: existingDel?.status === 'DRAFT'
                })
            }
        }
    }

    return pendingItems
}

// ─── Template Library ─────────────────────────────────────────────────────────

export async function importUseCaseTemplate(customerId: string, templateId: string) {
    const template = USE_CASE_TEMPLATES.find(t => t.id === templateId)
    if (!template) throw new Error('Template not found')

    await prisma.useCase.create({
        data: {
            customerId,
            title: template.title,
            description: template.description,
            department: template.department,
            priority: template.priority,
            roiEstimate: template.roiEstimate,
            status: 'DRAFT',
            phase: 2
        }
    })

    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/')
}

// ─── AI Intake ────────────────────────────────────────────────────────────────

export async function processMeetingNotes(customerId: string, notes: string) {
    return await analyzeMeetingNotes(notes)
}

export async function applyIntakeResults(customerId: string, data: IntakeResults) {
    // 1. Save Assessment
    await prisma.assessment.create({
        data: {
            customerId,
            scoreStrategy: data.readinessScores.Strategy,
            scoreData: data.readinessScores.Data,
            scoreTech: data.readinessScores.Tech,
            scoreSecurity: data.readinessScores.Security,
            scoreSkills: data.readinessScores.Skills,
            scoreOps: data.readinessScores.Ops,
            scoreGovernance: data.readinessScores.Governance,
            scoreFinancial: data.readinessScores.Financial,
            status: 'COMPLETED',
            completedAt: new Date()
        }
    })

    // 2. Add Use Cases
    for (const uc of data.useCases) {
        await prisma.useCase.create({
            data: {
                customerId,
                title: uc.title,
                description: uc.description,
                department: uc.department,
                priority: uc.priority,
                roiEstimate: uc.roiEstimate,
                status: 'DRAFT',
                phase: 2
            }
        })
    }

    // 3. Advance Phase if in Phase 1
    const customer = await prisma.customer.findUnique({ where: { id: customerId } })
    if (customer && customer.currentPhase === 1) {
        await prisma.customer.update({
            where: { id: customerId },
            data: { currentPhase: 2 }
        })
    }

    revalidatePath(`/customers/${customerId}`)
    revalidatePath('/')
}

// ─── Export PPTX ──────────────────────────────────────────────────────────────

export async function exportCustomerStrategyToPptx(customerId: string) {
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
            assessments: { orderBy: { completedAt: 'desc' }, take: 1 },
            useCases: { orderBy: { priority: 'desc' } }
        }
    })

    if (!customer) throw new Error('Customer not found')

    const pptxBuffer = await generateCustomerPptx({
        customerName: customer.name,
        industry: customer.industry || 'General Tech',
        currentPhase: customer.currentPhase,
        assessment: customer.assessments[0] || null,
        useCases: customer.useCases
    })

    // Return as base64 string for client-side download
    return pptxBuffer.toString('base64')
}

