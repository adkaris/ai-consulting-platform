import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        const file = formData.get('file') as File | null
        const customerId = formData.get('customerId') as string
        const phaseNumber = parseInt(formData.get('phaseNumber') as string)
        const taskKey = formData.get('taskKey') as string | null
        const category = (formData.get('category') as string) || 'OTHER'

        if (!file || !customerId || !phaseNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Sanitize filename and build storage path
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const relativePath = `${customerId}/${phaseNumber}/${timestamp}-${safeName}`
        const uploadsRoot = path.join(process.cwd(), 'uploads')
        const dirPath = path.join(uploadsRoot, customerId, String(phaseNumber))
        const fullPath = path.join(uploadsRoot, relativePath)

        // Ensure directory exists
        await mkdir(dirPath, { recursive: true })

        // Write file
        const bytes = await file.arrayBuffer()
        await writeFile(fullPath, Buffer.from(bytes))

        // Save metadata to DB
        const doc = await prisma.document.create({
            data: {
                customerId,
                phaseNumber,
                taskKey: taskKey || null,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type || 'application/octet-stream',
                filePath: relativePath,
                category,
            }
        })

        return NextResponse.json({ id: doc.id, fileName: doc.fileName, filePath: doc.filePath })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
