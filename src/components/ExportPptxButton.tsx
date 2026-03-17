'use client'

import React, { useState } from 'react'
import { Presentation, Download, Loader2 } from 'lucide-react'
import { exportCustomerStrategyToPptx } from '@/app/actions'

interface ExportPptxButtonProps {
    customerId: string;
    customerName: string;
}

export default function ExportPptxButton({ customerId, customerName }: ExportPptxButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const base64 = await exportCustomerStrategyToPptx(customerId)
            
            // Convert base64 to Blob
            const byteCharacters = atob(base64)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
            
            // Trigger download
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${customerName.replace(/\s+/g, '_')}_AI_Strategy.pptx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            
        } catch (error) {
            console.error('Failed to export PPTX:', error)
            alert('Error generating PowerPoint presentation. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            title="Export to PowerPoint"
            aria-label="Export to PowerPoint"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-wait"
        >
            {isExporting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Exporting...
                </>
            ) : (
                <>
                    <Presentation className="w-4 h-4" />
                    Export PPTX
                </>
            )}
        </button>
    )
}
