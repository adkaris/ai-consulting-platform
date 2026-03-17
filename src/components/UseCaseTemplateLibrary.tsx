'use client'

import React, { useState } from 'react'
import { USE_CASE_TEMPLATES, UseCaseTemplate } from '@/lib/use-case-templates'
import { importUseCaseTemplate } from '@/app/actions'
import { Search, Plus, Check, Filter, X, Sparkles, TrendingUp } from 'lucide-react'

interface UseCaseTemplateLibraryProps {
    customerId: string
}

export default function UseCaseTemplateLibrary({ customerId }: UseCaseTemplateLibraryProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDept, setSelectedDept] = useState<string | null>(null)
    const [importingId, setImportingId] = useState<string | null>(null)
    const [importedIds, setImportedIds] = useState<string[]>([])

    const departments = Array.from(new Set(USE_CASE_TEMPLATES.map(t => t.department))).sort()

    const filteredTemplates = USE_CASE_TEMPLATES.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDept = !selectedDept || t.department === selectedDept
        return matchesSearch && matchesDept
    })

    const handleImport = async (template: UseCaseTemplate) => {
        setImportingId(template.id)
        try {
            await importUseCaseTemplate(customerId, template.id)
            setImportedIds(prev => [...prev, template.id])
            // Keep the success state for a moment
            setTimeout(() => {
                setImportingId(null)
            }, 1500)
        } catch (error) {
            console.error('Failed to import template:', error)
            setImportingId(null)
        }
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden border-2 border-slate-100">
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search high-value templates..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
                        <button
                            onClick={() => setSelectedDept(null)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                !selectedDept 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            All
                        </button>
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDept(dept)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    selectedDept === dept 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="p-6 max-h-[500px] overflow-y-auto">
                {filteredTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTemplates.map(template => {
                            const isImporting = importingId === template.id
                            const isImported = importedIds.includes(template.id)

                            return (
                                <div key={template.id} className="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded">
                                            {template.department}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-emerald-600">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-black italic">
                                                ~${(template.roiEstimate / 1000).toFixed(0)}k ROI
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                                        {template.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                        {template.description}
                                    </p>
                                    
                                    <button
                                        onClick={() => handleImport(template)}
                                        disabled={isImporting || isImported}
                                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                            isImported 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' 
                                            : isImporting
                                                ? 'bg-slate-100 text-slate-400 cursor-wait'
                                                : 'bg-slate-900 text-white hover:bg-blue-600 shadow-sm'
                                        }`}
                                    >
                                        {isImported ? (
                                            <>
                                                <Check className="w-4 h-4" /> Added to Case
                                            </>
                                        ) : isImporting ? (
                                            'Importing...'
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" /> Import Template
                                            </>
                                        )}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <X className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No templates match your search criteria.</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Templates are based on industry benchmarks for AI adoption.</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {filteredTemplates.length} Templates Found
                </span>
            </div>
        </div>
    )
}
