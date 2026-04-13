'use server'

import type { LlmConfig } from '@/lib/llm-config'
import { DEFAULT_MODELS } from '@/lib/llm-config'

export type TestResult =
    | { ok: true; model: string; latencyMs: number }
    | { ok: false; error: string }

/**
 * Sends a minimal "ping" prompt to the configured LLM provider.
 * Returns success + latency on success, or an error message on failure.
 * API keys are never stored — they are used in-memory only for this call.
 */
export async function testLlmConnection(config: LlmConfig): Promise<TestResult> {
    if (config.provider === 'mock') {
        await new Promise(r => setTimeout(r, 300))
        return { ok: true, model: 'mock', latencyMs: 300 }
    }

    const start = Date.now()
    const ping = 'Reply with the single word: pong'

    try {
        switch (config.provider) {
            case 'openai': {
                const model = config.model ?? DEFAULT_MODELS.openai
                const res = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
                    body: JSON.stringify({ model, messages: [{ role: 'user', content: ping }], max_tokens: 5 }),
                })
                if (!res.ok) throw new Error((await res.json())?.error?.message ?? `HTTP ${res.status}`)
                return { ok: true, model, latencyMs: Date.now() - start }
            }

            case 'azure-openai': {
                const base = (config.endpoint ?? '').replace(/\/$/, '')
                const deployment = config.deploymentName ?? config.model ?? 'gpt-4o'
                const url = `${base}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-01`
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'api-key': config.apiKey! },
                    body: JSON.stringify({ messages: [{ role: 'user', content: ping }], max_tokens: 5 }),
                })
                if (!res.ok) throw new Error((await res.json())?.error?.message ?? `HTTP ${res.status}`)
                return { ok: true, model: deployment, latencyMs: Date.now() - start }
            }

            case 'anthropic': {
                const model = config.model ?? DEFAULT_MODELS.anthropic
                const res = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': config.apiKey!,
                        'anthropic-version': '2023-06-01',
                    },
                    body: JSON.stringify({ model, max_tokens: 5, messages: [{ role: 'user', content: ping }] }),
                })
                if (!res.ok) throw new Error((await res.json())?.error?.message ?? `HTTP ${res.status}`)
                return { ok: true, model, latencyMs: Date.now() - start }
            }

            case 'gemini': {
                const model = config.model ?? DEFAULT_MODELS.gemini
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: ping }] }] }),
                })
                if (!res.ok) throw new Error((await res.json())?.error?.message ?? `HTTP ${res.status}`)
                return { ok: true, model, latencyMs: Date.now() - start }
            }

            case 'ollama': {
                const base = (config.endpoint ?? 'http://localhost:11434').replace(/\/$/, '')
                const model = config.model ?? DEFAULT_MODELS.ollama
                const res = await fetch(`${base}/v1/chat/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer none' },
                    body: JSON.stringify({ model, messages: [{ role: 'user', content: ping }], max_tokens: 5 }),
                })
                if (!res.ok) throw new Error(`HTTP ${res.status} — is Ollama running?`)
                return { ok: true, model, latencyMs: Date.now() - start }
            }

            default:
                throw new Error(`Unknown provider: ${(config as LlmConfig).provider}`)
        }
    } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
    }
}
