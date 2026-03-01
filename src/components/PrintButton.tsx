'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-500/20 text-white"
        >
            <Printer className="w-4 h-4" /> Export PDF
        </button>
    )
}
