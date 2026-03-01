'use client'

import { useState, useTransition, useRef } from 'react'
import { Sparkles, CheckCircle2, Clock, FileText, Upload, X, ExternalLink } from 'lucide-react'
import { generateDeliverable, updateDeliverableStatus } from '@/app/actions'
import type { DeliverableDef } from '@/lib/methodology'

interface DeliverableRecord {
    id: string
    deliverableKey: string
    status: string
    generatedContent: string | null
    generatedAt: Date | null
    completedAt: Date | null
}

interface DocumentRecord {
    id: string
    taskKey: string | null
    fileName: string
    fileSize: number
    mimeType: string
    filePath: string
    category: string
    uploadedAt: Date
}

interface DeliverablePanelProps {
    customerId: string
    phaseNumber: number
    definition: DeliverableDef
    record: DeliverableRecord | null
    documents: DocumentRecord[]
    onUploadComplete?: () => void
}

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', color: 'bg-slate-100 text-slate-600', icon: Clock },
    DRAFT: { label: 'Draft Ready', color: 'bg-amber-100 text-amber-700', icon: FileText },
    COMPLETED: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DeliverablePanel({
    customerId,
    phaseNumber,
    definition,
    record,
    documents,
}: DeliverablePanelProps) {
    const [, startTransition] = useTransition()
    const [showContent, setShowContent] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const status = record?.status ?? 'PENDING'
    const statusCfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING
    const StatusIcon = statusCfg.icon

    // Show only docs linked to this specific deliverable via taskKey = definition.key
    const attachedDocs = documents.filter(d => d.taskKey === definition.key)

    const handleGenerate = async () => {
        setGenerating(true)
        try {
            await generateDeliverable(customerId, phaseNumber, definition.key)
            setShowContent(true)
        } finally {
            setGenerating(false)
        }
    }

    const handleMarkComplete = () => {
        if (!record) return
        startTransition(async () => {
            await updateDeliverableStatus(record.id, 'COMPLETED')
        })
    }

    const handleFileUpload = async (file: File) => {
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('customerId', customerId)
            fd.append('phaseNumber', String(phaseNumber))
            fd.append('category', 'DELIVERABLE')
            fd.append('taskKey', definition.key)
            await fetch('/api/upload', { method: 'POST', body: fd })
            // Page will revalidate via server action; force a router refresh
            window.location.reload()
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                        </span>
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm leading-snug">{definition.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{definition.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {status !== 'COMPLETED' && (
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={generating}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            {generating ? 'Generating…' : record?.generatedContent ? 'Regenerate' : 'Generate Draft'}
                        </button>
                    )}
                    {record?.generatedContent && status !== 'COMPLETED' && (
                        <button
                            type="button"
                            onClick={() => setShowContent(v => !v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                        >
                            <FileText className="h-3.5 w-3.5" />
                            {showContent ? 'Hide' : 'View Draft'}
                        </button>
                    )}
                    {status === 'DRAFT' && (
                        <button
                            type="button"
                            onClick={handleMarkComplete}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark Complete
                        </button>
                    )}
                </div>
            </div>

            {/* Generated content preview */}
            {showContent && record?.generatedContent && (
                <div className="border-t border-slate-100 px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-600">Generated Draft</span>
                        <button
                            type="button"
                            aria-label="Close draft preview"
                            onClick={() => setShowContent(false)}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto leading-relaxed border border-slate-200">
                        {record.generatedContent}
                    </pre>
                    {record.generatedAt && (
                        <p className="text-xs text-slate-400 mt-2">
                            Generated {new Date(record.generatedAt).toLocaleString()}
                        </p>
                    )}
                </div>
            )}

            {/* Attached documents + upload */}
            <div className="border-t border-slate-100 px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500">
                        Attached Files ({attachedDocs.length})
                    </span>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                    >
                        <Upload className="h-3.5 w-3.5" />
                        {uploading ? 'Uploading…' : 'Upload Final'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        aria-label="Upload final deliverable file"
                        className="hidden"
                        onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file)
                            e.target.value = ''
                        }}
                    />
                </div>

                {attachedDocs.length > 0 && (
                    <div className="space-y-1.5">
                        {attachedDocs.map(doc => (
                            <a
                                key={doc.id}
                                href={`/api/files/${doc.filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
                            >
                                <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <span className="text-xs text-slate-700 flex-1 truncate">{doc.fileName}</span>
                                <span className="text-xs text-slate-400">{formatBytes(doc.fileSize)}</span>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
