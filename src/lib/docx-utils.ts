import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    HeadingLevel, 
    Table, 
    TableRow, 
    TableCell, 
    WidthType, 
    BorderStyle,
    AlignmentType,
    Footer,
    Header,
} from 'docx';
import { lexer } from 'marked';

/**
 * Converts a Markdown string into a docx Document object.
 * This is a customized converter for UniSystems consulting deliverables.
 */
export async function convertMarkdownToDocx(title: string, markdown: string): Promise<Buffer> {
    const tokens = lexer(markdown);
    const sections: any[] = [];

    // UniSystems Color Palette
    const COLORS = {
        PRIMARY: '1e40af', // blue-800
        SECONDARY: '475569', // slate-600
        ACCENT: '4f46e5', // indigo-600
        TEXT: '1e293b', // slate-800
        BORDER: 'e2e8f0', // slate-200
    };

    const children: any[] = [];

    // Header 
    children.push(
        new Paragraph({
            text: title.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 400 },
        })
    );

    for (const token of tokens) {
        switch (token.type) {
            case 'heading': {
                const level = token.depth === 1 ? HeadingLevel.HEADING_1 : 
                             token.depth === 2 ? HeadingLevel.HEADING_2 : 
                             HeadingLevel.HEADING_3;
                children.push(
                    new Paragraph({
                        text: token.text,
                        heading: level,
                        spacing: { before: 240, after: 120 },
                    })
                );
                break;
            }
            case 'paragraph': {
                children.push(
                    new Paragraph({
                        children: [new TextRun({ text: token.text, size: 22 })],
                        spacing: { before: 120, after: 120 },
                    })
                );
                break;
            }
            case 'list': {
                token.items.forEach((item: any) => {
                    children.push(
                        new Paragraph({
                            text: item.text,
                            bullet: { level: 0 },
                            spacing: { before: 80, after: 80 },
                        })
                    );
                });
                break;
            }
            case 'table': {
                const rows = [
                    new TableRow({
                        children: token.header.map((cell: any) => new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: cell.text, bold: true })] })],
                            shading: { fill: 'f1f5f9' },
                        })),
                    }),
                    ...token.rows.map((row: any) => new TableRow({
                        children: row.map((cell: any) => new TableCell({
                            children: [new Paragraph({ text: cell.text })],
                        })),
                    })),
                ];
                children.push(
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: rows,
                        margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    })
                );
                break;
            }
            case 'hr': {
                children.push(
                    new Paragraph({
                        border: { bottom: { color: COLORS.BORDER, space: 1, style: BorderStyle.SINGLE, size: 6 } },
                        spacing: { before: 200, after: 200 },
                    })
                );
                break;
            }
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ 
                                    text: "UniSystems AI Consulting Platform | Confidential", 
                                    color: COLORS.SECONDARY,
                                    size: 16,
                                    bold: true
                                })
                            ],
                            alignment: AlignmentType.RIGHT
                        })
                    ]
                })
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ 
                                    text: `© ${new Date().getFullYear()} UniSystems. Generated Strategic Deliverable.`, 
                                    color: COLORS.SECONDARY,
                                    size: 16
                                })
                            ],
                            alignment: AlignmentType.CENTER
                        })
                    ]
                })
            },
            children: children,
        }],
    });

    return await Packer.toBuffer(doc);
}
