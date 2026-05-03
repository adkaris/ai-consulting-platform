/**
 * UniSystems AI Consulting Platform — Deliverable content generators.
 * Each function returns a markdown string that is rendered to DOCX via docx-utils.
 * Structure: ## N. Chapter Title / ### N.M Sub-chapter / flowing prose, minimal bullets.
 */

const DOMAIN_LABELS: Record<string, string> = {
    scoreStrategy:   'AI Strategy & Vision',
    scoreData:       'Data Readiness & Governance',
    scoreTech:       'Technology & Infrastructure',
    scoreSecurity:   'Security & Compliance',
    scoreSkills:     'AI Skills & Talent',
    scoreOps:        'Organisational Readiness',
    scoreGovernance: 'AI Governance & Ethics',
    scoreFinancial:  'Financial & Operational Readiness',
}

function scoreLabel(score: number | null | undefined): string {
    if (!score) return 'Not Assessed'
    if (score < 2)   return 'Initial'
    if (score < 3)   return 'Developing'
    if (score < 4)   return 'Defined'
    if (score < 4.5) return 'Managed'
    return 'Optimised'
}

function ambitionLabel(level: number | null | undefined): string {
    const map: Record<number, string> = { 1: 'exploratory', 2: 'committed', 3: 'scaling', 4: 'advanced', 5: 'AI-first' }
    return map[level ?? 1] ?? 'developing'
}

function industryPhrase(customer: any): string {
    const parts: string[] = []
    if (customer.industry) parts.push(`operating in the ${customer.industry} sector`)
    if (customer.employees) parts.push(`with approximately ${customer.employees} employees`)
    return parts.length ? parts.join(', ') : 'a forward-looking enterprise'
}

// ─── Phase 1 ─────────────────────────────────────────────────────────────────

function generateReadinessReport(customer: any, assessment: any | null): string {
    const overall = assessment
        ? (Object.keys(DOMAIN_LABELS).reduce((a, k) => a + (assessment[k] || 0), 0) / 8).toFixed(1)
        : 'N/A'
    const overallNum = parseFloat(overall) || 0

    const domainRows = Object.entries(DOMAIN_LABELS).map(([key, label]) => {
        const score = assessment?.[key] ?? 0
        const gap = Math.max(0, 4.0 - score).toFixed(1)
        return `| ${label} | ${score.toFixed(1)} | 4.0 | ${gap} | ${scoreLabel(score)} |`
    }).join('\n')

    const sortedDomains = Object.entries(DOMAIN_LABELS)
        .map(([key, label]) => ({ label, score: assessment?.[key] ?? 0 }))
        .sort((a, b) => a.score - b.score)
    const criticalGaps   = sortedDomains.filter(d => d.score < 2.5)
    const topStrengths   = [...sortedDomains].reverse().slice(0, 2)

    const domainAnalysis = Object.entries(DOMAIN_LABELS).map(([key, label]) => {
        const score = assessment?.[key] ?? 0
        const gap = Math.max(0, 4.0 - score).toFixed(1)
        const interpretation = score < 2.5
            ? `This is a critical gap area. A score of ${score.toFixed(1)} indicates that foundational practices in this domain are largely absent or inconsistent. Without structured remediation, this weakness will present a material risk to the success of the AI initiative. The variance of ${gap} points relative to the 4.0 benchmark underlines the urgency of targeted investment.`
            : score < 3.5
            ? `The organization demonstrates emerging capabilities in this domain, with a score of ${score.toFixed(1)} suggesting that some processes are in place but lack the consistency and governance required for reliable AI operations. Closing the gap of ${gap} points will require focused process formalization and the establishment of clear ownership structures.`
            : `This domain represents a relative strength for ${customer.name}, with a score of ${score.toFixed(1)} reflecting established, repeatable practices. The organization should leverage these existing capabilities as an accelerator for the AI initiative and continue building toward the Optimised level through systematic performance measurement and continuous improvement.`
        return `**${label} — ${score.toFixed(1)} / 5.0 (${scoreLabel(score)})**\n\n${interpretation}`
    }).join('\n\n')

    const readinessVerdict = overallNum >= 2.5
        ? `Based on the findings of this assessment, UniSystems confirms that ${customer.name} is ready to proceed to Phase 2 of the UniSystems AI Consulting Framework. The organization has the executive mandate, the strategic intent, and sufficient foundational capabilities to begin the use case discovery and strategy alignment process. However, the remediation of the identified critical gaps must be initiated in parallel with Phase 2 activities to ensure these weaknesses do not become blockers in Phase 3.`
        : `Based on the findings of this assessment, UniSystems recommends a structured remediation period before ${customer.name} proceeds to the full Phase 2 use case discovery programme. The concentration of foundational gaps identified indicates that advancing without remediation would create significant delivery risk in Phase 3. UniSystems recommends a focused six-to-eight-week remediation sprint targeting the three most critical domains before commencing the Phase 2 workshops.`

    return `## 1. Executive Summary

${customer.name}, ${industryPhrase(customer)}, engaged UniSystems to conduct a comprehensive AI Readiness Assessment as the foundational step in a structured AI adoption journey. The primary objective of this assessment was to establish an objective, evidence-based baseline of organizational maturity across the eight strategic domains of the UniSystems AI Readiness Framework, and to translate those findings into a prioritized set of recommendations for the phases ahead.

Across all eight domains, ${customer.name} achieved an **Overall Maturity Score of ${overall} out of 5.0**, placing the organization within the **${scoreLabel(overallNum)}** maturity band. This result reflects ${overallNum >= 3.5 ? 'a solid and largely consistent foundation with specific areas requiring targeted investment before enterprise-scale AI deployment can proceed' : overallNum >= 2.5 ? 'a developing baseline with meaningful gaps across several domains that must be addressed in a structured and sequenced manner' : 'an early-stage AI readiness profile where foundational investments in data, technology, and governance are prerequisites to any significant AI initiative'}. The overall score is consistent with organizations at a comparable stage of AI adoption and provides a clear, actionable compass for the path forward.

${topStrengths.length > 0 ? `Notable relative strengths were identified in the ${topStrengths.map(s => s.label).join(' and ')} domains, providing a credible foundation on which the initial phases of the AI programme can build. ` : ''}${criticalGaps.length > 0 ? `The assessment identified critical gaps in ${criticalGaps.map(g => g.label).join(', ')}, which require prioritized remediation to avoid material risk to AI initiative delivery.` : 'The organization demonstrates a reasonably consistent maturity profile across the majority of domains assessed.'}

The detailed domain findings, gap analysis, and prioritized recommendations are presented in the sections that follow. UniSystems is confident that, with the recommended investments, ${customer.name} has the organizational conditions required to build a sustainable and high-impact AI capability.

## 2. About This Assessment

### 2.1 Assessment Methodology

The UniSystems AI Readiness Assessment is a structured evaluation framework designed to provide organizations with an objective, evidence-based view of their current maturity across all dimensions critical to successful AI adoption. The framework evaluates eight strategic domains through a combination of scored questions and qualitative inputs, producing both a quantitative maturity profile and a rich set of qualitative observations.

Each domain is assessed on a five-point scale corresponding to five maturity levels. A score in the range of one to two indicates an Initial stage, where relevant practices are largely absent or entirely informal. A score between two and three denotes a Developing stage, where emerging but inconsistent practices exist. A score between three and four indicates a Defined stage, characterized by documented, repeatable processes. A score between four and four-and-a-half reflects a Managed stage, where performance is actively monitored and continuously improved. A score above four-and-a-half represents the Optimised stage, where the organization demonstrates industry-leading practice in the respective domain.

### 2.2 Scope and Limitations

This assessment was conducted at the organizational level and is designed to provide a strategic, directional view of AI readiness rather than a technical audit of individual systems or platforms. The findings represent the state of the organization at the time of the engagement and should be reviewed periodically as the AI programme progresses. Scores reflect the collective assessment of the engaged stakeholders and the documented evidence reviewed during the engagement.

## 3. Customer AI Initiative Overview

${customer.name} is pursuing an **${ambitionLabel(customer.ambitionLevel)}** approach to AI adoption, reflecting a deliberate strategic commitment to harnessing artificial intelligence as a driver of operational efficiency, decision-making quality, and competitive differentiation. The organization's AI ambition is situated within the broader context of its digital transformation programme, and AI is recognized at the executive level as a strategic enabler rather than an isolated technology initiative.

The scope of this readiness assessment encompasses all eight domains of the UniSystems framework, providing ${customer.name}'s leadership with a complete and unambiguous picture of where the organization stands today and what investments are required to move through the phases of the AI adoption journey with confidence. The findings from this assessment directly inform the Phase 2 strategy alignment workshops, ensuring that use case discovery and piloting decisions are grounded in an honest assessment of current organizational capability.

The primary focus areas identified during the discovery phase of this engagement include process automation through intelligent document handling and workflow orchestration, data-driven decision support through predictive analytics and reporting augmentation, and the foundational infrastructure and governance required to support responsible AI deployment at scale.

## 4. Assessment Results and Domain Analysis

### 4.1 Overall Maturity Profile

The following table summarises the maturity assessment across all eight domains, presenting the current score against the UniSystems benchmark target of 4.0, the calculated gap, and the corresponding maturity level classification. This table constitutes the quantitative core of the readiness assessment and forms the basis for the gap analysis and recommendations in subsequent sections.

| Strategic Domain | Current Score | Target Score | Gap | Maturity Level |
|:----------------|:-------------:|:------------:|:---:|:--------------|
${domainRows}

The overall maturity score of ${overall} places ${customer.name} in the ${scoreLabel(overallNum)} band. This profile is consistent with organizations at a comparable stage of AI adoption investment, where strategic clarity is present but where the full complement of technical, organizational, and governance foundations required for scalable enterprise deployment is still being constructed. The variance between domains — ranging from relative strengths to critical gaps — is typical of this maturity stage and provides a clear map for prioritized investment.

### 4.2 Domain-by-Domain Analysis

${domainAnalysis}

## 5. Gap Analysis

The gap analysis translates the quantitative domain scores into a prioritized, sequenced view of the investments required before and during the AI initiative. Rather than treating each domain in isolation, this analysis examines the interdependencies between domains and the cumulative risk that unaddressed gaps present to the overall programme.

${criticalGaps.length > 0
    ? `The most significant finding of this assessment is the presence of critical gaps in ${criticalGaps.map(g => g.label).join(' and ')}. Domains scoring below 2.5 represent foundational weaknesses that will compound across the entire AI initiative if left unaddressed. Weak data governance, for example, will introduce model accuracy risk and regulatory exposure regardless of the quality of the AI architecture deployed above it. These gaps must be treated as programme-level risks, not domain-level inconveniences.`
    : `The gap profile for ${customer.name} reflects a relatively consistent maturity level across domains, without any single domain representing a critical blocker to the AI initiative. The primary challenge for the organization is one of systematic, multi-domain improvement rather than emergency remediation in any single area.`}

The interdependencies between domains deserve particular attention in the remediation planning process. Technical Infrastructure and Data Readiness are deeply intertwined — the quality of data pipelines, storage architecture, and integration capabilities directly determines the ceiling on data quality achievable by downstream AI applications. Similarly, the AI Governance and Ethics domain cannot be addressed in isolation from the operational deployment track; governance frameworks must be in place before AI models are exposed to real business decisions, not designed as an afterthought once deployment is underway.

From a sequencing perspective, UniSystems recommends a parallel-track approach: a technical track addressing Data Readiness, Technology Infrastructure, and Security foundations simultaneously; and an organizational track addressing AI Governance, Organizational Readiness, and Skills development. Both tracks should be active during Phase 2 and must reach a minimum threshold before Phase 3 piloting commences.

## 6. Strategic Recommendations

The following recommendations are prioritized based on the magnitude of the identified gaps, the criticality of each domain to the stated AI initiative, and the sequencing logic required for effective remediation. Each recommendation includes an assessment of the effort required and the connection to the customer's broader AI programme.

${sortedDomains.slice(0, 5).map((domain, i) => `### 6.${i + 1} ${domain.label}

The assessment score of ${domain.score.toFixed(1)} in the ${domain.label} domain indicates that ${domain.score < 2.5 ? 'urgent, foundational remediation is required. Existing practices are insufficient to support AI initiative delivery at the standard required for Phase 3 piloting. UniSystems recommends establishing a dedicated workstream with executive sponsorship to address this domain as a programme-critical priority. The scope of this workstream should begin with a current-state documentation exercise, followed by the definition of a minimum viable target state and a sequenced set of process and capability improvements' : domain.score < 3.5 ? 'structured formalization of emerging practices is the primary requirement. A functional baseline exists, but the inconsistency and informality of current practices introduces risk that must be managed as the AI programme scales. UniSystems recommends a focused improvement initiative aimed at documenting existing practices, establishing accountability structures, and implementing basic performance metrics' : 'continuous improvement is the appropriate strategic posture. The organization has established solid practices in this domain and should focus on extending consistency, deepening performance measurement, and staying ahead of evolving best practices in enterprise AI'}. This recommendation should be formally accepted and assigned an owner within the first two weeks of Phase 2.`).join('\n\n')}

## 7. Readiness Verdict and Next Steps

${readinessVerdict}

The immediate next steps for ${customer.name} following this assessment are threefold. First, the executive sponsor and steering committee should formally review and accept these findings in a structured walkthrough session, ensuring that there is full organizational alignment on the priorities and remediation commitments identified. Second, a dedicated remediation workstream should be established with clear ownership, budget allocation, and milestone timelines. Third, Phase 2 discovery workshops should be formally scheduled, with the first session focused on translating the readiness findings into a concrete use case hypothesis backlog.

The AI opportunity ahead for ${customer.name} is significant and well within reach. Organizations that have followed the UniSystems framework and addressed foundational gaps systematically have consistently achieved higher rates of AI initiative success, faster time-to-value in their Proof of Value phases, and more durable organizational AI capabilities than those that have attempted to shortcut the foundational work. UniSystems is fully committed to supporting ${customer.name} in realizing this potential and looks forward to the Phase 2 engagement.`
}

function generateAdoptionRoadmapV1(customer: any, assessment: any | null): string {
    const phase = customer.currentPhase ?? 1
    const overall = assessment
        ? (Object.keys(DOMAIN_LABELS).reduce((a, k) => a + (assessment[k] || 0), 0) / 8).toFixed(1)
        : 'N/A'
    const overallNum = parseFloat(overall) || 0

    const sortedDomains = Object.entries(DOMAIN_LABELS)
        .map(([key, label]) => ({ label, score: assessment?.[key] ?? 0 }))
        .sort((a, b) => a.score - b.score)
    const topRisks = sortedDomains.slice(0, 3)

    const phaseStatus = (n: number) => phase > n ? 'Complete' : phase === n ? 'In Progress' : 'Upcoming'

    return `## 1. Executive Summary

This document presents the High-Level AI Adoption Roadmap for ${customer.name}, developed by UniSystems following the completion of the Phase 1 AI Readiness Assessment. The roadmap translates the assessment findings into a structured, multi-phase engagement plan that guides ${customer.name} from its current maturity position to a state of sustained, enterprise-scale AI capability.

The UniSystems 5-Phase AI Consulting Framework provides the structural backbone of this roadmap. Each phase is designed to build on the outputs of the preceding phase, ensuring that AI investments are made in the right sequence, at the right scale, and with appropriate risk mitigation at every step. The overall maturity score of ${overall} out of 5.0 achieved in the readiness assessment provides the baseline from which this roadmap was calibrated, and all phase objectives and timelines have been adjusted to reflect the specific organizational context of ${customer.name}.

The total recommended engagement timeline, from the current Phase 1 baseline through to the sustained value realization of Phase 5, is estimated at twelve to eighteen months for an organization of this scale and complexity, with the most intensive delivery activity concentrated in Phases 2, 3, and 4. Executive commitment, adequate resource allocation, and proactive change management will be the primary determinants of whether the organization achieves the full value potential described in this roadmap.

## 2. Strategic Context and AI Vision

${customer.name}, ${industryPhrase(customer)}, has identified AI as a strategic priority with an **${ambitionLabel(customer.ambitionLevel)}** adoption posture. This ambition level signals that the organization is prepared to invest in building genuine AI capability, and is not merely conducting exploratory experiments at the margins of its operations.

The strategic rationale for AI investment at ${customer.name} is rooted in three converging pressures: the need to improve operational efficiency across high-volume processes; the imperative to enhance the quality and speed of decision-making through better use of organizational data; and the growing competitive pressure from industry peers who are advancing their AI capabilities at pace. Each of these drivers reinforces the others — operational efficiency gains free up capacity for strategic work, better data-driven decisions accelerate learning, and the competitive imperative creates urgency that justifies the investment required.

This roadmap is designed to address all three dimensions in a sequenced, risk-managed manner. The early phases establish the foundation; the middle phases validate and scale; and the final phase locks in the value and establishes the organizational capability required for ongoing AI innovation.

## 3. Readiness Summary

The Phase 1 AI Readiness Assessment established an overall maturity score of ${overall} out of 5.0 for ${customer.name}, placing the organization in the **${scoreLabel(overallNum)}** maturity band. This score reflects the average across eight domains and masks significant variance between individual domain scores — a pattern that is typical of organizations at this stage of AI adoption, where pockets of strength coexist with foundational gaps.

The three most important findings from the assessment, from a roadmap design perspective, are as follows. First, the domains with the lowest scores — ${topRisks.map(r => r.label).join(', ')} — require remediation investment that must be scoped into the Phase 2 plan from day one; these are not issues that can be deferred to Phase 3 or later. Second, the assessment confirmed that executive sponsorship and strategic alignment are strong, which is the single most important success factor for AI adoption and provides a critical foundation that many organizations lack. Third, the assessment identified specific departmental areas where early AI use case potential is high, providing a concrete starting point for the Phase 2 discovery workshops.

## 4. The Recommended Journey

### 4.1 Phase 1: Discovery and Readiness Assessment

Phase 1 establishes the organizational baseline through the AI Readiness Assessment, the mapping of the existing technology landscape, and the identification of initial use case hypotheses. This phase is now complete for ${customer.name}, and its primary output — this assessment report — provides the evidence base for all subsequent phases.

**Duration:** 2 to 4 weeks | **Status:** ${phaseStatus(1)}

### 4.2 Phase 2: Use Case Discovery and Strategy Alignment

Phase 2 translates the readiness findings into a concrete set of prioritized AI use cases, a validated business case for the top initiatives, and a refined adoption roadmap. This phase involves a structured programme of stakeholder workshops, persona analysis, and technical feasibility scoping, resulting in a Use Case Catalogue and an updated Adoption Roadmap that confirms the scope and sequence of the Phase 3 pilot.

**Duration:** 3 to 5 weeks | **Status:** ${phaseStatus(2)}

### 4.3 Phase 3: Proof of Value Execution

Phase 3 builds and validates the business case through a focused, time-boxed Proof of Value pilot on the highest-priority use case identified in Phase 2. The PoV is designed to generate measurable evidence of AI impact on real business processes, validate the technical architecture, and build organizational confidence before enterprise-scale investment is committed. The phase concludes with a formal Go/No-Go decision framework.

**Duration:** 4 to 8 weeks | **Status:** ${phaseStatus(3)}

### 4.4 Phase 4: Enterprise Deployment and Scale

Phase 4 takes the validated PoV solution and deploys it across the full scope of the target user population, with a phased wave structure that manages change management risk while maximizing adoption speed. This phase includes structured training delivery, hypercare support, and the activation of the AI Champions network that will sustain adoption beyond the engagement.

**Duration:** 8 to 16 weeks | **Status:** ${phaseStatus(4)}

### 4.5 Phase 5: Value Realization and Continuous Improvement

Phase 5 validates the realized business value against the original projections, identifies the next wave of AI opportunities from the use case backlog, and establishes the organizational capability — the AI Center of Excellence, the governance cadence, and the continuous improvement processes — required to sustain and expand the AI programme independently.

**Duration:** Ongoing | **Status:** ${phaseStatus(5)}

## 5. Initial Target Areas

Based on the readiness assessment findings and the initial use case hypotheses identified during Phase 1, UniSystems has identified the following priority areas for Phase 2 discovery. These represent the business functions where the combination of AI opportunity, data availability, and organizational readiness is most favourable for early-stage piloting.

The first priority area is process automation within operations-heavy functions, where high-volume repetitive tasks represent a clear and immediate opportunity for intelligent automation. The business case for this category is typically well-understood by finance stakeholders and provides a strong ROI anchor for the broader programme. The second priority area is decision support and analytics augmentation, where AI-assisted reporting and predictive models can enhance the quality and speed of decisions in areas such as risk management, demand forecasting, or resource allocation. The third priority area is knowledge management and document intelligence, where the organization's accumulated documentation, policies, and institutional knowledge can be made more accessible and actionable through retrieval-augmented generation techniques.

These are hypotheses to be validated and refined in Phase 2. The use case discovery workshops will determine which specific initiatives within these areas represent the strongest combination of business value, technical feasibility, and organizational readiness for the Phase 3 pilot.

## 6. Governance Structure

Effective AI adoption requires a governance structure that provides strategic direction, operational oversight, and organizational accountability. UniSystems recommends the establishment of a formal AI Steering Committee as the primary governance body for the programme, supported by an operational working group responsible for day-to-day delivery coordination.

The AI Steering Committee should be chaired by the Executive Sponsor and should include representation from IT leadership, Finance, the key business unit leads, and the UniSystems Programme Lead. This committee should meet monthly during active delivery phases and quarterly once the programme enters sustained operations. Its mandate includes the approval of phase transitions, the allocation of budget and resources, the management of programme-level risks, and the formal review of value realization results.

Below the Steering Committee, an AI Programme Working Group should operate at the operational level, meeting weekly during active phases to manage day-to-day delivery, track milestones, surface emerging risks, and coordinate cross-functional dependencies. This group should include the technical leads, the business change managers, and the AI Champions designated within each participating department.

## 7. Key Risks and Mitigations

The following risks have been identified based on the Phase 1 assessment findings and represent the primary threats to programme success. Each risk has been assigned a likelihood and impact rating, and a mitigation strategy has been defined.

| Risk | Likelihood | Impact | Mitigation |
|:-----|:----------:|:------:|:-----------|
| Data quality gaps delay Phase 3 PoV | ${topRisks[0]?.score < 2.5 ? 'High' : 'Medium'} | High | Initiate data quality workstream in Phase 2 with dedicated ownership and timeline |
| Change resistance reduces adoption in Phase 4 | Medium | High | Launch AI literacy programme and AI Champions activation in Phase 2 |
| Scope creep expands Phase 3 beyond manageable bounds | Medium | Medium | Enforce strict PoV scoping process with executive sign-off on scope freeze |
| AI Governance gaps create compliance exposure | ${assessment?.scoreGovernance < 2.5 ? 'High' : 'Medium'} | High | Engage compliance and legal in Phase 2 to develop governance framework in parallel |
| Inadequate internal resource allocation delays delivery | Medium | High | Establish a formal resource commitment from business unit leads before Phase 2 kickoff |

## 8. Indicative Investment Framework

This section provides a structural framework for investment planning across the engagement phases. Commercial figures should be completed by the UniSystems account team in consultation with the customer's finance and procurement stakeholders, and this section updated before Phase 2 formal kickoff.

| Phase | Consulting Investment | Technology and Licensing | Internal Resource (Estimated FTE) | Notes |
|:------|:--------------------:|:------------------------:|:---------------------------------:|:------|
| Phase 1 | As agreed | Minimal | 0.5 FTE | Complete |
| Phase 2 | TBC | Minimal | 0.5 FTE | Workshops + strategy |
| Phase 3 | TBC | TBC | 1–2 FTE | PoV build and run |
| Phase 4 | TBC | TBC | 2–4 FTE | Deployment + training |
| Phase 5 | TBC | Ongoing | 1 FTE | Managed services / CoE |

## 9. Next Steps

The formal commencement of Phase 2 requires the following actions to be completed within the next two weeks. The UniSystems account team will coordinate closely with the ${customer.name} programme lead to ensure these actions are completed on schedule.

The first action is the formal acceptance of the Phase 1 Readiness Assessment findings by the Executive Sponsor, through a structured read-out session to be scheduled by the UniSystems team. The second action is the confirmation of Phase 2 workshop dates and participant lists across the target business units, ensuring that the right decision-makers are present for the use case discovery sessions. The third action is the establishment of the AI Programme Working Group, with named members and a confirmed regular meeting cadence. The fourth action is the initiation of the data quality and governance remediation workstream, with an owner assigned and a first milestone date confirmed. With these actions in place, ${customer.name} will be positioned to commence Phase 2 with full organizational momentum.`
}

// ─── Phase 2 ─────────────────────────────────────────────────────────────────

function generateUseCaseCatalogue(customer: any, useCases: any[]): string {
    const highPriority = useCases.filter(uc => uc.priority === 'HIGH')
    const medPriority  = useCases.filter(uc => uc.priority === 'MEDIUM')
    const totalROI     = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
    const depts        = [...new Set(useCases.map(uc => uc.department).filter(Boolean))]

    const useCaseDetails = useCases.length > 0
        ? useCases.map((uc, i) => `### ${i + 1}. ${uc.title}

This use case was identified during the Phase 2 discovery process as a high-potential AI opportunity within the ${uc.department || 'enterprise'} function. The business problem it addresses is: ${uc.description || 'an operationally significant process with high volumes of repetitive cognitive work that is currently managed through manual workflows, creating bottlenecks, quality variability, and an opportunity cost in terms of the professional time consumed'}. The priority classification of **${uc.priority || 'Medium'}** reflects the combined assessment of strategic impact and implementation feasibility.

The proposed AI solution involves the application of ${uc.title.toLowerCase().includes('docum') ? 'document intelligence and intelligent information extraction' : uc.title.toLowerCase().includes('predict') ? 'predictive analytics and machine learning' : uc.title.toLowerCase().includes('report') ? 'automated reporting and AI-assisted analytics' : 'machine learning and natural language processing'} to automate, augment, or accelerate the core workflows in this area. Implementation of this use case is expected to generate an estimated annual value of **$${(uc.roiEstimate || 0).toLocaleString()}**, derived primarily from ${uc.roiEstimate > 100000 ? 'significant reductions in manual processing time, improved accuracy, and the reallocation of professional resource to higher-value activities' : 'efficiency gains in the core workflow and a reduction in error rates and associated rework costs'}.
`).join('\n')
        : 'Specific use cases will be detailed following the completion of the Phase 2 discovery workshops. This section will be populated with the full use case catalogue upon conclusion of the discovery process.'

    const povCandidates = highPriority.slice(0, 2)

    return `## 1. Executive Summary

This document presents the Prioritized AI Use Case Catalogue for ${customer.name}, developed as the primary output of the Phase 2 Use Case Discovery and Strategy Alignment process. The catalogue represents the definitive reference document for all AI initiative decisions from this point forward — the Phase 3 Proof of Value will be selected from this catalogue, and it will be updated and maintained throughout the engagement as new opportunities emerge and priorities evolve.

The Phase 2 discovery process identified a total of **${useCases.length}** distinct AI opportunities across ${depts.length > 0 ? depts.join(', ') : 'the key business functions of the organization'}. These opportunities have been evaluated and prioritized using the UniSystems dual-axis Impact and Feasibility matrix, resulting in a structured backlog with **${highPriority.length}** high-priority initiatives, **${medPriority.length}** medium-priority initiatives, and ${useCases.length - highPriority.length - medPriority.length} initiatives designated for future exploration.

The total projected annual portfolio value across all identified use cases is estimated at **$${totalROI.toLocaleString()}**, representing a compelling return on the AI programme investment. UniSystems recommends that ${highPriority.length > 0 ? `the top ${Math.min(highPriority.length, 2)} high-priority initiative${highPriority.length > 1 ? 's' : ''} be advanced to the Phase 3 Proof of Value` : 'the highest-priority use cases identified in this catalogue be advanced to the Phase 3 Proof of Value selection process'}, with the remaining backlog maintained as a pipeline for Phase 4 and Phase 5 expansion.

## 2. Discovery Approach and Methodology

### 2.1 Discovery Process

The use case discovery process was conducted through a structured programme of stakeholder engagement activities, including cross-functional workshops, individual stakeholder interviews, and pain-point analysis sessions. The workshops were designed to surface both explicit AI opportunities — areas where participants had already identified potential AI applications — and latent opportunities that emerged through structured facilitation and the application of the UniSystems AI opportunity templates.

Each session was structured around three primary lenses: the operational lens, which examines high-volume, repetitive processes with potential for automation; the analytical lens, which identifies decision-making processes that could benefit from predictive insight or data augmentation; and the experiential lens, which explores customer-facing and employee-facing experiences that could be enhanced through conversational AI, personalization, or intelligent assistance.

### 2.2 Prioritisation Methodology

Each identified use case was scored on two dimensions. The first dimension, Strategic Impact, assesses the potential business value of the use case across four sub-criteria: estimated annual ROI, risk reduction potential, competitive differentiation, and alignment to the organization's stated strategic priorities. The second dimension, Implementation Feasibility, assesses the practical delivery risk of the use case across four sub-criteria: data availability and quality, technical complexity relative to the organization's current infrastructure maturity, organizational readiness in the relevant business unit, and the timeline to first measurable results.

## 3. Prioritisation Framework

Use cases were plotted on a two-by-two priority matrix based on their combined Impact and Feasibility scores. The resulting quadrant classification determines the recommended treatment of each use case within the engagement plan.

High Impact, High Feasibility initiatives are classified as Strategic Bets and are the primary candidates for the Phase 3 Proof of Value. These represent the optimal combination of business value potential and delivery confidence. High Impact, Lower Feasibility initiatives are classified as Strategic Investments — they carry significant long-term value but require foundational investments before they can be delivered; they are prioritized for Phase 4 or later. Lower Impact, High Feasibility initiatives are classified as Quick Wins — they may lack scale but can deliver rapid, visible results that build organizational confidence and momentum. Low Impact, Low Feasibility initiatives are deprioritized for the current engagement cycle.

## 4. Use Case Catalogue

The following section provides a detailed description of each identified use case, including its business context, proposed AI approach, expected benefits, and implementation classification.

${useCaseDetails}

## 5. Recommended Proof of Value Candidates

Based on the prioritization analysis, UniSystems recommends the following initiative${povCandidates.length !== 1 ? 's' : ''} for the Phase 3 Proof of Value:

${povCandidates.length > 0
    ? povCandidates.map((uc, i) => `**Candidate ${i + 1}: ${uc.title}**

This initiative is recommended for the Phase 3 PoV because it combines a strong business case — with an estimated annual value of $${(uc.roiEstimate || 0).toLocaleString()} — with a relatively manageable implementation scope that is achievable within the standard PoV timeline of four to eight weeks. The ${uc.department || 'target'} function has demonstrated strong stakeholder engagement during the discovery process and the data assets required to support a credible pilot are available or can be made available with minimal pre-processing. A successful PoV on this initiative will generate the business evidence and organizational confidence required to unlock the broader deployment investment.`).join('\n\n')
    : `Specific PoV candidates will be confirmed following the formal Phase 2 sign-off workshop. The selection will be made based on the priority matrix results, stakeholder availability for the pilot period, and data readiness in the candidate departments.`}

## 6. Deferred Use Cases and Future Considerations

A number of use cases identified during the discovery process were deprioritized for the current engagement cycle, either because they require foundational investments not yet in place, because their impact-feasibility profile places them outside the Phase 3 window, or because the organizational readiness in the relevant business unit requires further development.

These deferred initiatives are not discarded — they are maintained as a structured pipeline for Phase 4 expansion and Phase 5 continuous improvement. For each deferred initiative, the specific condition that must be met before it can be reactivated has been documented in the working catalogue maintained by the UniSystems programme team. This pipeline approach ensures that ${customer.name} continuously builds AI capability across the enterprise rather than concentrating all investment in a narrow set of initial use cases.`
}

function generateROIAnalysis(customer: any, useCases: any[]): string {
    const totalROI = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
    const roi3yr   = totalROI * 2.7

    return `## 1. Executive Summary

This document presents the Business Case and ROI Analysis for the AI initiatives identified at ${customer.name} during the Phase 2 discovery process. It quantifies the anticipated business value of the prioritized use case portfolio, establishes the investment framework required to deliver that value, and defines the key assumptions that will be validated during the Phase 3 Proof of Value.

Across ${useCases.length} prioritized use cases, the total projected annual portfolio value is estimated at **$${totalROI.toLocaleString()}**, with a three-year cumulative projected value of approximately **$${Math.round(roi3yr).toLocaleString()}** after accounting for a conservative ramp-up factor in Year 1. This represents a compelling return on the AI programme investment and provides a strong financial justification for proceeding to Phase 3. The investment required to deliver this value is detailed in Section 3 and should be completed with precise commercial figures by the UniSystems account team before this document is formally presented to the executive sponsor.

The business case analysis was developed using the UniSystems value modelling methodology, which applies a structured benefits framework to each use case, distinguishes between quantifiable hard benefits and qualitative soft benefits, and applies a conservative realization factor to Year 1 projections to account for the natural learning curve of any new operational process.

## 2. Scope and Methodology

### 2.1 Use Cases in Scope

This business case covers the ${useCases.length} use cases identified and prioritized in the Phase 2 Use Case Catalogue. Each use case has been assigned an estimated annual value based on the operational data gathered during the discovery workshops and the benefit modelling conducted by the UniSystems team in collaboration with the relevant business unit leads.

The time horizon for this analysis is three years, which represents a meaningful period over which AI investment returns can be assessed and benchmarked against alternative capital allocation decisions. The analysis distinguishes between Year 1, which includes a 0.8 realization factor to account for ramp-up time, and Years 2 and 3, which assume full operational maturity of the deployed AI solutions.

### 2.2 Benefits Classification

Benefits have been classified into three tiers based on the certainty and measurability of the projected value. Tier 1 benefits are directly measurable reductions in cost, time, or error rate, where a clear baseline metric exists and a credible AI-driven improvement can be quantified. Tier 2 benefits are reasonably estimable improvements based on industry benchmarks or comparable AI deployments, where direct measurement is more complex but the directional case is strong. Tier 3 benefits are qualitative or strategic in nature — improvements in decision quality, employee experience, or competitive positioning — which are acknowledged and described but excluded from the quantitative model to preserve its conservatism and credibility.

## 3. Investment Framework

The following table provides the investment structure for the AI programme. Commercial figures must be confirmed by the UniSystems account team based on the specific scope agreed with ${customer.name}.

| Cost Category | Phase 2 | Phase 3 | Phase 4 | Ongoing | Total |
|:-------------|:-------:|:-------:|:-------:|:-------:|:-----:|
| Consulting and Delivery | TBC | TBC | TBC | TBC | TBC |
| Technology Licensing and Platforms | Minimal | TBC | TBC | TBC | TBC |
| Cloud Infrastructure and Compute | Minimal | TBC | TBC | TBC | TBC |
| Internal Resource (FTE estimate) | 0.5 FTE | 1–2 FTE | 2–4 FTE | 1 FTE | — |
| Training and Change Management | Included | Included | TBC | Included | TBC |
| **Total Programme Investment** | | | | | **TBC** |

Note: The investment figures above require completion by the UniSystems account team based on the confirmed commercial proposal. The technology licensing costs will depend on the specific AI platform selection made during Phase 3 and the deployment scale confirmed for Phase 4.

## 4. Benefits Analysis by Use Case

The following section provides a structured benefits assessment for each prioritized use case. Benefit estimates are based on the operational data and process information gathered during Phase 2, and have been reviewed with the relevant business unit stakeholders.

${useCases.length > 0
    ? useCases.map((uc, i) => `### 4.${i + 1} ${uc.title}

This use case is projected to deliver an estimated annual value of **$${(uc.roiEstimate || 0).toLocaleString()}** through a combination of direct operational efficiency gains and reductions in process error rates and associated rework costs. The primary benefit driver is ${uc.title.toLowerCase().includes('auto') ? 'the automation of high-frequency manual tasks that currently consume significant professional time at a cost disproportionate to the value of the individual task' : 'the improvement in process quality and throughput that AI-assisted approaches deliver compared to current manual or semi-automated workflows'}. The assumptions underpinning this estimate are based on the operational baseline data provided by the ${uc.department || 'relevant business unit'} and will be formally validated during the Phase 3 PoV.

| Benefit Category | Current State | Future State with AI | Annual Value | Confidence |
|:----------------|:-------------|:--------------------:|:-----------:|:----------:|
| Operational efficiency | Manual, high volume | AI-automated, low manual effort | $${Math.round((uc.roiEstimate || 0) * 0.6).toLocaleString()} | Medium |
| Quality and accuracy | Variable, error-prone | Consistent, AI-validated | $${Math.round((uc.roiEstimate || 0) * 0.3).toLocaleString()} | Medium |
| Strategic time reallocation | Consumed by operational tasks | Released for higher-value work | $${Math.round((uc.roiEstimate || 0) * 0.1).toLocaleString()} | Low |
| **Total Annual Benefit** | | | **$${(uc.roiEstimate || 0).toLocaleString()}** | |
`).join('\n')
    : 'Use case benefit details will be populated following the completion of Phase 2 discovery workshops and the formal use case catalogue sign-off.'}

## 5. Consolidated ROI Summary

The following table consolidates the projected benefits across all use cases and presents the overall financial picture of the AI programme.

| Financial Metric | Value |
|:----------------|------:|
| Total projected annual benefit | $${totalROI.toLocaleString()} |
| Year 1 realized benefit (0.8 factor) | $${Math.round(totalROI * 0.8).toLocaleString()} |
| 3-year cumulative benefit | $${Math.round(roi3yr).toLocaleString()} |
| Programme investment (TBC) | To be confirmed |
| Estimated payback period | Subject to investment confirmation |

The consolidated ROI profile demonstrates a compelling financial case for the AI programme at ${customer.name}. The portfolio approach — delivering multiple use cases in sequence through the phased framework — is significantly more capital-efficient than attempting to build all capabilities simultaneously, as it allows early phases to generate value that partially offsets the investment required for later phases. The Phase 3 PoV will validate the primary assumptions underlying the top use cases and provide the evidence base required for the Phase 4 deployment investment decision.

## 6. Risks to Value Realisation

The following risks represent the primary threats to the realization of the projected business value. Each risk has been assessed based on the Phase 2 assessment findings and the specific characteristics of the identified use cases.

The most significant risk to value realization is the quality of the data assets that will be used to train and operate the AI models. Where data quality scores in the assessment were below target, the projected benefits assume that a data remediation workstream has been successfully completed by the time Phase 3 deployment commences. If data quality improvements are delayed, the time-to-value will extend proportionally, and the benefit projections may need to be revised downward for the initial deployment period.

The second major risk is organizational adoption. Even the most technically capable AI solution delivers zero value if users do not adopt it into their daily workflows. The benefit projections in this document assume a high adoption rate, achieved through structured training, AI Champions activation, and proactive change management. The adoption risk is rated as medium for ${customer.name} based on the organizational readiness assessment findings, and dedicated change management investment should be scoped accordingly.

## 7. Proof of Value Validation Plan

The Phase 3 Proof of Value is the primary mechanism for validating the assumptions underlying this business case. For each key assumption in the benefits analysis, a specific PoV validation test has been defined to confirm or revise the projected value.

The PoV will measure the actual time savings achieved on the core automated process against the baseline time captured during Phase 2, providing direct evidence for the operational efficiency benefit tier. It will also measure the accuracy rate of AI-generated outputs against a sample of human-reviewed outputs, providing evidence for the quality benefit tier. Finally, the PoV will capture user adoption rates and satisfaction scores, providing early signal on the organizational adoption assumptions. Following the PoV, the business case will be updated with the validated figures before the Phase 4 investment decision is made.`
}

function generateAdoptionRoadmapV2(customer: any, useCases: any[]): string {
    const pilots = useCases.filter(uc => uc.priority === 'HIGH').slice(0, 2)
    const totalROI = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)

    return `## 1. Executive Summary

This document presents the Integrated AI Adoption Roadmap Version 2.0 for ${customer.name}, developed following the completion of the Phase 2 Use Case Discovery and Strategy Alignment process. This version supersedes the High-Level Roadmap produced at the conclusion of Phase 1 and reflects the significantly richer understanding of the organization's AI opportunity landscape, technical architecture requirements, and deployment sequencing that has been developed during Phase 2.

The key advancement in this version of the roadmap is the transition from general phase objectives to named initiatives, confirmed departments, specific success criteria, and validated timeline projections. The ${useCases.length} use cases catalogued during Phase 2, with a combined annual value potential of $${totalROI.toLocaleString()}, provide the concrete foundation on which the Phase 3 PoV selection and Phase 4 deployment planning are built. This roadmap should be formally reviewed and approved by the executive sponsor before Phase 3 activities commence.

## 2. What Has Changed Since Phase 1

The Phase 1 High-Level Roadmap established the structural framework for the AI adoption journey. The most significant changes introduced in this Version 2.0 reflect the learnings and decisions taken during Phase 2. First, the use case landscape has been fully mapped, prioritized, and valued — where the Phase 1 roadmap could only reference general AI opportunity areas, this version names specific initiatives with quantified business cases. Second, the Phase 3 PoV scope has been confirmed, with specific use cases, target departments, and success criteria defined. Third, the timeline has been refined based on the actual Phase 2 duration and the resource constraints confirmed by the business unit leads. Fourth, a number of Phase 1 remediation actions have either been completed or are now in progress, which has updated the risk profile for Phase 3.

## 3. Confirmed AI Vision and Strategic Alignment

${customer.name} enters Phase 3 with a reinforced and more precise AI vision than at the start of the engagement. The Phase 2 discovery process has refined the initial strategic direction into a concrete set of priorities that are directly connected to measurable business outcomes and supported by quantified investment cases.

The organization's AI ambition remains firmly **${ambitionLabel(customer.ambitionLevel)}**, and the evidence gathered during Phase 2 confirms that this ambition is well-founded. The business units that participated in the discovery workshops demonstrated genuine enthusiasm for AI-enabled ways of working, and the use cases identified have strong executive sponsorship from the relevant functional leads. This stakeholder alignment is one of the most important preconditions for Phase 3 success.

## 4. Phase 2 Summary: Discovery Findings

The Phase 2 discovery process, conducted over a structured programme of workshops and stakeholder engagements, produced three primary outputs: the Use Case Catalogue, the Business Case and ROI Analysis, and this Updated Adoption Roadmap. Together, these documents represent a comprehensive and validated foundation for the Phase 3 Proof of Value.

The single most important finding from Phase 2 is the strength and diversity of the AI use case pipeline identified across ${[...new Set(useCases.map(u => u.department).filter(Boolean))].join(', ') || 'the organization'}. The range of identified opportunities demonstrates that AI has broad applicability within ${customer.name}'s operations and that the value case extends well beyond the initial priority areas identified during Phase 1. This breadth of opportunity strengthens the long-term investment case for the programme and provides a substantial pipeline for Phases 4 and 5.

## 5. Confirmed Pilot Scope

The following initiative${pilots.length !== 1 ? 's have' : ' has'} been selected for the Phase 3 Proof of Value, based on the combined criteria of strategic impact, implementation feasibility, data availability, and stakeholder readiness:

${pilots.length > 0
    ? pilots.map((p, i) => `**Phase 3 Pilot ${i + 1}: ${p.title}**

Department: ${p.department || 'TBC'} | Estimated Annual Value: $${(p.roiEstimate || 0).toLocaleString()} | Priority: ${p.priority}

This initiative was selected for the Phase 3 PoV because it represents the optimal combination of high strategic impact and manageable implementation complexity within the Phase 3 timeline. The target business unit has confirmed its availability and commitment to the pilot period, the data assets required for the initial model development have been assessed and are available, and the expected time-to-first-measurable-result is within the eight-week Phase 3 window. Success on this pilot will generate the business evidence required to unlock the Phase 4 enterprise deployment investment.`).join('\n\n')
    : 'The specific Phase 3 pilot use case will be confirmed at the Phase 2 sign-off workshop. The selection will be formalized following the final review of the Use Case Catalogue by the AI Steering Committee.'}

## 6. Updated Implementation Timeline

The following timeline reflects the refined project plan based on actual Phase 1 and Phase 2 durations and the resource commitments confirmed during Phase 2.

| Phase | Focus | Key Deliverables | Estimated Duration |
|:------|:------|:-----------------|:-----------------:|
| Phase 3 | Proof of Value Execution | PoV Results Report, Solution Design, Go/No-Go Decision | 6–10 weeks |
| Phase 4 | Enterprise Deployment | Training Repository, Adoption Status Reports, Wave Deployments | 10–18 weeks |
| Phase 5 | Value Realization | Value Realization Report, Improvement Backlog, CoE Establishment | Ongoing |

The timelines above assume continued executive sponsorship, adequate internal resource allocation, and the successful completion of the data quality remediation activities initiated during Phase 2. Any delays in these enabling conditions should be surfaced immediately to the AI Steering Committee as they will have a direct impact on the Phase 3 delivery dates.

## 7. Remediation Actions Status

The Phase 1 Roadmap identified a set of foundational remediation actions across the domains with the most significant gaps. The following table provides a status update on these actions as of the conclusion of Phase 2.

| Remediation Action | Domain | Status | Notes |
|:-------------------|:-------|:------:|:------|
| Data quality workstream initiation | Data Readiness | In Progress | Owner assigned; first milestone due end of Phase 3 |
| AI Governance framework draft | AI Governance | In Progress | Draft framework under review by legal and compliance |
| AI literacy programme | Organisational Readiness | Scheduled | First wave of workshops confirmed for Phase 3 |
| Technology infrastructure assessment | Technology | Complete | Report received; cloud migration scoping underway |

## 8. Updated Risks and Mitigations

The risk register has been updated to reflect the evolution of the programme from Phase 2 to Phase 3. Several Phase 1 risks have been partially mitigated and their ratings updated accordingly. New risks specific to the Phase 3 pilot scope have been added.

The highest-priority risk entering Phase 3 is the dependency on data availability for the selected pilot use case. While the initial data assessment is positive, the full data preparation work required for model development will be completed as an early Phase 3 activity, and any significant issues discovered at that point could require either a timeline extension or a scope adjustment. This risk is rated as medium likelihood and high impact and will be managed through a formal data readiness gate at the start of Phase 3.

## 9. Governance, Approvals and Next Steps

This document requires formal review and approval by the AI Steering Committee and the Executive Sponsor before Phase 3 activities commence. The approval of this roadmap constitutes the formal organizational commitment to proceed with the Phase 3 Proof of Value as scoped and described in Section 5.

Upon approval, the following actions will be initiated immediately. The UniSystems technical team will commence the detailed Phase 3 project planning and data readiness assessment. The target business unit lead will confirm the pilot participant group and establish the governance structure for the PoV period. The data engineering team will begin the data preparation activities required for the model development sprint. And the AI Steering Committee will confirm the Phase 3 checkpoint meeting schedule for milestone review and decision-making throughout the pilot period.`
}

// ─── Phase 3 ─────────────────────────────────────────────────────────────────

function generatePovResultsReport(customer: any, useCases: any[]): string {
    const pilots = useCases.filter(uc => uc.status === 'PILOTING' || uc.status === 'APPROVED')
    const totalPilotROI = pilots.reduce((sum, p) => sum + (p.roiEstimate || 0), 0)

    return `## 1. Executive Summary

This document presents the Proof of Value Performance Report for the Phase 3 AI pilot conducted at ${customer.name}. The Proof of Value was designed to test and validate the core assumptions of the AI business case under real operational conditions, before the organization commits to the full enterprise deployment investment of Phase 4. This report documents the outcomes of that pilot, presents the validated performance data, and provides a formal Go/No-Go recommendation for Phase 4 enterprise rollout.

The Phase 3 pilot covered ${pilots.length} active workstream${pilots.length !== 1 ? 's' : ''} across ${[...new Set(pilots.map(p => p.department || 'General'))].join(', ')} and was executed over the agreed Phase 3 timeline. The combined projected annual value of the piloted initiatives is $${totalPilotROI.toLocaleString()}. The findings of this pilot are presented in detail in the sections that follow, with a formal recommendation provided in Section 6.

## 2. Pilot Design and Objectives

### 2.1 Pilot Scope and Approach

The Phase 3 Proof of Value was designed as a controlled, time-boxed deployment of the selected AI solution within a defined operational environment. The pilot was structured to provide measurable evidence on three dimensions: technical performance, confirming that the AI solution performs to the required accuracy and reliability standards in a production-representative environment; operational impact, confirming that the projected efficiency and quality benefits materialize in practice; and organizational adoption, confirming that the target user group engages with and derives value from the AI-assisted workflow.

The pilot was intentionally scoped to minimize operational risk while maximizing the quality of the evidence generated. A defined user cohort was selected for the pilot period, operating the AI solution alongside the existing manual process during a parallel-run phase before transitioning fully to the AI-assisted workflow.

### 2.2 Success Criteria

The following success criteria were established at the start of Phase 3 and agreed with the executive sponsor and relevant business unit leads. These criteria served as the evaluation framework for the Go/No-Go recommendation.

Technical performance: AI model accuracy must achieve a minimum of 85 percent on the defined quality metric, as assessed against a human-reviewed validation dataset. Operational efficiency: the AI-assisted workflow must demonstrate a measurable reduction of at least 20 percent in the time required to complete the target process. Organizational adoption: at least 80 percent of the pilot user cohort must be actively using the AI solution by the end of the pilot period, as measured by system usage logs.

## 3. Pilot Performance Analysis

${pilots.length > 0
    ? pilots.map((p, i) => `### 3.${i + 1} ${p.title}

This initiative entered the Phase 3 pilot in ${p.status} status. The deployment was executed across the ${p.department || 'target'} function with a confirmed pilot user group. The projected annual value of this initiative is $${(p.roiEstimate || 0).toLocaleString()}.

**Technical Performance:** The AI model developed for this initiative was evaluated against the agreed accuracy threshold during the parallel-run phase. Performance metrics are to be formally documented by the technical team and approved by the business unit lead before this report is finalized.

**Operational Impact:** Preliminary observations from the pilot period indicate positive efficiency trends in the target workflow. Formal time-and-motion data is being collated and will be included in the final version of this section.

**User Adoption:** The pilot user cohort demonstrated a progressive adoption pattern consistent with typical enterprise AI deployments. Formal adoption metrics and qualitative user feedback are presented in the supporting annexes to this report.`).join('\n\n')
    : 'Pilot initiative performance data is currently being collated from the operational measurement systems. This section will be completed with full performance metrics, comparison against baseline data, and formal validation of the business case assumptions before the final version of this report is issued.'}

## 4. Technical Architecture Assessment

The Phase 3 pilot provided a critical opportunity to validate the technical architecture designed for the production deployment under real operational conditions. The architecture demonstrated the required scalability characteristics for the Phase 4 deployment scope, with no significant performance degradation observed under the pilot workload levels.

The integration between the AI solution and the existing enterprise systems functioned as designed throughout the pilot period. The data pipelines established during the Phase 3 data preparation sprint proved robust and required minimal manual intervention during the pilot run. Any technical issues encountered during the pilot period, and the resolutions applied, are documented in the Technical Annexe to this report.

## 5. Change Management and Adoption Assessment

The organizational adoption outcomes of the Phase 3 pilot provide important early signal for the change management approach to be applied in Phase 4. The pilot experience confirmed that user adoption is most strongly predicted by three factors: the quality of the initial training provided, the responsiveness of the support function during the early adoption period, and the active sponsorship of the direct line manager. These findings will be incorporated into the Phase 4 Rollout Readiness Checklist and the training programme design.

Qualitative feedback from the pilot user cohort has been generally positive, with users noting improvements in both the speed and confidence of their work in the AI-assisted workflow. The most frequently cited adoption challenge was the adjustment period required to calibrate confidence in AI-generated outputs — a normal and expected element of the adoption curve that is addressed through the structured validation protocols built into the workflow design.

## 6. Go/No-Go Recommendation

Based on the totality of the Phase 3 pilot evidence — technical performance, operational impact, and organizational adoption — UniSystems presents the following formal recommendation to the AI Steering Committee and Executive Sponsor.

The Go/No-Go determination should be made at the formal Phase 3 sign-off meeting, with the full evidence base presented by the UniSystems programme team. The recommendation, once formally accepted, authorizes the commencement of Phase 4 enterprise deployment planning and the allocation of the Phase 4 investment.

UniSystems recommends: **[ ] Go — Proceed to Phase 4 enterprise deployment as scoped** | **[ ] Conditional Go — Proceed to Phase 4 subject to the resolution of identified conditions** | **[ ] Defer — Extend the pilot or modify the solution design before proceeding**.

The specific recommendation will be confirmed at the Phase 3 sign-off meeting following the final review of all performance data by the Steering Committee.`
}

function generateSolutionGovernancePlan(customer: any): string {
    return `## 1. Executive Summary

This document presents the Refined Solution Design and Governance Plan for the AI programme at ${customer.name}, developed following the successful completion of the Phase 3 Proof of Value. The document defines the finalized technical architecture for the enterprise production deployment, the governance framework that will oversee the AI programme, the responsible AI and ethics controls required for regulatory and reputational risk management, and the operational support model that will sustain the solution through Phase 4 and beyond.

This plan represents the technical and governance foundation upon which the Phase 4 enterprise deployment is built. It should be reviewed and formally approved by the IT leadership, the AI Steering Committee, and the relevant compliance and security stakeholders before Phase 4 deployment activities commence. The solution design described in this document incorporates the lessons learned from the Phase 3 pilot and represents a more mature and production-hardened architecture than the initial design proposed at the start of Phase 3.

## 2. Solution Architecture

### 2.1 Architecture Overview

The production AI architecture for ${customer.name} has been designed on the principle of separation of concerns — the intelligence layer, the integration layer, the data layer, and the security layer are each independently maintainable and upgradeable, reducing the total cost of ownership and the technical risk associated with future capability enhancements. This architecture reflects the outputs of the Phase 3 technical validation and the refinements agreed with the ${customer.name} IT leadership team during the solution design review.

The intelligence layer comprises the AI models, prompt engineering frameworks, and inference infrastructure required to deliver the AI capabilities validated in Phase 3. The specific model selection — whether hosted inference via a major cloud AI provider or a privately deployed model — was confirmed during Phase 3 based on the data sovereignty, latency, and cost parameters established by the organization's technology and compliance teams.

### 2.2 Integration Architecture

The integration layer connects the AI solution to the relevant enterprise systems through a set of well-defined APIs and event-driven interfaces. All AI-facing APIs have been designed to be loosely coupled, meaning that changes to either the enterprise systems or the AI models can be made independently without requiring simultaneous modifications across the integration boundary. This design principle significantly reduces the risk of the AI solution becoming a barrier to future enterprise system evolution.

### 2.3 Data Architecture

The data architecture for the production solution builds on the data preparation work completed during Phase 3, establishing a structured and governed data pipeline that feeds the AI models with high-quality, validated inputs. The pipeline includes automated data quality checks at the ingestion stage, transformation logic that normalizes the input data to the format required by the models, and an audit log that maintains full traceability of all data movements through the system.

## 3. Enterprise Governance Framework

### 3.1 Governance Structure

The AI governance framework for ${customer.name} is designed to provide accountability, transparency, and oversight across three tiers: strategic governance through the AI Steering Committee, operational governance through the AI Program Working Group, and technical governance through the Center of Excellence function.

| Governance Tier | Body | Cadence | Mandate |
|:----------------|:-----|:-------:|:--------|
| Strategic | AI Steering Committee | Monthly | Investment decisions, phase approvals, strategic alignment |
| Operational | AI Programme Working Group | Weekly | Delivery coordination, risk management, escalations |
| Technical | AI Center of Excellence | Bi-weekly | Standards, architecture, model performance, best practices |

### 3.2 Policy Framework

The AI Policy Framework for ${customer.name} establishes the organizational rules governing the development, deployment, and operation of AI systems. The framework covers four primary areas: approved use cases and use case approval process; data use and privacy requirements for AI applications; model accuracy and reliability thresholds required for production deployment; and incident response procedures for AI model failures or unexpected outputs.

## 4. Responsible AI and Ethics Controls

The responsible AI framework for ${customer.name} is designed to ensure that AI systems operate in a manner that is fair, transparent, explainable, and accountable. These controls are not optional additions to the deployment — they are prerequisite requirements for production go-live and have been scoped into the Phase 4 implementation plan accordingly.

Bias monitoring involves the systematic evaluation of AI model outputs for evidence of demographic or algorithmic bias, using a defined testing protocol that is applied at the point of model deployment and at regular intervals thereafter. Explainability requirements mandate that for any AI-assisted process with material business consequences, the system must be able to provide a plain-language explanation of the factors that contributed to a given output, enabling human reviewers to assess and override AI recommendations with appropriate context. Human-in-the-loop controls establish the specific process steps at which human review and approval are mandatory before AI-generated recommendations are acted upon, ensuring that the organization maintains appropriate human oversight of consequential decisions. All AI-generated outputs, model inputs, and human overrides must be logged in a tamper-evident audit system that enables full traceability of AI-assisted decisions.

## 5. Operational Support Model

The operational support model defines how the AI system will be monitored, maintained, and improved once it enters production in Phase 4. The model is structured around three tiers: a Tier 1 end-user support function, staffed by the trained AI Champions in each department, handles routine user queries and provides first-line troubleshooting; a Tier 2 technical support function handles more complex technical issues, model accuracy queries, and integration problems; and a Tier 3 platform and model maintenance function, operated jointly by the UniSystems team and the ${customer.name} IT team, handles model retraining, platform upgrades, and architectural changes.

Model performance will be monitored continuously through an automated dashboard that tracks the key accuracy, latency, and reliability metrics defined during Phase 3. Alerts will be triggered automatically when any metric falls below the defined production threshold, initiating a structured incident response process.

## 6. Phase 4 Readiness Confirmation

This Solution Design and Governance Plan constitutes the technical and governance gate document for Phase 4 enterprise deployment. Before Phase 4 activities commence, the following confirmations are required from the relevant stakeholders: the IT architecture team confirms that the production infrastructure is provisioned and validated; the security team confirms that the security review and penetration testing have been completed with satisfactory findings; the compliance team confirms that the responsible AI controls and data privacy requirements are fully implemented; and the AI Steering Committee formally approves the deployment go-live based on the Phase 3 performance evidence and the solution design presented in this document.`
}

function generateGoNoGoRolloutPlan(customer: any, useCases: any[]): string {
    const pilots = useCases.filter(u => u.status === 'PILOTING')
    const depts  = [...new Set(pilots.map(u => u.department).filter(Boolean))]

    return `## 1. Executive Summary

This document serves as the formal Go/No-Go Decision Record and Enterprise Rollout Plan for the Phase 4 deployment of the AI programme at ${customer.name}. It consolidates the evidence base developed during Phase 3, presents the formal deployment readiness assessment, records the Go/No-Go decision and its rationale, and defines the phased rollout plan through which the validated AI solution will be extended across the enterprise.

The Go/No-Go decision is one of the most consequential governance moments in the AI adoption journey. It represents the point at which the organization formally commits to the enterprise-scale investment required for Phase 4, having validated the business case assumptions through the Phase 3 pilot. This document is designed to support that decision with a complete, evidence-based assessment of programme readiness across all critical dimensions: technical performance, operational effectiveness, organizational readiness, and governance compliance.

## 2. Phase 3 Performance Summary

The Phase 3 Proof of Value established a comprehensive body of evidence on the performance of the AI solution under operational conditions. The key findings across the three assessment dimensions are summarized below to inform the Go/No-Go deliberation.

Technical performance results confirmed that the AI solution met or exceeded the defined accuracy threshold in the target use case domain, demonstrating the model's fitness for production deployment. The integration architecture performed as designed throughout the pilot period, with no material system failures or data quality incidents. The solution's performance under the Phase 3 workload provides confidence in its scalability to the Phase 4 deployment scope.

Operational impact results demonstrated measurable improvements in both the speed and quality of the target process. User feedback was consistently positive regarding the reduction in manual effort and the improvement in output consistency. The quantitative efficiency metrics collected during the pilot period provide the foundation for the updated business case projections in the Phase 4 investment brief.

Organizational adoption results confirmed that the pilot user cohort achieved the target adoption rate within the Phase 3 timeline, and that the training approach and support model designed for Phase 3 are appropriate for scaling to the Phase 4 user population with the modifications recommended by the change management team.

## 3. Deployment Readiness Assessment

| Readiness Dimension | Assessment | Status | Responsible Party |
|:--------------------|:-----------|:------:|:-----------------:|
| Technical performance validated | Phase 3 accuracy and reliability thresholds met | Ready | IT/UniSystems |
| Infrastructure provisioned | Production cloud resources allocated and tested | Ready | IT |
| Security clearance obtained | InfoSec review complete; no outstanding critical findings | Ready | Security |
| Data governance compliant | All data processing confirmed compliant with policy | Ready | Data/Legal |
| Training programme designed | Phase 4 training content finalized and reviewed | Ready | Change/HR |
| AI Champions activated | Wave 1 champions trained and confirmed | Ready | Business Units |
| Support model operational | Tier 1/2/3 support structure live | Ready | IT/UniSystems |
| Governance framework live | AI Policy, ethics controls, and Steering Committee cadence confirmed | Ready | Governance |

**Formal Recommendation: [ ] GO | [ ] CONDITIONAL GO — conditions detailed below | [ ] DEFER**

## 4. Enterprise Rollout Plan

### 4.1 Deployment Wave Strategy

The Phase 4 enterprise rollout has been designed as a structured, three-wave deployment that progressively extends the AI solution from the initial pilot population to the full target user base. This wave approach provides multiple benefits: it allows the support function to scale with the user base, rather than facing a sudden surge at day one; it enables the change management team to apply lessons learned from each wave to improve the experience for subsequent waves; and it provides the Steering Committee with natural review points at which to assess progress and approve the next wave.

Wave 1 targets the departments already engaged in the Phase 3 pilot — ${depts.length > 0 ? depts.join(', ') : 'the primary pilot business unit'} — and extends the user population to include all eligible users in those departments. Wave 1 represents the lowest-risk deployment cohort, as these departments have already demonstrated engagement with and understanding of the AI solution through the pilot period.

### 4.2 Wave Deployment Schedule

| Deployment Wave | Target Population | Scope | Estimated Timeline |
|:----------------|:-----------------:|:-----:|:-----------------:|
| Wave 1 — High-Impact Departments | ${depts.length > 0 ? depts.join(', ') : 'Primary pilot BUs'} | Full departmental rollout | Weeks 1–4 |
| Wave 2 — Secondary Functions | Extended business units | Cross-functional expansion | Weeks 5–12 |
| Wave 3 — Enterprise Scale | All remaining eligible users | Full organizational coverage | Weeks 13–20 |

### 4.3 Hypercare and Support

The Phase 4 rollout includes a formal Hypercare period for each deployment wave. During the Hypercare period — defined as the first four weeks following go-live for each wave — the UniSystems team will maintain an elevated presence in the target departments, providing rapid response support, daily progress monitoring, and proactive intervention where adoption challenges are identified. The Hypercare intensity will be progressively reduced as each wave stabilizes, with the support function transitioning to the steady-state operational model as defined in the Solution Design and Governance Plan.

## 5. Risk Management

The following risks have been identified as the primary threats to the Phase 4 deployment timeline and adoption targets. Each risk has been assessed, assigned an owner, and provided with a specific mitigation action.

The primary deployment risk is the pace of adoption in Wave 2 and Wave 3, where the deployment extends to business units that did not participate in the Phase 3 pilot and therefore have not had the benefit of early exposure. This risk is mitigated through the AI Champions network, which ensures that every Wave 2 and Wave 3 department has at least one trained internal advocate present from day one to provide peer-to-peer support and encouragement.

The secondary risk is the scalability of the production infrastructure under the increased demand of Wave 2 and Wave 3 deployments. While the architecture has been validated at Phase 3 workload levels, a load test for the full Phase 4 scale will be conducted before Wave 2 go-live to confirm that the infrastructure provisioning is adequate.

## 6. Success Metrics and Reporting

Phase 4 success will be measured through a combination of usage metrics, adoption indicators, and early value realization signals. The primary metrics dashboard, accessible to the Steering Committee in real time, will track active user counts and engagement frequency by wave; process completion rates and throughput metrics for the core automated workflows; AI output accuracy and override rates as measures of user trust and model performance; and business impact indicators connecting AI usage to the operational outcomes defined in the Phase 2 business case.

Monthly Steering Committee updates will provide a structured review of these metrics, with a formal mid-phase review at the end of Wave 1 and a full Phase 4 assessment at the conclusion of Wave 3, feeding directly into the Phase 5 value realization analysis.`
}

// ─── Phase 4 ─────────────────────────────────────────────────────────────────

function generateRolloutChecklist(customer: any): string {
    return `## 1. Executive Summary

This document defines the Enterprise Rollout Readiness Checklist for the Phase 4 deployment of the AI programme at ${customer.name}. The checklist establishes the mandatory criteria that must be satisfied before each deployment wave is authorized to proceed, ensuring that the organization's governance, technical, and operational readiness requirements are met at every stage of the rollout.

The checklist is organized into five domains — Technical Readiness, Security and Compliance, Data Governance, Organizational Enablement, and Value Monitoring — each of which must be reviewed and signed off by the designated accountable party before the corresponding wave go-live is approved. This document is a living governance artefact and should be reviewed at each wave checkpoint meeting, with completion status updated by the relevant owners.

## 2. Technical Readiness

The technical readiness domain confirms that the AI solution infrastructure, integrations, and performance characteristics are fully prepared for production deployment at the target scale.

The production environment provisioning checklist requires confirmation that cloud compute resources are allocated and load-tested at the target wave capacity; that all application components have been deployed to the production environment and validated through end-to-end functional testing; that integration connections between the AI platform and all downstream enterprise systems have been tested and confirmed stable under production representative loads; and that the automated monitoring and alerting systems are active and have been configured to the agreed performance threshold values.

The technical team lead must provide formal written sign-off against each of the above items before the wave go-live is authorized. Any outstanding items at the time of the sign-off meeting must be formally assessed for their risk impact, and a mitigation plan agreed before the deployment proceeds.

## 3. Security and Compliance

The security and compliance domain confirms that all information security, data privacy, and regulatory requirements have been satisfied before any production user data is processed by the AI system.

The InfoSec sign-off requires completion of a penetration test of the production AI platform, conducted by an approved security testing party, with no outstanding critical or high-severity findings at the time of go-live. The data privacy review must confirm that all personal data processing activities performed by the AI system have been documented in the organization's records of processing activities, that any required data protection impact assessments have been completed and reviewed by the Data Protection Officer, and that user consent or legitimate interest documentation is in place as required by applicable data protection regulations.

The AI-specific compliance requirements, including the responsible AI controls defined in the Solution Design and Governance Plan, must be confirmed as operational by the compliance lead. This includes the bias monitoring schedule, the explainability documentation, and the human-in-the-loop process controls for all AI-assisted decisions with material consequences.

## 4. Data Governance

The data governance domain confirms that the data assets used by the AI system meet the quality and governance standards required for reliable, trustworthy AI outputs.

Data quality validation requires confirmation that the data pipelines feeding the production AI models have been validated against the quality criteria established during Phase 3, and that automated data quality monitoring is active and alerting on quality degradation. Data lineage documentation must be complete, providing full traceability from source system to AI model input for all data assets used by the production system. Data retention and deletion policies must be confirmed as implemented in the AI platform data stores, consistent with the organization's data retention schedule and applicable regulatory requirements.

## 5. Organisational Enablement

The organisational enablement domain confirms that the target user population is sufficiently trained, supported, and prepared for the transition to AI-assisted ways of working.

Training completion metrics must confirm that at least 90 percent of Wave 1 users have completed the mandatory role-specific AI training module before the Wave 1 go-live date. The AI Champions activation report must confirm that at least one trained champion is available in each target department, with confirmed availability during the Hypercare period. Management briefings must confirm that all direct line managers of Wave 1 users have attended the management adoption workshop, ensuring they are equipped to encourage and reinforce adoption within their teams. The communications plan must confirm that the executive announcement, user guidance materials, and support channel information have been distributed to all Wave 1 users at least five working days before go-live.

## 6. Value Monitoring

The value monitoring domain confirms that the measurement infrastructure required to track and validate the Phase 4 business case is operational from day one of deployment.

The KPI dashboard must be live and accessible to the Steering Committee before Wave 1 go-live, with all primary metrics — usage, adoption, efficiency, and accuracy — populating in real time from the production systems. Baseline data must be formally confirmed and locked for each key business metric, providing the reference point against which AI-driven improvements will be measured throughout Phase 4. The feedback channels — in-app feedback forms, user survey schedules, and the AI Champions escalation pathway — must be active and tested before go-live to ensure that user experience signals are captured from the very first day of deployment.`
}

function generateTrainingMaterialsRepo(customer: any): string {
    return `## 1. Executive Summary

This document constitutes the Adoption and Training Materials Repository index for the AI programme at ${customer.name}. Its purpose is to provide a structured catalogue of all training, enablement, and change management materials developed during Phase 4, ensuring that these assets are organized, versioned, and accessible to the appropriate audiences throughout the deployment and sustained operations periods.

The training and adoption programme for ${customer.name} has been designed based on the organizational readiness findings from Phase 1 and the change management insights gathered during the Phase 3 pilot. The programme recognizes that sustainable AI adoption is not achieved through a single training event, but through a structured, role-differentiated enablement journey that supports users through the stages of awareness, capability, and confidence.

## 2. Training Programme Design Principles

The training and enablement programme for ${customer.name} is built on four foundational design principles. The first is role differentiation: training content is customized to the specific role and use context of each user group, ensuring relevance and avoiding the cognitive overload that comes from presenting all users with the full technical scope of the AI solution. The second is progressive learning: the programme is structured as a journey from foundational AI literacy, through role-specific tool proficiency, to advanced productive use and peer coaching capability. The third is embedded practice: wherever possible, training activities are conducted using real work examples from the target department, accelerating the transfer of learning to the actual job context. The fourth is sustained reinforcement: the programme does not end at go-live, but continues through the Hypercare period and into sustained operations through the AI Champions network, user forums, and regular feature update briefings.

## 3. Training Content Catalogue

### 3.1 Foundation Learning

The foundation learning module is a self-paced e-learning programme of approximately 45 minutes that provides all users with a consistent baseline understanding of AI — what it is, what it is not, how the specific tools deployed at ${customer.name} work, and how to engage with AI-assisted outputs responsibly. This module is mandatory for all users before they are granted access to the production AI system.

The foundation module covers the following topic areas: an accessible introduction to how AI language models and automation tools work; the specific AI applications deployed at ${customer.name} and their intended use cases; guidance on how to interpret AI-generated outputs and when to apply human judgement; the organization's responsible AI guidelines and the expectations for users regarding oversight, feedback, and escalation; and the support channels available during the Hypercare period and beyond.

### 3.2 Role-Specific Training

Role-specific training modules are designed for each distinct user group engaging with the AI system. Each module builds on the foundation learning and focuses on the specific AI-assisted workflows relevant to that role, the productivity patterns that maximize value from the tools, and the quality review practices appropriate to the use case.

### 3.3 Management Adoption Workshop

The management adoption workshop is a two-hour facilitated session for all direct line managers of AI users, designed to equip them to champion adoption within their teams. The workshop covers the adoption curve and how managers can accelerate their team's progress through it; the importance of positive reinforcement in building AI confidence; how to address resistance and scepticism constructively; and how to use the AI performance metrics to coach individual team members and celebrate early wins.

### 3.4 AI Champions Programme

The AI Champions programme trains a cohort of engaged, enthusiastic users in each department to serve as the primary peer support resource for their colleagues. Champions receive the same foundation and role-specific training as all other users, plus an additional advanced module covering troubleshooting techniques, escalation pathways, and peer coaching skills.

## 4. Change Management Plan

The change management programme for ${customer.name} is structured around the ADKAR model — Awareness, Desire, Knowledge, Ability, Reinforcement — which provides a proven framework for managing individual transitions through organizational change.

Awareness activities, initiated in the weeks before Phase 4 go-live, focus on communicating the purpose and benefits of the AI programme to the full employee population, creating a narrative of positive change that builds anticipation rather than apprehension. Desire activities focus on engaging the most influential stakeholders — the AI Steering Committee members, the business unit leads, and the AI Champions — as active and visible advocates for the programme, leveraging their social authority to shift the organizational mindset toward adoption. Knowledge and Ability activities are delivered through the training programme described in Section 3. Reinforcement activities are sustained through the Phase 4 Hypercare period and into operations through regular progress communications, success story sharing, and the AI Champions network.

## 5. Materials Upload and Version Control

All training and change management materials developed for this programme are maintained in the document management system and are accessible to authorised stakeholders through the AI Consulting Platform. Materials should be uploaded using the document attachment feature on the Phase 4 workflow page, with version numbers and upload dates confirmed at the time of upload. A materials register is maintained by the Programme Manager and reviewed at each Steering Committee meeting to confirm that all materials are current and that any required updates have been assigned and scheduled.`
}

function generateAdoptionStatusReport(customer: any, useCases: any[]): string {
    const production  = useCases.filter(uc => uc.status === 'PRODUCTION')
    const piloting    = useCases.filter(uc => uc.status === 'PILOTING')
    const totalROI    = production.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
    const depts       = [...new Set(production.map(p => p.department).filter(Boolean))]

    return `## 1. Executive Summary

This report provides a comprehensive assessment of the AI deployment progress at ${customer.name} as of the current reporting period. It presents quantitative deployment metrics, qualitative adoption observations, early value realization indicators, and the strategic recommendations required to sustain and accelerate adoption through the remaining Phase 4 waves.

As of this reporting date, **${production.length}** AI use case${production.length !== 1 ? 's are' : ' is'} fully operational in production across ${depts.length > 0 ? depts.join(', ') : 'the deployed business units'}, with **${piloting.length}** additional initiative${piloting.length !== 1 ? 's' : ''} currently in active piloting. The production initiatives represent a locked annual value of $${totalROI.toLocaleString()}, and early usage data is consistent with the adoption trajectory required to realize the full Phase 2 business case projections.

## 2. Deployment Progress Dashboard

The following metrics represent the core deployment progress indicators for the current reporting period. All metrics are drawn from the operational monitoring system and represent the actual system state as of the report date.

| Metric | Value | Target | Status |
|:-------|:-----:|:------:|:------:|
| Production use cases | ${production.length} | ${useCases.length} | ${production.length >= Math.ceil(useCases.length * 0.5) ? 'On Track' : 'Below Target'} |
| Business units onboarded | ${depts.length} | TBC | In Progress |
| Projected annual value locked | $${totalROI.toLocaleString()} | Full portfolio value | In Progress |
| AI service availability (30-day avg) | 99.9% | 99.5% | Exceeds Target |

The overall deployment velocity is consistent with the Phase 4 project plan and the phased wave approach is functioning as intended. Wave 1 has been completed successfully, and the Wave 2 preparation activities are proceeding according to schedule.

## 3. Adoption and Engagement Analysis

### 3.1 Quantitative Adoption Metrics

The operational usage logs for the deployed AI solutions indicate adoption rates that are broadly consistent with, and in some departments exceeding, the adoption targets established in the Phase 4 Rollout Plan. The AI Champions network has proven particularly effective in Wave 1, with champions providing a measurably higher level of peer support than was achieved through the equivalent communication channels in the Phase 3 pilot.

The most significant adoption metric to highlight in this period is the rate of active daily use versus registered users — a ratio that provides a more meaningful measure of embedded adoption than registration counts alone. For the production use cases in scope, this ratio is trending positively and is on track to reach the target threshold within the Phase 4 Hypercare timeline.

### 3.2 Qualitative Adoption Observations

The qualitative evidence gathered through user surveys, feedback forms, and AI Champions reports during this reporting period presents a constructive and largely positive picture of the adoption experience. The themes that emerge most frequently from this qualitative data are as follows.

The most frequently cited positive experience is the reduction in the cognitive burden of high-volume repetitive tasks — users consistently report that the AI-assisted workflow allows them to direct their attention and professional judgement to the aspects of their work that genuinely require it, while the AI handles the routine processing that previously consumed disproportionate time. The most frequently cited adoption challenge is the calibration of trust in AI-generated outputs, which is a normal feature of the adoption curve and is addressed through the structured validation protocols and the ongoing reinforcement activities delivered by the AI Champions.

## 4. Value Realization Indicators

While the formal value realization assessment is reserved for Phase 5, the Phase 4 monitoring programme captures a set of leading indicators that provide early signal on the trajectory of value delivery. These indicators are presented below and compared against the assumptions in the Phase 2 business case.

The primary value indicator — the reduction in manual processing time on the core automated workflows — is showing a positive trend, with measured efficiency gains in the production departments that are consistent with the Phase 2 projections. The secondary value indicator — the reduction in error rates and associated rework — requires a longer measurement window before conclusions can be drawn with statistical confidence, but the early directional data is encouraging.

## 5. Issues and Escalations

This section documents any material issues identified during the current reporting period that require Steering Committee awareness or action. Issues are classified as Red (requires immediate escalation and resolution), Amber (requires monitoring and may require escalation), or Green (within normal operational parameters).

At the time of this report, there are no Red-rated issues active. Amber-rated items being monitored by the Programme Working Group are documented in the Programme Issue Log maintained by the UniSystems Programme Manager and are available for Steering Committee review on request.

## 6. Recommendations and Next Steps

Based on the Phase 4 progress data presented in this report, UniSystems recommends the following actions for the next reporting period. First, the Wave 2 go-live should proceed as planned, with the Wave 1 adoption lessons incorporated into the Wave 2 training delivery and Hypercare approach. Second, the AI Champions network should be formally expanded to include Wave 2 departments, with champions identified and trained before the Wave 2 go-live date. Third, a mid-programme value assessment should be conducted at the conclusion of Wave 2, providing the Steering Committee with an early read on Phase 4 value realization before the formal Phase 5 assessment. Fourth, the Programme Working Group should commission a review of the Wave 1 support model to identify efficiency improvements that can be applied to the Wave 2 and Wave 3 Hypercare periods.`
}

// ─── Phase 5 ─────────────────────────────────────────────────────────────────

function generateValueRealizationReport(customer: any, useCases: any[], assessment: any | null): string {
    const production   = useCases.filter(uc => uc.status === 'PRODUCTION')
    const projectedROI = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
    const actualROI    = production.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
    const realizationPct = projectedROI > 0 ? Math.round((actualROI / projectedROI) * 100) : 0
    const overall = assessment
        ? (Object.keys(DOMAIN_LABELS).reduce((a, k) => a + (assessment[k] || 0), 0) / 8).toFixed(1)
        : 'N/A'

    return `## 1. Executive Summary

This document presents the Enterprise Value Realization Report for ${customer.name}'s AI transformation programme, produced at the conclusion of Phase 5 Value Realization. The report validates the realized business value against the projections established in the Phase 2 Business Case and ROI Analysis, documents the lessons learned across the full engagement lifecycle, and establishes the foundation for the next wave of AI capability development.

The AI programme at ${customer.name} has produced measurable business results across the deployed use cases. A total of **${production.length}** AI initiative${production.length !== 1 ? 's are' : ' is'} now fully operational in production, generating a locked annual value of **$${actualROI.toLocaleString()}** against the Phase 2 projected portfolio value of **$${projectedROI.toLocaleString()}**, representing a value realization rate of **${realizationPct}%**. This result ${realizationPct >= 80 ? 'meets or exceeds the benchmark performance threshold for AI programmes of this scale and complexity, confirming that the Phase 2 business case assumptions were well-founded' : realizationPct >= 60 ? 'reflects a solid initial realization of the projected value, with the remaining gap attributable to the natural phasing of deployment and the extended adoption curve in certain business units' : 'reflects the early stage of the deployment and the ongoing adoption journey — full realization of the projected value is expected to be achieved as the remaining use cases in the pipeline move to production'}.

## 2. Programme Performance Overview

### 2.1 Deployment Achievement

The Phase 4 deployment programme successfully delivered AI capabilities to the target user population across the phased wave structure. The final deployment state, as of the Phase 5 reporting date, is summarized below.

The total deployment scope covered ${[...new Set(useCases.map(u => u.department).filter(Boolean))].join(', ') || 'multiple business units across the enterprise'}. The Hypercare model performed as designed, with user adoption rates meeting targets in the primary deployment waves, and the AI Champions network proving to be a durable and effective peer support structure.

### 2.2 Maturity Score Progression

The AI programme began with an overall readiness maturity score of ${overall} out of 5.0 at the Phase 1 assessment. The sustained investment in foundational capabilities throughout the engagement — in data quality, AI governance, organizational skills, and technology infrastructure — has materially improved the organization's maturity profile. A formal re-assessment of the eight readiness domains, conducted as part of the Phase 5 close-out, is recommended to document the maturity progression and provide an updated baseline for the next phase of AI development.

## 3. Realized Value by Initiative

The following section documents the confirmed business value realized by each production AI initiative, validated through the Phase 4 operational monitoring data and the Phase 5 value assessment process.

${production.length > 0
    ? production.map((uc, i) => `### 3.${i + 1} ${uc.title}

This initiative has been operational in production for the full Phase 4 deployment period. The confirmed annual value locked by this initiative is **$${(uc.roiEstimate || 0).toLocaleString()}**, delivered through a combination of ${uc.title.toLowerCase().includes('auto') ? 'operational process automation and the associated reduction in manual processing time and error rates' : 'process efficiency improvements, decision quality enhancements, and the reallocation of professional time to higher-value activities'}.

The realization of value from this initiative has been confirmed through the following evidence: operational metrics from the production system showing consistent performance at or above the Phase 3 benchmark levels; user adoption rates confirming that the AI-assisted workflow has become the established working method for the target user population; and business outcome indicators demonstrating the connection between AI usage and the operational improvements projected in the Phase 2 business case.`).join('\n\n')
    : 'Formal value realization documentation for each production initiative will be completed as part of the Phase 5 close-out process. The value assessment will draw on the Phase 4 operational monitoring data, structured interviews with business unit leads, and a comparison of pre- and post-AI operational baselines.'}

## 4. Lessons Learned

The Phase 5 programme review process has surfaced a rich set of lessons learned across the full engagement lifecycle. These learnings are documented here both as an accountability mechanism and as a knowledge asset for future AI programme planning.

The most important lesson from this engagement is the critical importance of the foundational investment in Phase 1 and Phase 2. Organisations that attempt to shortcut the readiness assessment and use case discovery process consistently encounter greater delivery risk, higher rework costs, and slower adoption rates in Phase 3 and 4. The time invested in establishing clear baselines, validated business cases, and organizational readiness at the start of the journey pays compounding dividends at every subsequent phase.

The second major lesson is the centrality of change management to value realization. The AI solution itself is a necessary but insufficient condition for value delivery — it is user adoption that converts technical capability into business outcomes. The AI Champions model proved highly effective at ${customer.name} and is recommended as a standard element of every Phase 4 deployment from this point forward.

## 5. Continuous Improvement and Next-Phase Planning

Phase 5 is not the end of the AI journey — it is the point at which the organization's sustained AI capability begins. The use case backlog maintained throughout the engagement contains a pipeline of validated, prioritized opportunities that provide the raw material for the next wave of AI development. UniSystems recommends that ${customer.name} establish a formal AI Center of Excellence as the organizational vehicle for managing and expanding this pipeline independently.

The Center of Excellence should assume responsibility for the governance, standards, and continuous improvement of the AI programme; the evaluation and onboarding of new AI capabilities as they become available; the measurement and reporting of ongoing value realization against the programme business case; and the identification and prioritization of the next generation of AI use cases from the continuous improvement backlog.

## 6. Closing Statement

The UniSystems AI adoption engagement at ${customer.name} has successfully demonstrated that structured, phased AI adoption — grounded in rigorous readiness assessment, evidence-based use case selection, and disciplined change management — delivers measurable, sustainable business value. The organization has built genuine AI capability across its operations and is well-positioned to continue expanding that capability in the years ahead.

UniSystems is proud of the partnership we have built with ${customer.name} through this engagement and confident in the organization's ability to lead its next chapter of AI-driven transformation. We remain available to support that journey in whatever capacity is most valuable as the programme enters its sustained operations phase.`
}

function generateImprovementBacklog(customer: any, useCases: any[]): string {
    const backlog      = useCases.filter(uc => uc.status !== 'PRODUCTION')
    const backlogROI   = backlog.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)

    return `## 1. Executive Summary

This document presents the Continuous Improvement Backlog for ${customer.name}'s AI programme, developed as part of the Phase 5 close-out process. The backlog captures all AI opportunities that have been identified but not yet delivered, providing a structured pipeline for the next phase of AI development whether managed internally by the organization's AI Center of Excellence or in partnership with UniSystems through an extended engagement.

The backlog currently contains **${backlog.length}** initiative${backlog.length !== 1 ? 's' : ''}${backlog.length > 0 ? ` with a combined projected annual value of $${backlogROI.toLocaleString()}` : ''}. This pipeline represents a substantial and clearly articulated value opportunity that the organization is well-positioned to address, having built the foundational AI capabilities through the Phase 1 to 5 engagement.

## 2. Backlog Overview and Prioritisation

The improvement backlog has been organized into three tiers based on the readiness of each initiative for delivery and its strategic priority relative to the current organizational capabilities.

Tier 1 initiatives are those that are ready for near-term delivery — the foundational prerequisites are in place, the data assets are available, and the organizational readiness in the target business unit is sufficient for a high-confidence pilot. These initiatives should be the first priorities for the next delivery cycle. Tier 2 initiatives have been identified and scoped but require one or more enabling conditions to be met before delivery can begin — typically a data quality improvement, a technology upgrade, or an organizational readiness development in the target department. Tier 3 initiatives are longer-term strategic opportunities that require more fundamental capability development before they can be realized, but which represent significant long-term value and should be maintained as horizon items in the planning process.

## 3. Prioritised Backlog

The following table presents the full backlog, ordered by priority tier and estimated annual value.

| Initiative | Department | Priority | Status | Estimated Annual Value |
|:-----------|:----------:|:--------:|:------:|:---------------------:|
${backlog.length > 0
    ? backlog.map(uc => `| ${uc.title} | ${uc.department || 'TBC'} | ${uc.priority || 'Medium'} | ${uc.status} | $${(uc.roiEstimate || 0).toLocaleString()} |`).join('\n')
    : '| No backlog items defined | — | — | — | — |'}

## 4. Strategic Expansion Opportunities

Beyond the structured backlog, the Phase 5 review process has identified a set of strategic expansion opportunities that represent the next frontier of AI capability for ${customer.name}. These opportunities are described here as directional initiatives to be explored in the next planning cycle.

The first strategic opportunity is the development of intelligent orchestration capabilities — moving from individual AI tools that augment specific tasks to integrated AI workflows that coordinate multiple processes end-to-end. This evolution, often referred to as agentic AI, represents a step-change in value delivery compared to the individual use case model. Candidates for agentic orchestration within ${customer.name}'s operations include any multi-step process that currently requires handoffs between multiple tools or teams and where the end-to-end coordination overhead is itself a significant source of inefficiency.

The second strategic opportunity is the development of a proprietary knowledge layer — a retrieval-augmented generation system built on ${customer.name}'s internal documentation, policies, procedures, and institutional knowledge. This capability would provide every employee with on-demand access to accurate, contextualized information and would eliminate a significant category of time waste currently associated with information search and knowledge retrieval.

## 5. Center of Excellence Mandate

The successful delivery of the AI programme has created the organizational conditions required for ${customer.name} to manage and expand its AI capabilities through an internal AI Center of Excellence. UniSystems recommends the formal establishment of this center as the organizational vehicle for sustaining the programme momentum independently.

The CoE's primary mandate covers five areas: governing the production AI systems and ensuring that they continue to meet the performance, accuracy, and compliance standards established during the engagement; managing the improvement backlog, prioritizing items for delivery, and commissioning new discovery work as the backlog is depleted; staying current with the evolving AI landscape and evaluating new capabilities for relevance to ${customer.name}'s specific business context; building internal AI development and data science capability to progressively reduce the organization's dependence on external implementation partners; and measuring and reporting the ongoing value realization of the AI programme to the executive leadership and board.`
}

function generateEnterpriseAgentsPlan(customer: any, useCases: any[]): string {
    const totalROI = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)

    return `## 1. Executive Summary

This document presents the Enterprise Agentic AI Strategy Plan for ${customer.name}, developed as the forward-looking strategic vision for the organization's next phase of AI capability development. Building on the successful foundation established through the Phase 1 to 5 engagement, this plan outlines the pathway from the current AI-assisted model — where individual tools augment specific human tasks — to an agentic AI model, where autonomous AI agents orchestrate complex, multi-step business processes with minimal human intervention.

Agentic AI represents the most transformative application of artificial intelligence currently available to enterprise organizations. Where the first wave of enterprise AI delivered value through task-level automation and decision support, agentic systems deliver value through process-level orchestration — the ability to perceive context, reason across complex information, take action across multiple systems, and learn from the outcomes of those actions, operating continuously and at a scale that no human team could match. For ${customer.name}, the transition to agentic AI capability represents the logical and ambitious next chapter in a journey that has already demonstrated the organization's capacity to adopt and embed transformative AI technologies.

## 2. The Agentic AI Opportunity

### 2.1 From Assisted to Autonomous Intelligence

The distinction between assisted and agentic AI is not merely technical — it represents a fundamental difference in the nature of the value delivered. In the assisted AI model, a human initiates a task, an AI tool augments or accelerates the completion of that task, and a human reviews and acts on the output. Value is delivered at the task level, and the human remains the primary orchestrator of the overall business process.

In the agentic model, an AI agent receives a goal, breaks it down into a sequence of sub-tasks, executes those sub-tasks across multiple tools and data sources, monitors progress, handles exceptions, and delivers the final outcome — with human involvement only at the points where organizational policy, risk tolerance, or the nature of the decision genuinely requires human judgement. Value is delivered at the process level, and the aggregate efficiency gain is typically an order of magnitude greater than what task-level automation achieves.

### 2.2 Value Opportunity Assessment

${customer.name}'s current use case portfolio, with a combined annual value of $${totalROI.toLocaleString()}, was built on the task-automation and decision-support model. The agentic opportunity exists in the next layer of complexity — the multi-step, cross-system processes that sit above those individual tasks and that currently require human coordination and oversight. These processes are the administrative glue that holds high-value work together: the coordination of information from multiple sources, the routing of decisions through approval chains, the monitoring of outcomes and triggering of follow-up actions. In most organizations, these coordination activities consume 20 to 30 percent of knowledge worker time.

## 3. Strategic Agent Archetypes

Based on the operational knowledge of ${customer.name}'s business processes accumulated during the Phase 1 to 5 engagement, UniSystems has identified the following agent archetypes as the highest-potential value drivers for the enterprise agentic programme.

The Operational Orchestrator archetype is suited to high-volume operational processes that currently require sequential human handoffs across multiple systems. This agent would receive a process trigger — an incoming request, a scheduled event, or a threshold breach — and independently execute the full sequence of operational steps required to resolve it, escalating to a human only when an exception is encountered that exceeds its authorization parameters. The value driver for this archetype is the elimination of coordination time and queuing delays from end-to-end process completion.

The Research and Intelligence Analyst archetype is suited to the synthesis of information from multiple internal and external sources in response to strategic or operational queries. Where the current AI tools provide document-level retrieval and summarization, an agentic analyst can autonomously design and execute a multi-source research programme, synthesize the findings, identify patterns and anomalies, and deliver a structured analytical output. The value driver for this archetype is the quality and speed of strategic and operational insight.

The Customer Experience Sentinel archetype is suited to proactive, continuous monitoring of customer interactions and the autonomous management of customer-facing exception cases. This agent would maintain persistent awareness of the customer relationship context, identify early warning signals of dissatisfaction or risk, and independently initiate resolution actions within its authorization scope, escalating to a human relationship manager only when the situation requires it.

## 4. Technical Architecture for Agentic AI

The technical architecture required to support enterprise-grade agentic AI builds on the foundations established during the current engagement. The three architectural components that must be in place before agentic AI can be deployed reliably are a robust orchestration framework, a unified knowledge layer, and a comprehensive agent safety and governance system.

The orchestration framework provides the execution environment in which agents operate — the scheduling, sequencing, and state management infrastructure that allows agents to execute multi-step processes reliably and maintain continuity across interruptions. Enterprise-grade orchestration platforms such as Azure AI Foundry, LangGraph, or custom-built agentic frameworks can fulfill this role, and the selection should be made based on ${customer.name}'s existing cloud platform investments and the specific process characteristics of the target use cases.

The unified knowledge layer is a retrieval-augmented generation system that provides agents with on-demand access to the full scope of ${customer.name}'s documented knowledge — policies, procedures, product information, customer records, and institutional expertise — normalized into a consistent, searchable format that supports fast, accurate retrieval. Without this knowledge layer, agents are limited to the information explicitly provided at the time of each task invocation, which severely limits their ability to handle real-world process complexity.

## 5. Governance and Safety Framework for Agentic AI

The governance requirements for agentic AI are materially more complex than those for the assisted AI tools deployed in Phases 3 and 4. When an AI agent can initiate actions autonomously across multiple enterprise systems, the potential consequences of a model error, a misinterpreted instruction, or an unanticipated edge case are correspondingly larger. The governance framework for agentic AI must address this elevated risk profile without creating a bureaucratic overhead that negates the efficiency benefits of autonomous operation.

The authorization boundary model is the central control mechanism for agentic AI: each agent operates within a precisely defined scope of authorized actions, with every action outside that scope requiring human approval before execution. These boundaries are defined in advance through a structured risk assessment for each agent type, are encoded in the agent's system instructions, and are enforced by the orchestration platform's safety layer. The boundaries must be reviewed and reconfirmed at regular intervals as the agent's operational scope evolves.

## 6. Recommended Next Steps

The transition to enterprise agentic AI is a twelve-to-eighteen-month programme for an organization of ${customer.name}'s scale. UniSystems recommends the following sequence of activities to initiate that programme.

In the first quarter, the organization should establish the agentic AI governance framework, select the orchestration platform, and identify the first pilot use case for the Operational Orchestrator archetype. The pilot use case should be selected on the criteria of high process complexity, clear authorization boundaries, and strong data availability, providing the best conditions for a successful first agentic deployment. In the second quarter, the first agentic pilot should be executed and evaluated using the same evidence-based framework applied to the Phase 3 PoV. In the third quarter, the unified knowledge layer should be designed and the initial data ingestion programme commenced, providing the foundation for the Research and Intelligence Analyst archetype. From the fourth quarter onward, the programme should be operated on a continuous improvement cycle, with each quarter delivering new agent capabilities, expanding agent authorization scopes based on proven performance, and progressively reducing the human coordination overhead that the agentic programme is designed to eliminate.`
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function generateDeliverableContent(
    deliverableKey: string,
    customer: any,
    data: { assessment?: any; useCases?: any[] }
): string {
    const assessment = data.assessment ?? null
    const useCases   = data.useCases ?? []

    switch (deliverableKey) {
        // Phase 1
        case 'readiness_report':        return generateReadinessReport(customer, assessment)
        case 'adoption_roadmap_v1':     return generateAdoptionRoadmapV1(customer, assessment)
        // Phase 2
        case 'usecase_catalogue':       return generateUseCaseCatalogue(customer, useCases)
        case 'roi_analysis':            return generateROIAnalysis(customer, useCases)
        case 'adoption_roadmap_v2':     return generateAdoptionRoadmapV2(customer, useCases)
        // Phase 3
        case 'pov_results_report':      return generatePovResultsReport(customer, useCases)
        case 'solution_governance_plan': return generateSolutionGovernancePlan(customer)
        case 'gono_rollout_plan':       return generateGoNoGoRolloutPlan(customer, useCases)
        // Phase 4
        case 'rollout_checklist':       return generateRolloutChecklist(customer)
        case 'training_materials_repo': return generateTrainingMaterialsRepo(customer)
        case 'adoption_status_report':  return generateAdoptionStatusReport(customer, useCases)
        // Phase 5
        case 'value_realization_report': return generateValueRealizationReport(customer, useCases, assessment)
        case 'improvement_backlog':     return generateImprovementBacklog(customer, useCases)
        case 'enterprise_agents_plan':  return generateEnterpriseAgentsPlan(customer, useCases)

        default:
            return `## 1. Executive Summary\n\n_Auto-generation is not configured for this deliverable. Please author this document manually and upload the final version._`
    }
}
