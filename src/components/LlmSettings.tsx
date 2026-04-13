'use client'

import { useState, useEffect, useTransition } from 'react'
import {
    Cpu, Key, Globe, Zap, CheckCircle2, AlertTriangle,
    Save, RotateCcw, Loader2, TestTube2, Info,
} from 'lucide-react'
import {
    type LlmConfig, type LlmProvider,
    LLM_SETTINGS_KEY, DEFAULT_CONFIG, DEFAULT_MODELS, PROVIDER_LABELS,
    loadLlmConfig, saveLlmConfig,
} from '@/lib/llm-config'
import { testLlmConnection } from '@/app/llm-actions'

// ── Provider metadata ──────────────────────────────────────────────────────────
const PROVIDERS: { id: LlmProvider; label: string; description: string; color: string }[] = [
    { id: 'mock',         label: 'Dev Mode',        description: 'Keyword matching, no API key needed. Great for demos.', color: 'slate' },
    { id: 'openai',       label: 'OpenAI',          description: 'GPT-4o, GPT-4o-mini, o1, o3-mini…',                    color: 'emerald' },
    { id: 'azure-openai', label: 'Azure OpenAI',    description: 'Your organisation\'s Azure-hosted deployment.',         color: 'blue' },
    { id: 'anthropic',    label: 'Anthropic',       description: 'Claude Sonnet, Claude Opus…',                          color: 'amber' },
    { id: 'gemini',       label: 'Google Gemini',   description: 'Gemini 1.5 Flash, Pro, Ultra…',                        color: 'rose' },
    { id: 'ollama',       label: 'Ollama (local)',  description: 'Self-hosted models — no API key required.',             color: 'indigo' },
]

const COLOR_ACTIVE: Record<string, string> = {
    slate:   'bg-slate-700 text-white border-slate-700',
    emerald: 'bg-emerald-600 text-white border-emerald-600',
    blue:    'bg-blue-600 text-white border-blue-600',
    amber:   'bg-amber-500 text-white border-amber-500',
    rose:    'bg-rose-600 text-white border-rose-600',
    indigo:  'bg-indigo-600 text-white border-indigo-600',
}
const COLOR_INACTIVE = 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'

// ── Component ──────────────────────────────────────────────────────────────────
export default function LlmSettings() {
    const [config, setConfig] = useState<LlmConfig>(DEFAULT_CONFIG)
    const [saved, setSaved] = useState(false)
    const [testResult, setTestResult] = useState<
        null | { ok: true; model: string; latencyMs: number } | { ok: false; error: string }
    >(null)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        setConfig(loadLlmConfig())
    }, [])

    const update = (patch: Partial<LlmConfig>) => {
        setConfig(prev => ({ ...prev, ...patch }))
        setTestResult(null)
        setSaved(false)
    }

    const handleSave = () => {
        saveLlmConfig(config)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleReset = () => {
        saveLlmConfig(DEFAULT_CONFIG)
        setConfig(DEFAULT_CONFIG)
        setTestResult(null)
        setSaved(false)
    }

    const handleTest = () => {
        setTestResult(null)
        startTransition(async () => {
            const result = await testLlmConnection(config)
            setTestResult(result)
        })
    }

    const activeProvider = PROVIDERS.find(p => p.id === config.provider)!
    const needsApiKey = ['openai', 'azure-openai', 'anthropic', 'gemini'].includes(config.provider)
    const needsEndpoint = ['azure-openai', 'ollama'].includes(config.provider)
    const needsDeployment = config.provider === 'azure-openai'
    const isMock = config.provider === 'mock'

    return (
        <div className="space-y-6">

            {/* Info banner */}
            <div className="flex items-start gap-3 px-4 py-3.5 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                <div>
                    <span className="font-bold">Your API keys are stored locally in your browser only.</span>
                    {' '}They are never sent to any server except the LLM provider itself, and only when you run an analysis.
                </div>
            </div>

            {/* Provider selector */}
            <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                    LLM Provider
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PROVIDERS.map(p => {
                        const isActive = config.provider === p.id
                        const colorClass = isActive ? COLOR_ACTIVE[p.color] : COLOR_INACTIVE
                        return (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => update({ provider: p.id, apiKey: '', endpoint: '', model: '', deploymentName: '' })}
                                className={`text-left px-4 py-3 rounded-xl border transition-all ${colorClass}`}
                            >
                                <p className="text-xs font-black">{p.label}</p>
                                <p className={`text-[10px] mt-0.5 leading-snug ${isActive ? 'opacity-80' : 'text-slate-400'}`}>
                                    {p.description}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Dev Mode info card */}
            {isMock && (
                <div className="flex items-start gap-3 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <TestTube2 className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <div className="text-sm text-slate-600">
                        <span className="font-bold text-slate-800">Dev Mode active.</span>
                        {' '}The AI Intake will use keyword matching to extract scores and use cases — no API call is made.
                        This is ideal for demos and testing the application flow without spending API credits.
                        Switch to a real provider when you are ready to analyse actual meeting notes.
                    </div>
                </div>
            )}

            {/* Credential fields */}
            {!isMock && (
                <div className="space-y-4">
                    {needsEndpoint && (
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                {config.provider === 'azure-openai' ? 'Azure Endpoint' : 'Ollama Base URL'}
                                <span className="text-slate-400 font-normal ml-1">
                                    {config.provider === 'azure-openai'
                                        ? '(e.g. https://my-resource.openai.azure.com)'
                                        : '(default: http://localhost:11434)'}
                                </span>
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="url"
                                    value={config.endpoint ?? ''}
                                    onChange={e => update({ endpoint: e.target.value })}
                                    placeholder={config.provider === 'azure-openai' ? 'https://my-resource.openai.azure.com' : 'http://localhost:11434'}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-shadow"
                                />
                            </div>
                        </div>
                    )}

                    {needsApiKey && (
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                API Key
                            </label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    value={config.apiKey ?? ''}
                                    onChange={e => update({ apiKey: e.target.value })}
                                    placeholder="Paste your API key here…"
                                    autoComplete="off"
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-shadow font-mono"
                                />
                            </div>
                        </div>
                    )}

                    {needsDeployment && (
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                Deployment Name
                                <span className="text-slate-400 font-normal ml-1">(the name you gave the model in Azure)</span>
                            </label>
                            <div className="relative">
                                <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={config.deploymentName ?? ''}
                                    onChange={e => update({ deploymentName: e.target.value })}
                                    placeholder="e.g. gpt-4o-prod"
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-shadow"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">
                            Model
                            <span className="text-slate-400 font-normal ml-1">
                                (leave blank to use default: {DEFAULT_MODELS[config.provider] ?? '—'})
                            </span>
                        </label>
                        <div className="relative">
                            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={config.model ?? ''}
                                onChange={e => update({ model: e.target.value })}
                                placeholder={DEFAULT_MODELS[config.provider] ?? ''}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-shadow font-mono"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Test result */}
            {testResult && (
                <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm ${
                    testResult.ok
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                    {testResult.ok
                        ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                        : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                    }
                    <div>
                        {testResult.ok
                            ? <><span className="font-bold">Connected</span> · model <code className="font-mono text-xs">{testResult.model}</code> · {testResult.latencyMs}ms</>
                            : <><span className="font-bold">Connection failed:</span> {testResult.error}</>
                        }
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                    {saved
                        ? <><CheckCircle2 className="w-4 h-4" /> Saved</>
                        : <><Save className="w-4 h-4" /> Save Settings</>
                    }
                </button>

                <button
                    type="button"
                    onClick={handleTest}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
                >
                    {isPending
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Testing…</>
                        : <><TestTube2 className="w-4 h-4" /> Test Connection</>
                    }
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    className="ml-auto flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-rose-500 transition-colors"
                >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset to Mock
                </button>
            </div>

            {/* Current status footer */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <div className={`w-2 h-2 rounded-full ${isMock ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="font-bold">
                    {isMock ? 'Dev Mode (Mock)' : `${PROVIDER_LABELS[config.provider]} · ${config.model || DEFAULT_MODELS[config.provider]}`}
                </span>
                <span className="text-slate-400">— stored in your browser only</span>
            </div>
        </div>
    )
}
