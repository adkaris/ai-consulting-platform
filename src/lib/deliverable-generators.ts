/**
 * Template-based deliverable content generators.
 * Each function takes customer data and returns a markdown string
 * that serves as the auto-generated draft deliverable.
 */

const DOMAIN_LABELS: Record<string, string> = {
    scoreStrategy: 'AI Strategy & Vision',
    scoreData: 'Data Readiness & Governance',
    scoreTech: 'Technology & Infrastructure',
    scoreSecurity: 'Security & Compliance',
    scoreSkills: 'AI Skills & Talent',
    scoreOps: 'Organisational Readiness',
    scoreGovernance: 'AI Governance & Ethics',
    scoreFinancial: 'Financial & Operational Readiness',
}

function scoreLabel(score: number | null | undefined): string {
    if (!score) return 'Not Assessed'
    if (score < 2) return 'Initial'
    if (score < 3) return 'Developing'
    if (score < 4) return 'Defined'
    if (score < 4.5) return 'Managed'
    return 'Optimised'
}

function maturityBar(score: number | null | undefined): string {
    const val = score ?? 0
    const filled = Math.round(val)
    return '█'.repeat(filled) + '░'.repeat(5 - filled) + ` ${val.toFixed(1)}/5.0`
}

// ─── Phase 1 ─────────────────────────────────────────────────────────────────

function generateReadinessReport(customer: any, assessment: any | null): string {
    const overall = assessment ? (Object.keys(DOMAIN_LABELS).reduce((acc, current) => acc + (assessment[current] || 0), 0) / 8).toFixed(1) : 'N/A'

    const domainRows = Object.entries(DOMAIN_LABELS).map(([key, label]) => {
        const score = assessment?.[key] ?? 0
        const gap = (4.0 - score).toFixed(1)
        return `| ${label} | ${score.toFixed(1)} | 4.0 | ${gap} | ${scoreLabel(score)} |`
    }).join('\n')

    const topGaps = Object.entries(DOMAIN_LABELS)
        .filter(([key]) => (assessment?.[key] ?? 0) < 2.5)
        .map(([, label]) => label)

    return `# AI Readiness Assessment Report
## Executive Summary

This report presents the findings of a comprehensive AI Readiness Assessment conducted for **${customer.name}**. The objective of this engagement was to evaluate the organizational maturity and technical foundation required to support the upcoming AI initiatives.

Our analysis across the eight fundamental domains indicates an **Overall Maturity Score of ${overall} / 5.0**. This reflects a position that we categorize as **${scoreLabel(Number(overall))}**. 

At this stage, **${customer.name}** demonstrates significant potential for AI-driven transformation, particularly within its core business functions. However, to ensure a sustainable and scalable rollout, several foundational gaps must be addressed. Specifically, the assessment highlighted critical focus areas in ${topGaps.length > 0 ? topGaps.join(', ') : 'foundational data infrastructure'}. We recommend a structured approach that prioritizes these remediation efforts in parallel with the initial use case discovery phase.

---

## Strategic Context & Ambition

The drive for AI adoption at **${customer.name}** is rooted in a clear vision to modernize operations and enhance competitive positioning. Based on our initial discussions, the primary strategic drivers include operational efficiency improvements and the acceleration of innovation cycles. This assessment serves as the baseline from which all subsequent strategic adjustments and implementation plans will be derived.

---

## Comprehensive Domain Assessment

The following table summarizes the maturity scores across the UniSystems AI Consulting Framework. Each score represents a balanced view of technical capability, organizational alignment, and process maturity.

| Strategic Domain | Current Score | Target Score | Variance | Maturity Level |
|:-----------------|:-------------:|:------------:|:--------:|:--------------|
${domainRows}

---

## Detailed Gap Analysis & Interpretation

The variance observed between current scores and our target benchmark of 4.0 indicates that while certain areas are developing well, the organization is currently hampered by fragmented data ownership and a lack of formalized AI governance.

1. **Foundational Architecture**: The current technology stack reflects a mixture of legacy on-premise systems and nascent cloud adoption. This creates a friction point for real-time AI model deployment and data ingestion.
2. **Data Governance & Quality**: Data remains siloed within departmental repositories. Without a unified data catalog and quality standards, any AI implementation will face significant accuracy and reliability risks.
3. **Organizational Readiness**: While executive sponsorship is strong, the broader workforce requires a structured literacy program to mitigate change resistance and identify internal champions.

---

## Immediate Strategic Recommendations

To bridge the identified gaps and prepare for the Phase 2 Strategy Alignment, we recommend the following professional actions:

* **Establish an AI Steering Committee**: Form a cross-functional body of senior stakeholders to oversee AI investment, ethics, and strategic alignment.
* **Unified Data Remediation Track**: Initiate a high-priority workstream to assess data quality within the top 3 candidate departments for AI pilots.
* **AI Literacy & Engagement Wave**: Launch a series of foundational workshops for department heads to demystify AI capabilities and align expectations.

---

## Readiness Verdict

Based on the current maturity profile, **${customer.name}** is **Ready to Proceed** to Phase 2 (Use Case Identification & Strategy Alignment), provided that the remediation of high-priority technical gaps begins in parallel. The organization has the executive mandate required to succeed, and by addressing the foundational pillars now, will significantly reduce the risk of pilot failure in Phase 3.`
}

function generateAdoptionRoadmapV1(customer: any, assessment: any | null): string {
    const phase = customer.currentPhase ?? 1

    return `# Strategic AI Adoption Roadmap
## Overview & Vision

This roadmap outlines the multi-phased journey for **${customer.name}** to integrate Artificial Intelligence into its core operations. Based on our initial readiness assessment, we have designed a path that balances early internal efficiency gains with long-term strategic transformation.

The objective of this roadmap is to provide a clear, risk-mitigated sequence of activities that transforms **${customer.name}** into an AI-augmented organization.

---

## Engagement Phases & Timeline

Our engagement follows the UniSystems 5-Phase AI Consulting Framework. This structure ensures that technical implementation is always preceded by strategic alignment and followed by rigorous value measurement.

| Phase | Strategic Objective | Status | Est. Duration |
|:------|:-------------------|:-------|:--------------|
| **Phase 1** | **Discovery & Readiness Assessment** | ${phase >= 1 ? '✅ Complete' : '⏳ In Progress'} | 1–2 weeks |
| **Phase 2** | **Use Case Discovery & Strategy Alignment** | ${phase >= 2 ? '✅ Complete' : '⏳ Next Phase'} | 2–3 weeks |
| **Phase 3** | **Proof of Value (PoV) Execution** | ${phase >= 3 ? '✅ Complete' : '⏳ Pending'} | 4–6 weeks |
| **Phase 4** | **Deployment & Scale-Up** | ${phase >= 4 ? '✅ Complete' : '⏳ Pending'} | 8–12 weeks |
| **Phase 5** | **Value Realization & Continuous Optimization** | ${phase >= 5 ? '✅ Complete' : '⏳ Ongoing'} | Continuous |

---

## Governance & Oversight

To ensure the success of this roadmap, we recommend the establishment of a formal **AI Steering Committee**.

*   **Executive Sponsorship**: Vital for prioritizing resources and removing organizational blockers.
*   **Strategic Oversight**: Quarterly reviews to align AI initiatives with changing business priorities.
*   **Operational Excellence**: Regular monitoring of pilot results and deployment progress.

---

## Strategic Success Criteria

We will measure the success of this adoption journey through four key pillars:
1. **Organizational Maturity**: Improving the baseline scores across all 8 domains to a target of 4.0+.
2. **Business Impact**: Identifying and prioritizing use cases with a combined annual ROI exceeding $500k.
3. **Internal Capability**: Training a core group of "AI Champions" within each department.
4. **Agility**: Reducing the time-to-market for new AI-powered features by 40% throughout the engagement.

---

## Immediate Next Steps

Upon formal approval of this roadmap, we will immediately initiate **Phase 2: Use Case Discovery**. This will involve a series of departmental workshops to transform the readiness findings into a prioritized backlog of high-impact AI opportunities.`
}

// ─── Phase 2 ─────────────────────────────────────────────────────────────────

function generateUseCaseCatalogue(customer: any, useCases: any[]): string {
    const highPriority = useCases.filter(uc => uc.priority === 'HIGH')
    const totalROI = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)

    const useCaseDetails = useCases.length > 0
        ? useCases.map((uc, i) => `### Initiative ${i + 1}: ${uc.title}
**Strategic Alignment**: ${uc.department || 'Enterprise-wide'}  
**Estimated Annual Value**: $${(uc.roiEstimate || 0).toLocaleString()}  
**Priority Level**: ${uc.priority || 'Medium'}

**Operational Overview**: 
${uc.description || 'This initiative focuses on leveraging AI to optimize internal workflows and enhance data-driven decision-making within the identified department.'}

**Expected Business Impact**:
Implementation is expected to drive significant improvements in process efficiency and resource allocation. By automating repetitive cognitive tasks, the organization can redirect human capital toward higher-value strategic activities.
`).join('\n\n')
        : 'Specific use cases will be detailed following the completion of the Phase 2 discovery workshops.'

    return `# Prioritized AI Use Case Catalogue
## Discovery Executive Summary

Following a series of interactive workshops and persona-based analysis, we have identified **${useCases.length}** distinct AI opportunities within **${customer.name}**. This catalogue represents a prioritized backlog calibrated against both business impact and technical feasibility.

The total projected annual portfolio value for these initiatives is estimated at **$${totalROI.toLocaleString()}**, with **${highPriority.length}** initiatives classified as high-priority "Strategic Bets" for immediate Proof of Value (PoV) consideration.

---

## The Prioritization Framework

Our methodology utilizes a dual-axis matrix to evaluate each opportunity:
1.  **Strategic Impact**: Assessment of ROI, risk reduction, and competitive advantage.
2.  **Implementation Feasibility**: Evaluation of data availability, technical complexity, and organizational readiness.

Initiatives in the "High Impact / High Feasibility" quadrant are recommended for Phase 3 execution.

---

## Use Case Detailed Analysis

${useCaseDetails}

---

## Recommended Integration Path

We recommend selecting a maximum of two initiatives from the high-priority list for the initial Proof of Value. This focused approach allows for rapid validation of the business case while minimizing technical overhead and organizational disruption.`
}

function generateROIAnalysis(customer: any, useCases: any[]): string {
    const totalROI = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)

    return `# Business Case & ROI Analysis
## Executive Summary

This document quantifies the anticipated business value and return on investment for the proposed AI initiatives at **${customer.name}**. Based on our analysis of **${useCases.length}** prioritized delivery areas, the total estimated annual portfolio value is projected at **$${totalROI.toLocaleString()}**.

This analysis serves as a strategic justification for the AI investment and establishes the baseline KPIs that will be validated during the Phase 3 Proof of Value.

---

## Direct Value Drivers

The projected ROI is derived from three primary categories of organizational benefit:
1. **Operational Efficiency**: Reduction in manual processing time and error rates across high-volume tasks.
2. **Accelerated Throughput**: Faster completion of complex cognitive workflows, enabling earlier revenue recognition or service delivery.
3. **Data-Driven Decision Making**: Improved accuracy and predictive capabilities, reducing the costs associated with suboptimal resource allocation.

---

## ROI by Key Initiative

| Initiative | Strategic Department | Priority | Est. Annual Value | 3-Year Projected Value |
|:-----------|:-------------------|:---------|:-----------------:|:----------------------:|
${useCases.map(uc => `| ${uc.title} | ${uc.department || 'General'} | ${uc.priority || 'Medium'} | $${(uc.roiEstimate || 0).toLocaleString()} | $${((uc.roiEstimate || 0) * 3).toLocaleString()} |`).join('\n') || '| No use cases defined | — | — | — | — |'}

---

## Investment Categorization & Assumptions

Successful realization of this value requires a balanced investment across technology, talent, and change management.
* **Implementation & Consulting**: Structured delivery of the 5-phase framework.
* **Licensing & Infrastructure**: Costs associated with LLM tokens, cloud compute, and dedicated AI platforms.
* **Organizational Training**: Investment in upskilling the "AI Champions" and broader workforce.

We assume a conservative realization factor of 0.8 during the first 12 months post-deployment, allowing for the natural learning curve and process integration periods.`
}

function generateAdoptionRoadmapV2(customer: any, useCases: any[]): string {
    const pilots = useCases.filter(uc => uc.priority === 'HIGH').slice(0, 3)

    return `# Integrated AI Adoption Roadmap (Version 2.0)
## Strategic Refinement

Following the completion of our Use Case Discovery workshops, we have refined the adoption roadmap for **${customer.name}**. This version transitions from general phase objectives to a naming specific initiatives and target departments for the upcoming implementation cycles.

---

## Phase 3: Proof of Value (PoV) Pilot Selection

Based on our impact vs. feasibility analysis, the following initiatives have been selected for immediate execution in the Proof of Value phase. These pilots are designed to validate the core business case assumptions while minimizing technical risk.

${pilots.length > 0
    ? pilots.map((uc, i) => `**Pilot ${i + 1}: ${uc.title}**
* **Target Department**: ${uc.department || 'General'}
* **Primary Success Metric**: ${uc.roiEstimate ? `Achievement of $${(uc.roiEstimate * 0.1).toLocaleString()} in early efficiency gains` : 'Reduction in process latency by 25%'}
* **Validation Goal**: Confirm model accuracy and user adoption patterns.
`).join('\n')
    : 'Pilot candidates will be finalized following the formal sign-off of the Use Case Catalogue.'
}

---

## Updated Implementation Timeline

| Timeline | Phase Focus | Key Deliverables |
|:---------|:------------|:-----------------|
| **Weeks 1-6** | **Phase 3: Proof of Value** | PoV Results Report, Refined Solution Design |
| **Weeks 7-18** | **Phase 4: Enterprise Rollout** | Training Repository, Adoption Status Reports |
| **Week 19+** | **Phase 5: Value Realization** | Value Realization Report, Improvement Backlog |

---

## Deployment Strategy & Risk Mitigation

Our rollout strategy prioritizes a "Land and Expand" model, starting with the Phase 3 pilot cohort before cascading to the broader organization. 

* **Change Management**: We will conduct departmental readiness workshops to ensure a smooth transition and rapid adoption by core users.`
}

function generatePovResultsReport(customer: any, useCases: any[]): string {
    const pilots = useCases.filter(uc => uc.status === 'PILOTING' || uc.status === 'APPROVED')

    return `# Proof of Value (PoV) Performance Report
## Executive Summary

This report documents the outcomes, technical validations, and business impact observed during the Phase 3 Proof of Value for **${customer.name}**. The objective of this phase was to validate the core AI business case through controlled, high-impact pilots before proceeding to enterprise-wide deployment.

---

## PoV Operational Summary

| Metric Category | Assessment Result |
|:----------------|:------------------|
| **Pilot Initiatives** | ${pilots.length} Active Workstreams |
| **Departmental Reach** | ${[...new Set(pilots.map(p => p.department || 'General'))].join(', ') || 'Pending Site Selection'} |
| **Technical Feasibility** | [Validated / Pending Final Review] |
| **Strategic Recommendation** | [Go / Conditional Go / No-Go] |

---

## Pilot Performance Analysis

${pilots.length > 0
    ? pilots.map(p => `### Initiative: ${p.title}
*   **Deployment Status**: ${p.status}
*   **Functional Department**: ${p.department || 'General'}
*   **Projected Annual ROI**: $${(p.roiEstimate || 0).toLocaleString()}
*   **Key Performance Indicators**: [To be updated post-validation metrics collection]
*   **User Adoption Feedback**: [To be updated based on stakeholder interviews]
`).join('\n')
    : '_Deployment of pilot initiatives is currently in progress. Detailed performance metrics will be populated upon completion of the validation cycle._'
}

---

## Strategic Recommendation & Next Steps

Based on the evidence gathered to date:
*   ☐ **Go**: Proceed to Phase 4 (Enterprise Rollout) without modification.
*   ☐ **Conditional Go**: Proceed to Phase 4 following the remediation of identified technical/operational blockers.
*   ☐ **No-Go**: Defer rollout pending a comprehensive review of the business case and solution architecture.`
}

function generateSolutionGovernancePlan(customer: any): string {
    return `# Refined Solution Design & Governance Plan
## Technical Architecture Overview

Following the successful Proof of Value (PoV), this document outlines the finalized technical architecture and governance structure for the AI deployment at **${customer.name}**. The solution is designed for high-availability, scalability, and strict adherence to enterprise security protocols.

---

## Finalized Solution Architecture

The production architecture leverages a multi-layered approach to ensure data integrity and model performance:
1. **Intelligence Layer**: Selection of optimized Large Language Models (LLMs) calibrated for the specific latency and accuracy requirements of the business.
2. **Integration Layer**: Robust API-driven connectivity with existing enterprise systems (ERPs, CRMs, and Document Management Systems).
3. **Security & Privacy Layer**: Implementation of PII masking, data encryption at rest/transit, and sovereign data residency controls.

---

## Enterprise Governance Framework

Effective AI adoption is underpinned by a rigorous governance model:

| Governance Tier | Accountability | Operational Cadence | Functional Mandate |
|:----------------|:---------------|:-------------------|:-------------------|
| **AI Steering Committee** | Executive Sponsors | Monthly | Strategic alignment and capital allocation |
| **Center of Excellence** | AI Program Leads | Bi-Weekly | Technical standard-setting and best practices |
| **Operational Oversight** | IT & Security Teams | Weekly | Performance monitoring and policy enforcement |

---

## Responsible AI & Ethics Controls

To ensure trust and transparency, the following controls are mandatory for all production initiatives:
* **Bias Mitigation**: Systematic evaluation of model outputs for demographic or algorithmic bias.
* **Explainability**: Documentation of model decision pathways for high-impact automated processes.
* **Human-in-the-Loop**: Mandatory manual review stages for actions exceeding predefined risk thresholds.
* **Auditability**: Complete logging of all AI-generated actions and data transformations.`
}

function generateGoNoGoRolloutPlan(customer: any, useCases: any[]): string {
    const pilots = useCases.filter(u => u.status === 'PILOTING')

    return `# Go/No-Go Decision & Enterprise Rollout Plan
## Performance Evaluation Summary

This document serves as the formal decision record for proceeding from Phase 3 (PoV) to Phase 4 (Full Deployment) at **${customer.name}**. The recommendation is based on a multifaceted evaluation of pilot performance, technical readiness, and stakeholder feedback.

---

## Deployment Readiness Assessment

| Readiness Criterion | Status | Evaluation Summary |
|:--------------------|:------:|:-------------------|
| **PoV Success Metrics** | ⬜ | Target KPIs achieved during the initial pilot phase. |
| **Infrastructure Scoping** | ⬜ | Cloud resources and licensing requirements finalized. |
| **Security Validation** | ⬜ | Full InfoSec clearance received for production deployment. |
| **Change Readiness** | ⬜ | Departmental "AI Champions" trained and activated. |

**Final Recommendation**: [ ] GO | [ ] CONDITIONAL GO | [ ] DEFER

---

## Proposed Rollout Phasing

| Deployment Stage | Target Departments | Target User Count | Estimated Timeline |
|:-----------------|:-------------------|:-----------------:|:-------------------|
| **Wave 1: High-Impact** | ${pilots.map(u => u.department || 'TBD').join(', ') || 'Primary Pilot BUs'} | ~50+ | Weeks 1-4 |
| **Wave 2: Secondary** | Commercial & Support | ~200+ | Weeks 5-12 |
| **Wave 3: Enterprise** | All Remaining Business Units | 1,000+ | Week 13+ |

---

## Risk Mitigation Strategy

To ensure a seamless transition to production, we will implement the following:
* **Hypercare Support**: Dedicated technical support for the first 30 days of each wave.
* **Feedback Loops**: Bi-weekly user surveys to identify and remediate adoption blockers early.
* **Incremental Activation**: Feature flags to enable controlled release of new capabilities.`
}

// ─── Phase 4 ─────────────────────────────────────────────────────────────────

function generateRolloutChecklist(customer: any): string {
    return `# Enterprise Rollout Readiness Checklist
## Pre-Deployment Governance

This checklist defines the mandatory criteria for moving AI initiatives into a production environment at **${customer.name}**. Each item must be verified by the respective area lead before the "Go" decision is finalized.

---

### Phase 4: Foundational Readiness
- [ ] **Technical Validation**: Load testing and performance benchmarking completed for production-grade traffic.
- [ ] **Licensing & Provisioning**: All required user seats and compute quotas allocated and verified.
- [ ] **Security Sign-off**: Final penetration testing and vulnerability disclosure review concluded.
- [ ] **Data Residency**: Verification that all model processing adheres to regional data sovereignty requirements.

### Phase 4: Operational Enablement
- [ ] **Training Delivery**: Completion of role-specific workshops for all Wave 1 users.
- [ ] **Support Desk Activation**: Tier 1 and Tier 2 support teams briefed on common AI troubleshooting protocols.
- [ ] **AI Champions Network**: Department-level leads activated to drive peer-to-peer adoption.
- [ ] **Communications Plan**: Executive announcement and "Day 1" user guides distributed.

### Phase 4: Value & Monitoring
- [ ] **KPI Dashboard**: Automated tracking of usage, accuracy, and business impact metrics live.
- [ ] **Feedback Channels**: In-app feedback loops and monthly user forums established.
- [ ] **Governance Cadence**: First post-launch review meeting scheduled with the AI Steering Committee.`
}

function generateAdoptionStatusReport(customer: any, useCases: any[]): string {
    const production = useCases.filter(uc => uc.status === 'PRODUCTION')
    const totalROI = production.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)

    return `# Enterprise Adoption Status Report
## Executive Summary

This report provides a quantitative and qualitative assessment of the AI deployment progress at **${customer.name}**. It focuses on user engagement, technical performance, and early value realization indicators.

---

## Deployment Velocity

| Metric Category | Performance Indicator | Status |
|:----------------|:----------------------|:------:|
| **Production Reach** | ${production.length} Use Case(s) fully deployed | 🟢 |
| **Departmental Coverage** | ${[...new Set(production.map(p => p.department || 'General'))].length} Business Unit(s) onboarded | 🟢 |
| **Projected Annual Value** | $${totalROI.toLocaleString()} locked in production | 🟢 |
| **Infrastructure Health** | 99.9% AI Service Availability (30-day avg) | 🟢 |

---

## Adoption & Engagement Analysis

_The following qualitative observations were gathered during the hypercare period:_
* **Engagement Patterns**: Highest activity observed in ${production.map(p => p.department).filter(Boolean)[0] || 'core pilot departments'}.
* **Early Wins**: Significant reduction in "Time-to-Task-Completion" reported by initial user cohorts.
* **Adoption Blockers**: [To be documented following user forum reviews].

---

## Strategic Recommendations for Optimization

1. **Feature Refinement**: Iterate on model prompts based on the collected feedback logs.
2. **Expansion Scoping**: Identify adjacent processes within the same departments for Wave 2 activation.
3. **Training Refresh**: Conduct "Advanced AI Productive Use" sessions for high-frequency users.`
}

// ─── Phase 5 ─────────────────────────────────────────────────────────────────

function generateValueRealizationReport(customer: any, useCases: any[], assessment: any | null): string {
    const production = useCases.filter(uc => uc.status === 'PRODUCTION')
    const projectedROI = useCases.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)
    const actualROI = production.reduce((sum, uc) => sum + (uc.roiEstimate || 0), 0)

    return `# Enterprise Value Realization Report
## Strategic Performance Overview

This report provides a final evaluation of the AI transformation initiative at **${customer.name}**. It confirms the business value realized against original projections and establishes the foundation for the next wave of innovation.

---

## Realized vs. Projected Value

| Metric Category | Original Projection (Ph 2) | Actual Value (Production) | Variance (Realization %) |
|:----------------|:---------------------------|:--------------------------|:-------------------------|
| **Annualized Portfolio ROI** | $${projectedROI.toLocaleString()} | $${actualROI.toLocaleString()} | ${projectedROI > 0 ? Math.round((actualROI / projectedROI) * 100) : 0}% |
| **Live Production Use Cases** | ${useCases.length} Initiatives | ${production.length} Deployed | ${useCases.length > 0 ? Math.round((production.length / useCases.length) * 100) : 0}% |
| **Average Maturity Level** | Baseline Assessment | [To be updated post-review] | N/A |

---

## Value Realized by Functional Area

${production.length > 0
    ? production.map(uc => `### ${uc.title}
*   **Locked Annual Value**: $${(uc.roiEstimate || 0).toLocaleString()}
*   **Strategic Outcome**: Successfully automated ${uc.description?.substring(0, 100) || 'targeted functional processes'}.
*   **User Adoption**: [Validated - metrics available in the Adoption Dashboard].
`).join('\n')
    : '_Initiatives are currently transitioning to PRODUCTION. Detailed value realization data will be available at the end of the next reporting cycle._'
}

---

## Transformation Roadmap: Continuous Improvement

The successful delivery of Phase 5 marks the beginning of a sustained AI capability for **${customer.name}**. To maintain this momentum, we recommend:
1. **Model Performance Audits**: Quarterly reviews to prevent algorithmic drift.
2. **Expansion to Tier 2 Opportunities**: Activation of the secondary use case backlog.
3. **Agentic System Transition**: Evaluating complex processes for autonomous agent deployment.`
}

function generateImprovementBacklog(customer: any, useCases: any[]): string {
    const backlog = useCases.filter(uc => uc.status !== 'PRODUCTION')

    return `# Continuous Improvement Backlog
## Operational Roadmap

This document captures prioritized enhancements and expansion opportunities identified throughout the engagement at **${customer.name}**. It serves as the guiding document for the UniSystems managed services or the client’s internal AI Center of Excellence.

---

## High-Priority Expansion Items

| Initiative Title | Functional Department | Priority | Anticipated Value |
|:-----------------|:----------------------|:--------:|:------------------|
${backlog.length > 0
    ? backlog.map(uc => `| ${uc.title} | ${uc.department || 'General'} | ${uc.priority || 'Medium'} | $${(uc.roiEstimate || 0).toLocaleString()} |`).join('\n')
    : '| _No backlog items identified_ | — | — | — |'
}

---

## Next-Phase Strategic Initiatives

Beyond the current backlog, the following areas represent significant opportunities for further transformation:
* **Advanced Orchestration**: Implementation of multi-agent systems for end-to-end process handling.
* **Predictive Personalization**: Leveraging deeper data sets to drive bespoke customer or employee experiences.
* **Sovereign Intelligence**: Local fine-tuning of models on private enterprise data for specialized domain expertise.`
}

function generateEnterpriseAgentsPlan(customer: any, useCases: any[]): string {
    return `# Enterprise Agentic AI Strategy Plan
## The Horizon of Autonomous Intelligence

As **${customer.name}** matures in its AI capabilities, the transition from "Assisted Intelligence" (Copilots) to "Autonomous Intelligence" (Agents) represents the next frontier of process optimization. This plan outlines the vision for deploying sovereign, task-oriented agents across the enterprise.

---

## Strategic Agent Archetypes

We have identified the following archetypes as the highest potential value drivers:
1. **The Operational Orchestrator**: Automates multi-step workflows across ERP and CRM systems.
2. **The Research & Strategy Analyst**: Conducts deep-dive data synthesis and reports on market or internal trends.
3. **The Customer Experience Sentinel**: Provides 24/7 proactive engagement and issue resolution with deep context.

---

## Proposed Technical Architecture

*   **Orchestration Framework**: Implementation of a robust Multi-Agent framework (e.g., Azure AI, LangGraph, or AutoGen).
*   **Knowledge Integration**: Leveraging a unified RAG (Retrieval-Augmented Generation) layer across all siloed document stores.
*   **Governance & Safety**: Implementation of "Agent Guardrails" to ensure adherence to ${customer.name}’s compliance policies.

---

## Immediate Next Steps (Next 12 Months)

*   **Pilot Selection**: Identify one low-risk, high-frequency process for the initial Agent PoV.
*   **Infrastructure Scoping**: Finalize the compute and orchestration requirements for autonomous execution.
*   **Ethics Review**: Establish the "Human-in-the-Loop" thresholds for autonomous decision-making.`
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function generateDeliverableContent(
    deliverableKey: string,
    customer: any,
    data: { assessment?: any; useCases?: any[] }
): string {
    const assessment = data.assessment ?? null
    const useCases = data.useCases ?? []

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
        case 'training_materials_repo': return `# Adoption & Training Materials Repository\n\n_Use this section to list and link to all training materials, decks, and user guides created for ${customer.name}. Upload files using the document attachment feature below._`
        case 'adoption_status_report':  return generateAdoptionStatusReport(customer, useCases)
        // Phase 5
        case 'value_realization_report': return generateValueRealizationReport(customer, useCases, assessment)
        case 'improvement_backlog':     return generateImprovementBacklog(customer, useCases)
        case 'enterprise_agents_plan':  return generateEnterpriseAgentsPlan(customer, useCases)

        default:
            return `# ${deliverableKey}\n\n_Auto-generation is not configured for this deliverable. Please author this document manually and upload the final version._`
    }
}
