import type { LlmConfig } from './llm-config'
import { DEFAULT_MODELS } from './llm-config'

export interface IntakeResults {
    readinessScores: Record<string, number>;
    useCases: Array<{
        title: string;
        description: string;
        department: string;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        roiEstimate: number;
    }>;
    sentimentSummary: string;
}

// ── Prompt ─────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a senior AI strategy consultant. Analyse the meeting notes provided and extract structured intelligence about the client's AI readiness and opportunities.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "readinessScores": {
    "Strategy": 0.0,
    "Data": 0.0,
    "Tech": 0.0,
    "Security": 0.0,
    "Skills": 0.0,
    "Ops": 0.0,
    "Governance": 0.0,
    "Financial": 0.0
  },
  "useCases": [
    {
      "title": "string",
      "description": "string — one to two sentences",
      "department": "string",
      "priority": "HIGH | MEDIUM | LOW",
      "roiEstimate": 0
    }
  ],
  "sentimentSummary": "string — one to two sentences"
}

Rules:
- Include ONLY the domains that are clearly evidenced in the notes. Omit domains with no evidence.
- Score scale: 1.0 = no capability, 2.5 = basic/informal, 4.0 = systematic, 5.0 = leading-edge/automated.
- Include up to 5 use cases that are explicitly mentioned or strongly implied.
- roiEstimate is the estimated annual EUR value (realistic range €25 000 – €1 000 000). Use 0 if unknown.
- sentimentSummary describes the client's overall AI maturity posture and appetite.
- Never invent data that is not present in or implied by the notes.`

// ── Public entry point ──────────────────────────────────────────────────────────
export async function analyzeMeetingNotes(
    notes: string,
    config?: LlmConfig
): Promise<IntakeResults> {
    const provider = config?.provider ?? 'mock'

    if (provider === 'mock') {
        return await mockAnalyze(notes)
    }

    try {
        return await llmAnalyze(notes, config!)
    } catch (err) {
        console.error('[ai-intake] LLM call failed, falling back to mock:', err)
        // Surface the error message so the UI can show a warning
        const result = await mockAnalyze(notes)
        result.sentimentSummary =
            `⚠ LLM call failed (${err instanceof Error ? err.message : 'unknown error'}). ` +
            `Showing keyword-match fallback. Check your LLM settings.`
        return result
    }
}

// ── Real LLM router ─────────────────────────────────────────────────────────────
async function llmAnalyze(notes: string, config: LlmConfig): Promise<IntakeResults> {
    switch (config.provider) {
        case 'openai':
            return await callOpenAiCompatible(
                'https://api.openai.com/v1/chat/completions',
                `Bearer ${config.apiKey}`,
                config.model ?? DEFAULT_MODELS.openai,
                notes
            )

        case 'azure-openai': {
            const base = (config.endpoint ?? '').replace(/\/$/, '')
            const deployment = config.deploymentName ?? config.model ?? 'gpt-4o'
            const url = `${base}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-01`
            return await callOpenAiCompatible(url, config.apiKey!, undefined, notes, 'api-key')
        }

        case 'ollama': {
            const base = (config.endpoint ?? 'http://localhost:11434').replace(/\/$/, '')
            return await callOpenAiCompatible(
                `${base}/v1/chat/completions`,
                'none',
                config.model ?? DEFAULT_MODELS.ollama,
                notes
            )
        }

        case 'anthropic':
            return await callAnthropic(config, notes)

        case 'gemini':
            return await callGemini(config, notes)

        default:
            throw new Error(`Unsupported provider: ${config.provider}`)
    }
}

// ── Provider implementations ────────────────────────────────────────────────────

/** Shared implementation for OpenAI, Azure OpenAI, and Ollama (all use same schema) */
async function callOpenAiCompatible(
    url: string,
    authValue: string,   // "Bearer sk-..." or the raw Azure API key
    model: string | undefined,
    notes: string,
    authHeader = 'Authorization'
): Promise<IntakeResults> {
    const body: Record<string, unknown> = {
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: notes },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
    }
    if (model) body.model = model

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [authHeader]: authValue,
        },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
    }

    const data = await res.json()
    const content: string = data.choices?.[0]?.message?.content ?? ''
    return parseJson(content)
}

async function callAnthropic(config: LlmConfig, notes: string): Promise<IntakeResults> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey!,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: config.model ?? DEFAULT_MODELS.anthropic,
            max_tokens: 2048,
            messages: [
                {
                    role: 'user',
                    content: `${SYSTEM_PROMPT}\n\nMeeting Notes:\n${notes}`,
                },
            ],
        }),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
    }

    const data = await res.json()
    const content: string = data.content?.[0]?.text ?? ''
    return parseJson(content)
}

async function callGemini(config: LlmConfig, notes: string): Promise<IntakeResults> {
    const model = config.model ?? DEFAULT_MODELS.gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: `${SYSTEM_PROMPT}\n\nMeeting Notes:\n${notes}` },
                    ],
                },
            ],
            generationConfig: { responseMimeType: 'application/json' },
        }),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
    }

    const data = await res.json()
    const content: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return parseJson(content)
}

// ── JSON parser — robust against markdown code fences ───────────────────────────
function parseJson(raw: string): IntakeResults {
    // Strip optional ```json ... ``` wrapper
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
        readinessScores: parsed.readinessScores ?? {},
        useCases: parsed.useCases ?? [],
        sentimentSummary: parsed.sentimentSummary ?? '',
    }
}

// ── Mock (keyword-matching, dev mode) ──────────────────────────────────────────
async function mockAnalyze(notes: string): Promise<IntakeResults> {
    await new Promise(resolve => setTimeout(resolve, 1800))

    const lc = notes.toLowerCase()
    const results: IntakeResults = {
        readinessScores: {},
        useCases: [],
        sentimentSummary:
            'The client appears committed to AI transformation but is currently hampered by ' +
            'significant data silos and a lack of internal technical baseline. Executive sponsorship ' +
            'is present but requires a more formalised roadmap to align with business objectives.',
    }

    if (lc.includes('customer') || lc.includes('support'))
        results.useCases.push({ title: 'AI-Enhanced Customer Support Portal', description: 'Automated resolution of Tier-1 support tickets using vectorised knowledge bases.', department: 'Customer Service', priority: 'HIGH', roiEstimate: 120000 })

    if (lc.includes('invoice') || lc.includes('finance') || lc.includes('billing'))
        results.useCases.push({ title: 'Intelligent Invoice Processing', description: 'Automated data extraction and validation for accounts payable workflows.', department: 'Finance', priority: 'HIGH', roiEstimate: 85000 })

    if (lc.includes('marketing') || lc.includes('content') || lc.includes('social'))
        results.useCases.push({ title: 'Generative Content Factory', description: 'AI-assisted creation of multi-channel marketing copy and social assets.', department: 'Marketing', priority: 'MEDIUM', roiEstimate: 45000 })

    if (lc.includes('executive') || lc.includes('champion') || lc.includes('vision') || lc.includes('ceo'))
        results.readinessScores.Strategy = 4.0
    if (lc.includes('legacy') || lc.includes('old') || lc.includes('on-prem') || lc.includes('architecture'))
        results.readinessScores.Tech = 1.5
    if (lc.includes('clean') || lc.includes('cloud') || lc.includes('snowflake') || lc.includes('databricks') || lc.includes('silos'))
        results.readinessScores.Data = 4.5
    if (lc.includes('security') || lc.includes('risk') || lc.includes('compliance'))
        results.readinessScores.Security = 2.0
    if (lc.includes('skills') || lc.includes('training') || lc.includes('talent'))
        results.readinessScores.Skills = 1.8
    if (lc.includes('ops') || lc.includes('operations') || lc.includes('workflow'))
        results.readinessScores.Ops = 2.3
    if (lc.includes('governance') || lc.includes('policy') || lc.includes('standards'))
        results.readinessScores.Governance = 3.2
    if (lc.includes('finance') || lc.includes('budget') || lc.includes('cost'))
        results.readinessScores.Financial = 2.8

    return results
}
