import { getAnthropic } from './anthropic'
import type { ScanFindings, AIReport } from '@/types'

const SYSTEM_PROMPT = `You are a senior cybersecurity analyst reviewing website security scan results for small and medium businesses. Your job is to translate raw technical findings into clear, actionable guidance that a non-technical business owner can understand and act on.

For each finding, you must:
1. Explain what it means in plain English (no jargon)
2. Assign a severity: critical, high, medium, low, or info
3. Give a specific, practical fix recommendation

Severity guide:
- critical: Immediate risk of compromise or data breach
- high: Significant security weakness that should be fixed this week
- medium: Should be fixed in the next month
- low: Good practice, fix when convenient
- info: Informational only, no action required

Always return a valid JSON object with no markdown formatting.`

const USER_PROMPT_TEMPLATE = (findings: ScanFindings) => `
Analyze these security scan findings for the domain: ${findings.domain}
Scan timestamp: ${findings.scannedAt}

RAW FINDINGS:
${JSON.stringify(findings, null, 2)}

Return ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "overall_score": <number 0-100>,
  "summary": "<2-3 sentence plain-English overview of the security posture>",
  "findings": [
    {
      "id": "<unique kebab-case id>",
      "title": "<short title>",
      "explanation": "<plain English explanation>",
      "severity": "<critical|high|medium|low|info>",
      "recommendation": "<specific actionable fix>",
      "category": "<ssl|headers|exposure|cms|general>"
    }
  ]
}

Include a finding for every notable issue discovered, including positive findings at info level where appropriate.`

/**
 * Sends scan findings to Claude and returns a structured AI report.
 * Model: claude-sonnet-4-6 (Anthropic's latest Sonnet model)
 */
export async function generateAIReport(findings: ScanFindings): Promise<AIReport> {
  const message = await getAnthropic().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: USER_PROMPT_TEMPLATE(findings),
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API')
  }

  // Strip potential markdown code fences if model wraps response
  const raw = content.text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const parsed = JSON.parse(raw) as Omit<AIReport, 'generated_at'>

  return {
    ...parsed,
    generated_at: new Date().toISOString(),
  }
}
