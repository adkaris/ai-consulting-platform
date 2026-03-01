'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, FileSpreadsheet, FileImage, File, Trash2, ExternalLink } from 'lucide-react'
import { deleteDocument } from '@/app/actions'

interface DocumentRecord {
    id: string
    fileName: string
    fileSize: number
    mimeType: string
    filePath: string
    category: string
    taskKey: string | null
    uploadedAt: Date
}

interface PhaseDocumentsProps {
    customerId: string
    phaseNumber: number
    documents: DocumentRecord[]
    taskOptions?: { key: string; title: string }[]
}

const CATEGORIES = [
    { value: 'CUSTOMER_DOC', label: 'Customer Doc' },
    { value: 'DELIVERABLE', label: 'Deliverable' },
    { value: 'MEETING_NOTES', label: 'Meeting Notes' },
    { value: 'OTHER', label: 'Other' },
]

const CATEGORY_COLORS: Record<string, string> = {
    CUSTOMER_DOC: 'bg-blue-100 text-blue-700',
    DELIVERABLE: 'bg-purple-100 text-purple-700',
    MEETING_NOTES: 'bg-amber-100 text-amber-700',
    OTHER: 'bg-slate-100 text-slate-600',
}

function FileIcon({ mimeType }: { mimeType: string }) {
    if (mimeType.startsWith('image/')) return <FileImage className="h-4 w-4 text-blue-500" />
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv')) return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
    if (mimeType === 'application/pdf') return <FileText className="h-4 w-4 text-red-500" />
    if (mimeType.includes('word')) return <FileText className="h-4 w-4 text-blue-600" />
    return <File className="h-4 w-4 text-slate-400" />
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PhaseDocuments({
    customerId,
    phaseNumber,
    documents,
    taskOptions = [],
}: PhaseDocumentsProps) {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [category, setCategory] = useState('OTHER')
    const [taskKey, setTaskKey] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const uploadFile = useCallback(async (file: File) => {
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('customerId', customerId)
            fd.append('phaseNumber', String(phaseNumber))
            fd.append('category', category)
            if (taskKey) fd.append('taskKey', taskKey)
            await fetch('/api/upload', { method: 'POST', body: fd })
            window.location.reload()
        } finally {
            setUploading(false)
        }
    }, [customerId, phaseNumber, category, taskKey])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) uploadFile(file)
    }, [uploadFile])

    const handleDelete = async (docId: string) => {
        if (!confirm('Delete this file?')) return
        await deleteDocument(docId)
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Phase Documents</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload supporting materials, meeting notes, or reference docs</p>
            </div>

            {/* Upload controls */}
            <div className="px-6 py-4 border-b border-slate-100 space-y-3">
                <div className="flex flex-wrap gap-3">
                    {/* Category */}
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        >
                            {CATEGORIES.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Optional task attachment */}
                    {taskOptions.length > 0 && (
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Attach to subtask (optional)</label>
                            <select
                                value={taskKey}
                                onChange={e => setTaskKey(e.target.value)}
                                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                            >
                                <option value="">— Phase level —</option>
                                {taskOptions.map(t => (
                                    <option key={t.key} value={t.key}>{t.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Drop zone */}
                <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer py-6 transition-colors ${
                        dragOver
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                >
                    <Upload className={`h-6 w-6 ${dragOver ? 'text-blue-500' : 'text-slate-400'}`} />
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">
                            {uploading ? 'Uploading…' : 'Drop a file or click to browse'}
                        </p>
                        <p className="text-xs text-slate-400">PDF, DOCX, XLSX, images, and more</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        disabled={uploading}
                        onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) uploadFile(file)
                            e.target.value = ''
                        }}
                    />
                </div>
            </div>

            {/* File list */}
            {documents.length === 0 ? (
                <div className="px-6 py-6 text-center text-sm text-slate-400">No documents uploaded yet</div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {documents.map(doc => (
                        <div key={doc.id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50/60 transition-colors group">
                            <FileIcon mimeType={doc.mimeType} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">{doc.fileName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[doc.category] ?? CATEGORY_COLORS.OTHER}`}>
                                        {CATEGORIES.find(c => c.value === doc.category)?.label ?? doc.category}
                                    </span>
                                    <span className="text-xs text-slate-400">{formatBytes(doc.fileSize)}</span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={`/api/files/${doc.filePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                                    title="Open file"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                                    title="Delete file"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
