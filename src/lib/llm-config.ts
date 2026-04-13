/**
 * LLM Provider Configuration
 *
 * API keys are stored ONLY in browser localStorage — they are never written to
 * the database or filesystem. When a real LLM call is needed, the client reads
 * the config from localStorage and passes it as a plain parameter to the server
 * action, which uses it in-memory for that request only.
 */

export type LlmProvider =
    | 'mock'          // keyword-matching, no API call (always works, good for demos)
    | 'openai'        // OpenAI Chat Completions  (api.openai.com)
    | 'azure-openai'  // Azure OpenAI Service     (your-resource.openai.azure.com)
    | 'anthropic'     // Anthropic Claude         (api.anthropic.com)
    | 'gemini'        // Google Gemini            (generativelanguage.googleapis.com)
    | 'ollama'        // Ollama (local)           (localhost:11434, OpenAI-compatible)

export interface LlmConfig {
    provider: LlmProvider
    apiKey?: string        // OpenAI / Azure / Anthropic / Gemini
    endpoint?: string      // Azure base URL  (e.g. https://my-resource.openai.azure.com)
                           // or Ollama base URL (e.g. http://localhost:11434)
    model?: string         // model override (default per provider shown below)
    deploymentName?: string // Azure OpenAI deployment name
}

/** Default model per provider when the user leaves the field blank */
export const DEFAULT_MODELS: Record<LlmProvider, string> = {
    mock:           '—',
    openai:         'gpt-4o-mini',
    'azure-openai': 'gpt-4o',
    anthropic:      'claude-sonnet-4-6',
    gemini:         'gemini-1.5-flash',
    ollama:         'llama3.2',
}

export const PROVIDER_LABELS: Record<LlmProvider, string> = {
    mock:           'Dev Mode (Mock)',
    openai:         'OpenAI',
    'azure-openai': 'Azure OpenAI',
    anthropic:      'Anthropic Claude',
    gemini:         'Google Gemini',
    ollama:         'Ollama (local)',
}

export const LLM_SETTINGS_KEY = 'ai_consulting_llm_settings'

export const DEFAULT_CONFIG: LlmConfig = { provider: 'mock' }

export function loadLlmConfig(): LlmConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG
    try {
        const raw = localStorage.getItem(LLM_SETTINGS_KEY)
        if (!raw) return DEFAULT_CONFIG
        return JSON.parse(raw) as LlmConfig
    } catch {
        return DEFAULT_CONFIG
    }
}

export function saveLlmConfig(config: LlmConfig): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(LLM_SETTINGS_KEY, JSON.stringify(config))
}
