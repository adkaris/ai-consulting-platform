import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: segments } = await params
        // Prevent path traversal attacks
        const safePath = segments.map(s => s.replace(/\.\./g, '')).join('/')
        const fullPath = path.join(process.cwd(), 'uploads', safePath)

        const fileBuffer = await readFile(fullPath)

        // Infer content type from extension
        const ext = path.extname(fullPath).toLowerCase()
        const contentTypeMap: Record<string, string> = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.txt': 'text/plain',
            '.md': 'text/markdown',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.csv': 'text/csv',
            '.zip': 'application/zip',
        }
        const contentType = contentTypeMap[ext] || 'application/octet-stream'

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
            },
        })
    } catch {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
}
