import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    Footer,
    Header,
    PageBreak,
    ShadingType,
    VerticalAlign,
    TableLayoutType,
    convertInchesToTwip,
} from 'docx';
import { lexer } from 'marked';

// ─── Per-Deliverable Metadata ─────────────────────────────────────────────────

interface DeliverableMeta {
    coverTitle: string
    coverSubtitle: string
    category: string
    headerDocTitle: string
}

const DELIVERABLE_META: Record<string, DeliverableMeta> = {
    readiness_report:       { coverTitle: 'AI Readiness Assessment Report',                   coverSubtitle: 'Discovery & Readiness Assessment — Phase 1', category: 'Consulting Assessment',   headerDocTitle: 'AI Readiness Assessment Report' },
    adoption_roadmap_v1:    { coverTitle: 'Strategic AI Adoption Roadmap',                    coverSubtitle: 'Initial Roadmap — Phase 1',                  category: 'Strategic Planning',      headerDocTitle: 'Strategic AI Adoption Roadmap' },
    usecase_catalogue:      { coverTitle: 'Prioritised AI Use Case Catalogue',                coverSubtitle: 'Use Case Discovery & Strategy Alignment — Phase 2', category: 'Strategic Deliverable', headerDocTitle: 'AI Use Case Catalogue' },
    roi_analysis:           { coverTitle: 'Business Case & ROI Analysis',                    coverSubtitle: 'Investment Justification & Value Modelling — Phase 2', category: 'Financial Analysis', headerDocTitle: 'ROI Analysis' },
    adoption_roadmap_v2:    { coverTitle: 'Integrated AI Adoption Roadmap (Version 2.0)',     coverSubtitle: 'Refined Roadmap & Pilot Planning — Phase 2', category: 'Strategic Planning',      headerDocTitle: 'AI Adoption Roadmap v2.0' },
    pov_results_report:     { coverTitle: 'Proof of Value — Performance Report',             coverSubtitle: 'PoV Pilot Validation & Results — Phase 3',   category: 'Pilot Assessment Report', headerDocTitle: 'PoV Performance Report' },
    solution_governance_plan: { coverTitle: 'Refined Solution Design & Governance Plan',     coverSubtitle: 'Technical Architecture & AI Governance — Phase 3', category: 'Technical Design',  headerDocTitle: 'Solution Design & Governance Plan' },
    gono_rollout_plan:      { coverTitle: 'Go/No-Go Decision & Enterprise Rollout Plan',     coverSubtitle: 'Deployment Decision Record — Phase 3',       category: 'Programme Governance',    headerDocTitle: 'Go/No-Go Rollout Plan' },
    rollout_checklist:      { coverTitle: 'Enterprise Rollout Readiness Checklist',          coverSubtitle: 'Pre-Deployment Governance & Validation — Phase 4', category: 'Operational Readiness', headerDocTitle: 'Rollout Readiness Checklist' },
    training_materials_repo: { coverTitle: 'Adoption & Training Materials Repository',       coverSubtitle: 'User Enablement & Change Management — Phase 4', category: 'Change Management',    headerDocTitle: 'Training Materials Repository' },
    adoption_status_report: { coverTitle: 'Enterprise Adoption Status Report',               coverSubtitle: 'Deployment Progress & Engagement Analysis — Phase 4', category: 'Progress Report', headerDocTitle: 'Adoption Status Report' },
    value_realization_report: { coverTitle: 'Enterprise Value Realization Report',           coverSubtitle: 'Business Impact & ROI Validation — Phase 5', category: 'Value Measurement',       headerDocTitle: 'Value Realization Report' },
    improvement_backlog:    { coverTitle: 'Continuous Improvement Backlog',                  coverSubtitle: 'Next-Phase Opportunities & Optimisation Plan — Phase 5', category: 'Strategic Planning', headerDocTitle: 'Improvement Backlog' },
    enterprise_agents_plan: { coverTitle: 'Enterprise Agentic AI Strategy Plan',            coverSubtitle: 'Autonomous AI Capability Roadmap — Phase 5', category: 'Strategic Vision',         headerDocTitle: 'Enterprise AI Agents Plan' },
}

function getMeta(key: string, fallback: string): DeliverableMeta {
    return DELIVERABLE_META[key] ?? {
        coverTitle: fallback,
        coverSubtitle: 'AI Consulting Deliverable',
        category: 'Consulting Deliverable',
        headerDocTitle: fallback,
    }
}

// ─── Color constants ──────────────────────────────────────────────────────────
const DARK_BLUE   = '1E3A5F'
const MID_BLUE    = '2B5BA8'
const GOLD        = 'C9A84C'
const LIGHT_GREY  = 'F1F5F9'
const MID_GREY    = '94A3B8'
const WHITE       = 'FFFFFF'
const BODY_TEXT   = '1E293B'
const RULE_GREY   = 'CBD5E1'

// ─── Helpers: inline markdown parsing ────────────────────────────────────────
function parseInline(rawText: string): TextRun[] {
    const text = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip links
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/)
    return parts.filter(Boolean).map(part => {
        if (part.startsWith('**') && part.endsWith('**'))
            return new TextRun({ text: part.slice(2, -2), bold: true, font: 'Calibri', size: 20, color: BODY_TEXT })
        if (part.startsWith('*') && part.endsWith('*'))
            return new TextRun({ text: part.slice(1, -1), italics: true, font: 'Calibri', size: 20, color: BODY_TEXT })
        if (part.startsWith('`') && part.endsWith('`'))
            return new TextRun({ text: part.slice(1, -1), font: 'Courier New', size: 18, color: '374151' })
        return new TextRun({ text: part, font: 'Calibri', size: 20, color: BODY_TEXT })
    })
}

// ─── Cover page builders ──────────────────────────────────────────────────────
function makeCoverPage(customerName: string, meta: DeliverableMeta, date: string): Paragraph[] {
    const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE, space: 0 }

    const metaRow = (label: string, value: string): TableRow =>
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, font: 'Calibri', color: DARK_BLUE })] })],
                    shading: { fill: LIGHT_GREY, type: ShadingType.SOLID, color: LIGHT_GREY },
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    verticalAlign: VerticalAlign.CENTER,
                    borders: { top: noBorder, bottom: { style: BorderStyle.SINGLE, color: RULE_GREY, size: 1, space: 0 }, left: noBorder, right: noBorder },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: value, size: 18, font: 'Calibri', color: BODY_TEXT })] })],
                    width: { size: 72, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    verticalAlign: VerticalAlign.CENTER,
                    borders: { top: noBorder, bottom: { style: BorderStyle.SINGLE, color: RULE_GREY, size: 1, space: 0 }, left: noBorder, right: noBorder },
                }),
            ],
        })

    const metaTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        rows: [
            metaRow('Document Type', meta.category),
            metaRow('Prepared For',  customerName),
            metaRow('Prepared By',   'UniSystems Consulting Team'),
            metaRow('Date',          date),
            metaRow('Version',       '1.0'),
            metaRow('Classification', 'Confidential — Not For Distribution'),
        ],
        borders: {
            top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
        },
    })

    return [
        // Banner row
        new Paragraph({
            children: [new TextRun({ text: 'UniSystems  |  AI Consulting Platform', bold: true, color: WHITE, size: 26, font: 'Calibri' })],
            alignment: AlignmentType.CENTER,
            shading: { type: ShadingType.SOLID, fill: DARK_BLUE, color: DARK_BLUE },
            spacing: { before: 0, after: 0, line: 560 },
        }),
        // Spacing
        new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after: 0, line: 480 } }),
        new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after: 0, line: 480 } }),
        new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after: 0, line: 480 } }),
        // Document title
        new Paragraph({
            children: [new TextRun({ text: meta.coverTitle, bold: true, color: DARK_BLUE, size: 52, font: 'Calibri' })],
            spacing: { before: 720, after: 200 },
        }),
        // Subtitle
        new Paragraph({
            children: [new TextRun({ text: meta.coverSubtitle, color: MID_BLUE, size: 26, font: 'Calibri', italics: true })],
            spacing: { before: 0, after: 560 },
        }),
        // Gold separator rule
        new Paragraph({
            children: [new TextRun('')],
            border: { bottom: { color: GOLD, style: BorderStyle.THICK, size: 8, space: 1 } },
            spacing: { before: 0, after: 480 },
        }),
        // Meta table injected inline — wrap as child is required as well
        // We convert the table object to inline by embedding it via a workaround:
        // Actually Table is a top-level child — return separately
        new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after: 0 } }),
        // Page break at end
        new Paragraph({ children: [new PageBreak()] }),
    ]
}

// ─── Body parser ─────────────────────────────────────────────────────────────
function buildBody(tokens: any[]): any[] {
    const children: any[] = []
    const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE, space: 0 }

    for (const token of tokens) {
        switch (token.type) {
            case 'heading': {
                if (token.depth === 1) {
                    children.push(new Paragraph({
                        children: [new TextRun({ text: (token.text as string).toUpperCase(), bold: true, color: DARK_BLUE, size: 28, font: 'Calibri' })],
                        spacing: { before: 480, after: 160 },
                        border: { bottom: { color: GOLD, style: BorderStyle.THICK, size: 6, space: 1 } },
                    }))
                } else if (token.depth === 2) {
                    children.push(new Paragraph({
                        children: [new TextRun({ text: token.text as string, bold: true, color: MID_BLUE, size: 24, font: 'Calibri' })],
                        spacing: { before: 360, after: 120 },
                    }))
                } else {
                    children.push(new Paragraph({
                        children: [new TextRun({ text: token.text as string, bold: true, color: BODY_TEXT, size: 22, font: 'Calibri' })],
                        spacing: { before: 240, after: 80 },
                    }))
                }
                break
            }
            case 'paragraph': {
                children.push(new Paragraph({
                    children: parseInline((token.text as string).replace(/\n/g, ' ')),
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { before: 100, after: 160, line: 276 },
                }))
                break
            }
            case 'list': {
                for (const item of token.items as any[]) {
                    const raw = (item.text as string).replace(/\n/g, ' ')
                    const boldPrefix = raw.match(/^\*\*(.+?)\*\*:?\s*(.*)/)
                    if (boldPrefix) {
                        children.push(new Paragraph({
                            children: [
                                new TextRun({ text: boldPrefix[1] + ': ', bold: true, font: 'Calibri', size: 20, color: DARK_BLUE }),
                                ...parseInline(boldPrefix[2] || ''),
                            ],
                            bullet: { level: 0 },
                            spacing: { before: 60, after: 60 },
                        }))
                    } else {
                        children.push(new Paragraph({
                            children: parseInline(raw),
                            bullet: { level: 0 },
                            spacing: { before: 60, after: 60 },
                        }))
                    }
                }
                break
            }
            case 'table': {
                const headerRow = new TableRow({
                    tableHeader: true,
                    children: (token.header as any[]).map(cell =>
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({ text: cell.text, bold: true, color: WHITE, size: 18, font: 'Calibri' })],
                                alignment: AlignmentType.LEFT,
                            })],
                            shading: { fill: DARK_BLUE, type: ShadingType.SOLID, color: DARK_BLUE },
                            margins: { top: 80, bottom: 80, left: 100, right: 100 },
                            verticalAlign: VerticalAlign.CENTER,
                            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
                        })
                    ),
                })

                const dataRows = (token.rows as any[][]).map((row, i) =>
                    new TableRow({
                        children: row.map(cell =>
                            new TableCell({
                                children: [new Paragraph({
                                    children: parseInline(cell.text),
                                })],
                                shading: i % 2 === 0
                                    ? { fill: WHITE, type: ShadingType.SOLID, color: WHITE }
                                    : { fill: LIGHT_GREY, type: ShadingType.SOLID, color: LIGHT_GREY },
                                margins: { top: 60, bottom: 60, left: 100, right: 100 },
                                verticalAlign: VerticalAlign.CENTER,
                                borders: {
                                    top: noBorder, bottom: { style: BorderStyle.SINGLE, color: RULE_GREY, size: 1, space: 0 },
                                    left: noBorder, right: noBorder,
                                },
                            })
                        ),
                    })
                )

                children.push(new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [headerRow, ...dataRows],
                    borders: {
                        top: { style: BorderStyle.SINGLE, color: RULE_GREY, size: 4, space: 0 },
                        bottom: { style: BorderStyle.SINGLE, color: RULE_GREY, size: 4, space: 0 },
                        left: noBorder, right: noBorder,
                    },
                }))
                children.push(new Paragraph({ children: [new TextRun('')], spacing: { after: 160 } }))
                break
            }
            case 'hr': {
                children.push(new Paragraph({
                    children: [new TextRun('')],
                    border: { bottom: { color: RULE_GREY, style: BorderStyle.SINGLE, size: 4, space: 1 } },
                    spacing: { before: 240, after: 240 },
                }))
                break
            }
            case 'blockquote':
            case 'code': {
                children.push(new Paragraph({
                    children: [new TextRun({ text: token.text as string, font: 'Courier New', size: 18, color: '374151', italics: token.type === 'blockquote' })],
                    shading: { fill: LIGHT_GREY, type: ShadingType.SOLID, color: LIGHT_GREY },
                    indent: { left: convertInchesToTwip(0.25), right: convertInchesToTwip(0.25) },
                    spacing: { before: 120, after: 120 },
                }))
                break
            }
            default:
                break
        }
    }
    return children
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function convertMarkdownToDocx(
    deliverableKey: string,
    customerName: string,
    markdown: string,
): Promise<Buffer> {
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    const meta = getMeta(deliverableKey, deliverableKey.replace(/_/g, ' '))

    // Parse markdown tokens; skip any leading H1 (it goes on the cover page)
    const allTokens = lexer(markdown)
    const bodyTokens = allTokens.filter((t, i) =>
        !(i === 0 && t.type === 'heading' && (t as any).depth === 1)
    )
    const bodyChildren = buildBody(bodyTokens)

    // Cover page
    const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE, space: 0 }
    const coverMeta = (label: string, value: string): TableRow =>
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, font: 'Calibri', color: DARK_BLUE })] })],
                    shading: { fill: LIGHT_GREY, type: ShadingType.SOLID, color: LIGHT_GREY },
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    verticalAlign: VerticalAlign.CENTER,
                    borders: { top: noBorder, bottom: { style: BorderStyle.SINGLE, color: RULE_GREY, size: 1, space: 0 }, left: noBorder, right: noBorder },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: value, size: 18, font: 'Calibri', color: BODY_TEXT })] })],
                    width: { size: 72, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    verticalAlign: VerticalAlign.CENTER,
                    borders: { top: noBorder, bottom: { style: BorderStyle.SINGLE, color: RULE_GREY, size: 1, space: 0 }, left: noBorder, right: noBorder },
                }),
            ],
        })

    const coverMetaTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        rows: [
            coverMeta('Document Type',   meta.category),
            coverMeta('Prepared For',    customerName),
            coverMeta('Prepared By',     'UniSystems Consulting Team'),
            coverMeta('Date',            date),
            coverMeta('Version',         '1.0'),
            coverMeta('Classification',  'Confidential — Not For Distribution'),
        ],
        borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
    })

    // Page header
    const pageHeader = new Header({
        children: [
            new Paragraph({
                children: [
                    new TextRun({ text: 'UniSystems  |  AI Consulting Platform', bold: true, color: DARK_BLUE, size: 16, font: 'Calibri' }),
                    new TextRun({ text: '     ' }),
                    new TextRun({ text: meta.headerDocTitle, color: MID_GREY, size: 16, font: 'Calibri', italics: true }),
                ],
                border: { bottom: { color: GOLD, style: BorderStyle.SINGLE, size: 4, space: 1 } },
                spacing: { after: 80 },
            }),
        ],
    })

    // Page footer — use SimpleField for page numbers (the reliable way)
    const pageFooter = new Footer({
        children: [
            new Paragraph({
                children: [
                    new TextRun({ text: `Confidential — Not For Distribution     `, color: MID_GREY, size: 14, font: 'Calibri' }),
                    new TextRun({ text: `     © ${new Date().getFullYear()} UniSystems`, color: MID_GREY, size: 14, font: 'Calibri' }),
                ],
                alignment: AlignmentType.CENTER,
                border: { top: { color: RULE_GREY, style: BorderStyle.SINGLE, size: 4, space: 1 } },
                spacing: { before: 80 },
            }),
        ],
    })

    const coverPageChildren: any[] = [
        // Banner
        new Paragraph({
            children: [new TextRun({ text: 'UniSystems  |  AI Consulting Platform', bold: true, color: WHITE, size: 26, font: 'Calibri' })],
            alignment: AlignmentType.CENTER,
            shading: { type: ShadingType.SOLID, fill: DARK_BLUE, color: DARK_BLUE },
            spacing: { before: 0, after: 0, line: 560 },
        }),
        new Paragraph({ children: [new TextRun('')], spacing: { line: 480 } }),
        new Paragraph({ children: [new TextRun('')], spacing: { line: 480 } }),
        new Paragraph({ children: [new TextRun('')], spacing: { line: 480 } }),
        // Title
        new Paragraph({
            children: [new TextRun({ text: meta.coverTitle, bold: true, color: DARK_BLUE, size: 52, font: 'Calibri' })],
            spacing: { before: 720, after: 200 },
        }),
        // Subtitle
        new Paragraph({
            children: [new TextRun({ text: meta.coverSubtitle, color: MID_BLUE, size: 26, italics: true, font: 'Calibri' })],
            spacing: { before: 0, after: 560 },
        }),
        // Gold rule
        new Paragraph({
            children: [new TextRun('')],
            border: { bottom: { color: GOLD, style: BorderStyle.THICK, size: 8, space: 1 } },
            spacing: { before: 0, after: 480 },
        }),
        // Meta table
        coverMetaTable,
        // Spacing
        new Paragraph({ children: [new TextRun('')], spacing: { line: 480 } }),
        new Paragraph({ children: [new TextRun('')], spacing: { line: 480 } }),
        // Page break
        new Paragraph({ children: [new PageBreak()] }),
    ]

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: convertInchesToTwip(0.5),
                            bottom: convertInchesToTwip(0.75),
                            left: convertInchesToTwip(1),
                            right: convertInchesToTwip(1),
                        },
                    },
                },
                children: coverPageChildren,
            },
            {
                properties: {
                    page: {
                        margin: {
                            top: convertInchesToTwip(1),
                            bottom: convertInchesToTwip(1),
                            left: convertInchesToTwip(1),
                            right: convertInchesToTwip(1),
                        },
                    },
                },
                headers: { default: pageHeader },
                footers: { default: pageFooter },
                children: bodyChildren,
            },
        ],
    })

    return await Packer.toBuffer(doc)
}
