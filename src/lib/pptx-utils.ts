import pptxgen from "pptxgenjs";

export interface PptxData {
    customerName: string;
    industry: string;
    currentPhase: number;
    assessment: any;
    useCases: any[];
}

export async function generateCustomerPptx(data: PptxData): Promise<Buffer> {
    const pptx = new pptxgen();

    // 1. Title Slide
    let slide1 = pptx.addSlide();
    slide1.background = { fill: "F1F5F9" };
    slide1.addText("Strategic AI Roadmap & Readiness Analysis", {
        x: 0.5, y: 1.5, w: "90%", h: 1,
        fontSize: 36, bold: true, color: "0F172A", align: "center", fontFace: "Arial"
    });
    slide1.addText(`Prepared for: ${data.customerName}`, {
        x: 0.5, y: 2.5, w: "90%", h: 0.5,
        fontSize: 24, color: "475569", align: "center"
    });
    slide1.addText(`Date: ${new Date().toLocaleDateString()}`, {
        x: 0.5, y: 4.5, w: "90%", h: 0.3,
        fontSize: 14, color: "64748B", align: "center"
    });

    // 2. Executive Summary / Roadmap Overview
    let slide2 = pptx.addSlide();
    slide2.addText("Executive Summary: The AI Journey", { 
        x: 0.5, y: 0.3, w: "90%", h: 0.5, fontSize: 24, bold: true, 
        color: "0F172A"
    });
    // Visual underline
    slide2.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.8, w: 9, h: 0.01, fill: { color: "CBD5E1" } });

    slide2.addText(`Current Engagement Phase: Phase ${data.currentPhase}`, { x: 0.5, y: 1.2, fontSize: 18, bold: true, color: "2563EB" });
    
    const roadmapSteps = [
        { n: "1", t: "Discovery", d: "Assess technical & cultural readiness" },
        { n: "2", t: "Strategy", d: "Identify & prioritize AI use cases" },
        { n: "3", t: "Execution", d: "Pilot PoVs and validate ROI" },
        { n: "4", t: "Adoption", d: "Change management & scaling" },
        { n: "5", t: "Value", d: "Realize ROI & continuous optimization" }
    ];

    roadmapSteps.forEach((step, i) => {
        const isCurrent = (i + 1) === data.currentPhase;
        const color = isCurrent ? "2563EB" : "64748B";
        const bg = isCurrent ? "EFF6FF" : "F8FAFC";
        
        slide2.addShape(pptx.ShapeType.rect, { x: 0.5 + (i * 1.8), y: 2.5, w: 1.7, h: 2.5, fill: { color: bg }, line: { color: color, width: 1 } });
        slide2.addText(step.n, { x: 0.6 + (i * 1.8), y: 2.7, w: 1.5, fontSize: 28, bold: true, color: color });
        slide2.addText(step.t, { x: 0.6 + (i * 1.8), y: 3.3, w: 1.5, fontSize: 13, bold: true, color: "0F172A" });
        slide2.addText(step.d, { x: 0.6 + (i * 1.8), y: 3.8, w: 1.5, fontSize: 9, color: "475569" });
    });

    // 3. Readiness Assessment Summary
    if (data.assessment) {
        let slide3 = pptx.addSlide();
        slide3.addText("Baseline Readiness Assessment", { x: 0.5, y: 0.3, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "0F172A" });
        slide3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.8, w: 9, h: 0.01, fill: { color: "CBD5E1" } });

        const domains = [
            { label: "Strategy", val: data.assessment.scoreStrategy },
            { label: "Data", val: data.assessment.scoreData },
            { label: "Tech", val: data.assessment.scoreTech },
            { label: "Security", val: data.assessment.scoreSecurity },
            { label: "Skills", val: data.assessment.scoreSkills },
            { label: "Ops", val: data.assessment.scoreOps },
            { label: "Governance", val: data.assessment.scoreGovernance },
            { label: "Financial", val: data.assessment.scoreFinancial }
        ];

        domains.forEach((d, i) => {
            const y = 1.2 + (i * 0.5);
            const score = d.val || 0;
            const barW = (score / 5) * 6;
            slide3.addText(d.label, { x: 0.5, y: y, w: 2, fontSize: 12, bold: true });
            slide3.addShape(pptx.ShapeType.rect, { x: 2.5, y: y + 0.1, w: 6, h: 0.2, fill: { color: "F1F5F9" } });
            slide3.addShape(pptx.ShapeType.rect, { x: 2.5, y: y + 0.1, w: Math.max(0.1, barW), h: 0.2, fill: { color: "4F46E5" } });
            slide3.addText(score.toFixed(1), { x: 2.6 + barW, y: y, w: 1, fontSize: 10, color: "475569" });
        });
    }

    // 4. Identified AI Use Cases
    if (data.useCases && data.useCases.length > 0) {
        let slide4 = pptx.addSlide();
        slide4.addText("Prioritized AI Backlog", { x: 0.5, y: 0.3, w: "90%", h: 0.5, fontSize: 24, bold: true, color: "0F172A" });
        slide4.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.8, w: 9, h: 0.01, fill: { color: "CBD5E1" } });

        const topUseCases = data.useCases.slice(0, 4);
        topUseCases.forEach((uc, i) => {
            const y = 1.2 + (i * 1.0);
            slide4.addShape(pptx.ShapeType.rect, { x: 0.5, y: y, w: 9, h: 0.8, fill: { color: "F8FAFC" }, line: { color: "E2E8F0", width: 1 } });
            slide4.addText(uc.title, { x: 0.7, y: y + 0.1, w: 6, fontSize: 14, bold: true, color: "0F172A" });
            slide4.addText(uc.description, { x: 0.7, y: y + 0.35, w: 6, fontSize: 10, color: "475569", italic: true });
            slide4.addText(`ROI: $${(uc.roiEstimate || 0).toLocaleString()}`, { x: 7.5, y: y + 0.1, w: 2, fontSize: 12, bold: true, color: "059669" });
            slide4.addText(uc.priority, { x: 7.5, y: y + 0.35, w: 2, fontSize: 10, bold: true, color: "2563EB" });
        });
    }

    // 5. Closing Slide
    let slideFinal = pptx.addSlide();
    slideFinal.background = { fill: "0F172A" };
    slideFinal.addText("Next Steps: Accelerating to Phase 3", {
        x: 0.5, y: 2.0, w: "90%", h: 1,
        fontSize: 32, bold: true, color: "FFFFFF", align: "center"
    });
    slideFinal.addText("Contact your account lead to begin Pilot execution.", {
        x: 0.5, y: 3.5, w: "90%", h: 0.5,
        fontSize: 16, color: "94A3B8", align: "center"
    });

    const result = await pptx.write({ outputType: "nodebuffer" });
    return result as Buffer;
}
