export interface Recommendation {
    domain: string;
    score: number;
    status: 'CRITICAL' | 'STABLE' | 'OPTIMIZED';
    finding: string;
    action: string;
}

export function generateRecommendations(assessment: any): Recommendation[] {
    const domains = [
        { key: 'scoreStrategy', label: 'AI Strategy' },
        { key: 'scoreData', label: 'Data Readiness' },
        { key: 'scoreTech', label: 'Technical Infrastructure' },
        { key: 'scoreSecurity', label: 'Cybersecurity & Risk' },
        { key: 'scoreSkills', label: 'Talent & Skills' },
        { key: 'scoreOps', label: 'Operational Processes' },
        { key: 'scoreGovernance', label: 'Compliance & Governance' },
        { key: 'scoreFinancial', label: 'Financial Commitment' },
    ]

    const recommendations: Recommendation[] = []

    domains.forEach(d => {
        const score = assessment[d.key] || 0
        let status: Recommendation['status'] = 'STABLE'
        let finding = ""
        let action = ""

        if (score < 2.5) {
            status = 'CRITICAL'
            switch (d.label) {
                case 'AI Strategy':
                    finding = "Absence of a formalized AI roadmap is leading to fragmented pilot projects without business alignment."
                    action = "Establish an Executive AI Steering Committee to define 3-year strategic objectives."
                    break;
                case 'Data Readiness':
                    finding = "Data silos and lack of standardized ingestion protocols are blocking model training scalability."
                    action = "Implement a centralized Data Lakehouse architecture with automated ETL pipelines."
                    break;
                case 'Technical Infrastructure':
                    finding = "Legacy on-premise hardware lacks the GPU/TPU capacity required for modern LLM fine-tuning."
                    action = "Migrate to a hybrid cloud environment with dedicated AI acceleration clusters."
                    break;
                case 'Cybersecurity & Risk':
                    finding = "Unsecured shadow AI usage presents significant data leakage and IP theft risks."
                    action = "Deploy an enterprise-grade AI Gateway to monitor and govern all prompt/response traffic."
                    break;
                case 'Talent & Skills':
                    finding = "Critical shortage of Data Engineers and prompt engineering expertise is stalling execution."
                    action = "Launch an internal 'AI Champions' program and establish a recruitment pipeline for AI specialists."
                    break;
                case 'Operational Processes':
                    finding = "Current change management processes do not account for the iterative nature of AI deployment."
                    action = "Introduce MLOps lifecycle management to automate model monitoring and retraining."
                    break;
                case 'Compliance & Governance':
                    finding = "Non-compliance with emerging EU AI Act requirements could lead to significant legal exposure."
                    action = "Perform an AI Ethics Audit and implement automated bias detection for existing models."
                    break;
                case 'Financial Commitment':
                    finding = "Ad-hoc budgeting is preventing long-term R&D investments and talent retention."
                    action = "Transition to a multi-year 'AI-First' budget model with dedicated innovation funds."
                    break;
            }
        } else if (score < 4) {
            status = 'STABLE'
            finding = "Foundational capabilities are present but lack enterprise-wide integration and optimization."
            action = "Focus on standardizing workflows and scaling successful pilots to other departments."
        } else {
            status = 'OPTIMIZED'
            finding = "Leading-edge maturity in this domain. Processes are automated and AI-driven."
            action = "Explore autonomous agents and multi-modal AI architectures to maintain competitive advantage."
        }

        recommendations.push({ domain: d.label, score, status, finding, action })
    })

    return recommendations
}
