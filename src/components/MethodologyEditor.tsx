'use client'

import React, { useState } from 'react'
import { 
    ChevronDown, ChevronRight, Save, Edit2, 
    AlertCircle, CheckCircle2, Layers, HelpCircle,
    Trash2, Plus
} from 'lucide-react'
import { 
    updateQuestionAction, 
    updateDomainAction, 
    deleteQuestionAction,
    addQuestionAction 
} from '@/app/assessment-actions'

interface Question {
    id: string
    text: string
    weight: string
    scoringGuide: string
}

interface Domain {
    id: string
    name: string
    description: string | null
    weight: number
    questions: Question[]
}

interface MethodologyEditorProps {
    initialDomains: Domain[]
}

export default function MethodologyEditor({ initialDomains }: MethodologyEditorProps) {
    const [domains, setDomains] = useState(initialDomains)
    const [expandedDomain, setExpandedDomain] = useState<string | null>(domains[0]?.id || null)
    const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
    const [addingToDomain, setAddingToDomain] = useState<string | null>(null)
    const [saving, setSaving] = useState<string | null>(null)
    const [notif, setNotif] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleSaveQuestion = async (qId: string, text: string, weight: string) => {
        setSaving(qId)
        try {
            await updateQuestionAction(qId, { text, weight })
            setNotif({ type: 'success', message: 'Question updated successfully' })
            setEditingQuestion(null)
            setDomains(prev => prev.map(d => ({
                ...d,
                questions: d.questions.map(q => q.id === qId ? { ...q, text, weight } : q)
            })))
        } catch (error) {
            setNotif({ type: 'error', message: 'Failed to update question' })
        } finally {
            setSaving(null)
            setTimeout(() => setNotif(null), 3000)
        }
    }

    const handleDeleteQuestion = async (qId: string) => {
        if (!confirm('Are you sure you want to delete this question? This cannot be undone.')) return
        
        setSaving(qId)
        try {
            await deleteQuestionAction(qId)
            setNotif({ type: 'success', message: 'Question deleted' })
            setDomains(prev => prev.map(d => ({
                ...d,
                questions: d.questions.filter(q => q.id !== qId)
            })))
        } catch (error) {
            setNotif({ type: 'error', message: 'Failed to delete question' })
        } finally {
            setSaving(null)
            setTimeout(() => setNotif(null), 3000)
        }
    }

    const handleAddQuestion = async (domainId: string) => {
        const textArea = document.getElementById(`new-text-${domainId}`) as HTMLTextAreaElement
        const weightSelect = document.getElementById(`new-weight-${domainId}`) as HTMLSelectElement
        
        if (!textArea.value.trim()) {
            alert('Please enter question text')
            return
        }

        setSaving(`new-${domainId}`)
        try {
            const newQ = await addQuestionAction(domainId, { 
                text: textArea.value, 
                weight: weightSelect.value 
            })
            setNotif({ type: 'success', message: 'New question added' })
            setAddingToDomain(null)
            setDomains(prev => prev.map(d => d.id === domainId ? {
                ...d,
                questions: [...d.questions, {
                    id: newQ.id,
                    text: newQ.text,
                    weight: newQ.weight,
                    scoringGuide: newQ.scoringGuide
                }]
            } : d))
        } catch (error) {
            setNotif({ type: 'error', message: 'Failed to add question' })
        } finally {
            setSaving(null)
            setTimeout(() => setNotif(null), 3000)
        }
    }

    const weights = ['Critical', 'High', 'Standard']

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Maturity Matrix Configuration</h3>
                    <p className="text-sm text-slate-500">Add, edit, or remove assessment questions and scoring weights.</p>
                </div>
                {notif && (
                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 z-50 fixed top-6 right-6 shadow-2xl ${
                        notif.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                    }`}>
                        {notif.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="text-xs font-bold uppercase tracking-wider">{notif.message}</span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {domains.map((domain) => (
                    <div key={domain.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm hover:shadow-md">
                        <button 
                            onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900">{domain.name}</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{domain.questions.length} Questions · {domain.weight}x Weight</p>
                                </div>
                            </div>
                            {expandedDomain === domain.id ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                        </button>

                        {expandedDomain === domain.id && (
                            <div className="border-t border-slate-100 bg-slate-50/30 p-6 space-y-4">
                                {domain.questions.map((q) => {
                                    const isEditing = editingQuestion === q.id
                                    return (
                                        <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm group/q relative">
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {q.id}</span>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => setEditingQuestion(null)}
                                                                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button 
                                                                disabled={saving === q.id}
                                                                onClick={() => {
                                                                    const text = (document.getElementById(`text-${q.id}`) as HTMLTextAreaElement).value
                                                                    const weight = (document.getElementById(`weight-${q.id}`) as HTMLSelectElement).value
                                                                    handleSaveQuestion(q.id, text, weight)
                                                                }}
                                                                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
                                                            >
                                                                {saving === q.id ? 'Saving...' : <><Save className="w-3 h-3" /> Save Changes</>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <textarea 
                                                        id={`text-${q.id}`}
                                                        title="Question Text"
                                                        defaultValue={q.text}
                                                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                                                        rows={2}
                                                    />
                                                    <div className="flex items-center gap-4 pt-2">
                                                        <div className="flex-1">
                                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Scoring Importance</p>
                                                            <select 
                                                                id={`weight-${q.id}`}
                                                                title="Question Weight"
                                                                defaultValue={q.weight}
                                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                                                            >
                                                                {weights.map(w => <option key={w} value={w}>{w}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Question Scope</p>
                                                            <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500">
                                                                Domain Reference: {domain.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start justify-between gap-6 pr-10">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                                q.weight === 'Critical' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                                q.weight === 'High' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                                                'bg-slate-50 border-slate-200 text-slate-500'
                                                            }`}>
                                                                {q.weight}
                                                            </span>
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{q.id}</span>
                                                        </div>
                                                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.text}</p>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-1 opacity-0 group-hover/q:opacity-100 transition-all absolute top-4 right-4">
                                                        <button 
                                                            onClick={() => setEditingQuestion(q.id)}
                                                            title="Edit Question"
                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            disabled={saving === q.id}
                                                            onClick={() => handleDeleteQuestion(q.id)}
                                                            title="Delete Question"
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                {addingToDomain === domain.id ? (
                                    <div className="bg-indigo-50/50 rounded-xl border-2 border-dashed border-indigo-200 p-6 animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600">New Assessment Question</h4>
                                            <button 
                                                onClick={() => setAddingToDomain(null)}
                                                className="text-[10px] font-bold text-slate-500 hover:text-slate-900"
                                            >
                                                Discard
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <textarea 
                                                id={`new-text-${domain.id}`}
                                                placeholder="Enter the readiness question text here..."
                                                className="w-full p-4 rounded-xl border border-indigo-100 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                                                rows={2}
                                            />
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <select 
                                                        id={`new-weight-${domain.id}`}
                                                        title="New Question Weight"
                                                        className="w-full px-3 py-2 rounded-lg border border-indigo-100 text-xs font-bold text-slate-700 bg-white"
                                                    >
                                                        {weights.map(w => <option key={w} value={w}>{w}</option>)}
                                                    </select>
                                                </div>
                                                <button 
                                                    disabled={saving === `new-${domain.id}`}
                                                    onClick={() => handleAddQuestion(domain.id)}
                                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"
                                                >
                                                    {saving === `new-${domain.id}` ? 'Adding...' : <><Plus className="w-3.5 h-3.5" /> Add to Matrix</>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setAddingToDomain(domain.id)}
                                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                                    >
                                        <Plus className="w-4 h-4" /> Add Question to {domain.name}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                <HelpCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="text-sm text-amber-900 leading-relaxed font-medium">
                    <p className="font-bold mb-1">Impact Analysis</p>
                    Changes to questions or weights will be reflected in all **NEW** assessments. Historical assessments will retain their original data for audit integrity.
                </div>
            </div>
        </div>
    )
}
