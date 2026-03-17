'use client'

import React, { useState } from 'react'
import { BookOpen, X } from 'lucide-react'
import UseCaseTemplateLibrary from './UseCaseTemplateLibrary'

interface UseCaseTemplateModalProps {
    customerId: string
}

export default function UseCaseTemplateModal({ customerId }: UseCaseTemplateModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all shadow-sm active:scale-95"
            >
                <BookOpen className="w-4 h-4" />
                Import from Library
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Use Case Library</h2>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Browse high-impact templates and instantly add them to your backlog.</p>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        title="Close Library"
                        aria-label="Close Library"
                        className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200 shadow-sm group"
                    >
                        <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
                    </button>
                </div>

                {/* Library Content */}
                <div className="flex-1 overflow-hidden p-8 bg-slate-50/30">
                    <UseCaseTemplateLibrary customerId={customerId} />
                </div>

                {/* Footer */}
                <div className="px-10 py-6 border-t border-slate-100 bg-white flex justify-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                    >
                        Done Browsing
                    </button>
                </div>
            </div>
        </div>
    )
}
