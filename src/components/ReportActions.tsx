'use client'

import { Printer, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ReportActions({ customerId }: { customerId: string }) {
    return (
        <div className="flex items-center justify-between no-print border-b border-slate-200 pb-6">
            <Link href={`/customers/${customerId}`} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
            </Link>
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download PDF
                </button>
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                    <Printer className="w-4 h-4" /> Print Report
                </button>
            </div>
        </div>
    )
}
