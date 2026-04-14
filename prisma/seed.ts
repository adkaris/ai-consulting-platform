/**
 * Demo seed — 10 companies across all industries, phases, and AI tracks.
 * Tracks: GENERAL_AI (5), COPILOT (3), MIXED (2)
 * Run: npx tsx prisma/seed.ts
 */
import prisma from '../src/lib/prisma'

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000)

const PHASE_TASKS: Record<number, string[]> = {
    1: ['stakeholder_alignment', 'current_state_assessment', 'security_technical_readiness', 'business_readiness_hypotheses'],
    2: ['deep_dive_workshops', 'persona_driven_discovery', 'use_case_prioritization', 'adoption_strategy'],
    3: ['pov_planning_setup', 'pov_solution_design', 'pov_execution', 'pov_outcomes'],
    4: ['phased_rollout', 'training_enablement', 'adoption_monitoring', 'governance_rollout'],
    5: ['measure_business_outcomes', 'user_feedback_satisfaction', 'continuous_improvement', 'expansion_use_cases'],
}
const PHASE_DELIVERABLES: Record<number, string[]> = {
    1: ['readiness_report', 'adoption_roadmap_v1'],
    2: ['usecase_catalogue', 'roi_analysis', 'adoption_roadmap_v2'],
    3: ['pov_results_report', 'solution_governance_plan', 'gono_rollout_plan'],
    4: ['rollout_checklist', 'training_materials_repo', 'adoption_status_report'],
    5: ['value_realization_report', 'improvement_backlog', 'enterprise_agents_plan'],
}

function allTasks(customerId: string, phases: number[]) {
    return phases.flatMap(p =>
        PHASE_TASKS[p].map(key => ({
            customerId, phaseNumber: p, taskKey: key,
            completed: true, completedAt: daysAgo((5 - p) * 30 + 5),
        }))
    )
}
function partialTasks(customerId: string, phase: number, done: number) {
    return PHASE_TASKS[phase].map((key, i) => ({
        customerId, phaseNumber: phase, taskKey: key,
        completed: i < done, completedAt: i < done ? daysAgo((5 - phase) * 15 + 5) : null,
    }))
}
function allDeliverables(customerId: string, phases: number[]) {
    return phases.flatMap(p =>
        PHASE_DELIVERABLES[p].map(key => ({
            customerId, phaseNumber: p, deliverableKey: key,
            status: 'COMPLETED', completedAt: daysAgo((5 - p) * 30),
        }))
    )
}

async function main() {
    console.log('🗑  Clearing existing data…')
    await prisma.document.deleteMany()
    await prisma.deliverable.deleteMany()
    await prisma.phaseTask.deleteMany()
    await prisma.useCaseROI.deleteMany()
    await prisma.useCase.deleteMany()
    await prisma.changeManagementItem.deleteMany()
    await prisma.copilotAssessment.deleteMany()
    await prisma.assessment.deleteMany()
    await prisma.customer.deleteMany()
    console.log('✅ Cleared.\n')

    // ══════════════════════════════════════════════════════════════════════════
    // GENERAL_AI CUSTOMERS (5)
    // ══════════════════════════════════════════════════════════════════════════

    // ────────────────────────────────────────────────────────────────────────
    // 1. NEXUS MANUFACTURING GMBH — Phase 1 — GENERAL_AI
    // ────────────────────────────────────────────────────────────────────────
    console.log('1/10  Nexus Manufacturing GmbH…')
    const nexus = await prisma.customer.create({
        data: { name: 'Nexus Manufacturing GmbH', industry: 'Manufacturing', employees: '500–1,000', ambitionLevel: 2, currentPhase: 1, aiTrack: 'GENERAL_AI', createdAt: daysAgo(60) },
    })
    await prisma.assessment.create({
        data: { customerId: nexus.id, scoreStrategy: 1.8, scoreData: 1.5, scoreTech: 2.0, scoreSecurity: 2.2, scoreSkills: 1.4, scoreOps: 1.7, scoreGovernance: 1.2, scoreFinancial: 2.0, status: 'COMPLETED', completedAt: daysAgo(45) },
    })
    await prisma.phaseTask.createMany({ data: partialTasks(nexus.id, 1, 2) })
    await prisma.useCase.create({
        data: {
            customerId: nexus.id, title: 'Predictive Quality Control', department: 'Production',
            description: 'Use machine vision to detect surface defects on stamped metal parts before assembly, reducing scrap rate.',
            priority: 'HIGH', complexity: 6, value: 8, status: 'DRAFT', roiEstimate: 0, useCaseType: 'GENERAL_AI',
            rois: { create: [{ type: 'PERFORMANCE', value: 30, unit: '%', description: 'Estimated reduction in scrap rate' }] },
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: nexus.id, title: 'Maintenance Work Order Automation', department: 'Maintenance',
            description: 'NLP reads technician logs and auto-generates work orders and parts requests in SAP.',
            priority: 'MEDIUM', complexity: 4, value: 6, status: 'DRAFT', roiEstimate: 0, useCaseType: 'GENERAL_AI',
            rois: { create: [{ type: 'TIME', value: 5, unit: 'hrs/week', description: 'Admin time saved per technician' }] },
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 2. MERIDIAN FINANCIAL SERVICES — Phase 2 — GENERAL_AI
    // ────────────────────────────────────────────────────────────────────────
    console.log('2/10  Meridian Financial Services…')
    const meridian = await prisma.customer.create({
        data: { name: 'Meridian Financial Services', industry: 'Financial Services', employees: '1,000–5,000', ambitionLevel: 3, currentPhase: 2, aiTrack: 'GENERAL_AI', createdAt: daysAgo(120) },
    })
    await prisma.assessment.create({
        data: { customerId: meridian.id, scoreStrategy: 3.2, scoreData: 2.8, scoreTech: 3.0, scoreSecurity: 3.5, scoreSkills: 2.5, scoreOps: 2.9, scoreGovernance: 3.1, scoreFinancial: 3.4, status: 'COMPLETED', completedAt: daysAgo(90) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(meridian.id, [1]), ...partialTasks(meridian.id, 2, 2)] })
    await prisma.deliverable.createMany({ data: allDeliverables(meridian.id, [1]) })
    await prisma.useCase.create({
        data: {
            customerId: meridian.id, title: 'AI-Powered Credit Risk Scoring', department: 'Risk & Credit',
            description: 'ML models automate SME credit decisioning, reducing manual review time and improving accuracy.',
            priority: 'HIGH', complexity: 7, value: 9, status: 'DRAFT', roiEstimate: 420000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 420000, unit: '€', description: 'Reduction in credit losses and manual review costs' },
                { type: 'TIME', value: 18, unit: 'hrs/week', description: 'Analyst hours saved on manual reviews' },
                { type: 'PERFORMANCE', value: 22, unit: '%', description: 'Improvement in credit decision accuracy' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: meridian.id, title: 'Regulatory Document Summarisation', department: 'Compliance',
            description: 'AI reads MiFID/EBA/GDPR updates and drafts compliance impact assessments automatically.',
            priority: 'HIGH', complexity: 4, value: 8, status: 'DRAFT', roiEstimate: 95000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'TIME', value: 12, unit: 'hrs/week', description: 'Compliance officer review time saved' },
                { type: 'MONEY', value: 95000, unit: '€', description: 'Reduced external counsel costs' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: meridian.id, title: 'Fraud Pattern Detection', department: 'Fraud & Security',
            description: 'Real-time AI flags anomalous transaction patterns for immediate investigation.',
            priority: 'HIGH', complexity: 8, value: 10, status: 'DRAFT', roiEstimate: 1800000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 1800000, unit: '€', description: 'Prevented fraud losses annually' },
                { type: 'PERFORMANCE', value: 40, unit: '%', description: 'Improvement in fraud detection recall' },
            ]},
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 3. VERTEX RETAIL GROUP — Phase 4 — GENERAL_AI
    // ────────────────────────────────────────────────────────────────────────
    console.log('3/10  Vertex Retail Group…')
    const vertex = await prisma.customer.create({
        data: { name: 'Vertex Retail Group', industry: 'Retail', employees: '5,000+', ambitionLevel: 3, currentPhase: 4, aiTrack: 'GENERAL_AI', createdAt: daysAgo(270) },
    })
    await prisma.assessment.create({
        data: { customerId: vertex.id, scoreStrategy: 4.0, scoreData: 3.8, scoreTech: 3.5, scoreSecurity: 3.6, scoreSkills: 3.2, scoreOps: 3.9, scoreGovernance: 3.4, scoreFinancial: 4.1, status: 'COMPLETED', completedAt: daysAgo(240) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(vertex.id, [1, 2, 3]), ...partialTasks(vertex.id, 4, 2)] })
    await prisma.deliverable.createMany({ data: allDeliverables(vertex.id, [1, 2, 3]) })
    await prisma.useCase.create({
        data: {
            customerId: vertex.id, title: 'Personalised Promotions Engine', department: 'Marketing',
            description: 'ML-driven targeting based on purchase history, basket analysis and seasonal signals.',
            priority: 'HIGH', complexity: 6, value: 9, status: 'PRODUCTION', realizedValue: 1250000, roiEstimate: 1100000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 1100000, unit: '€', description: 'Incremental revenue from personalised promotions' },
                { type: 'PERFORMANCE', value: 18, unit: '%', description: 'Uplift in promotional redemption rate' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: vertex.id, title: 'Inventory Demand Forecasting', department: 'Supply Chain',
            description: 'AI forecasting reduces overstock and stockouts across 400+ SKUs in 60 stores.',
            priority: 'HIGH', complexity: 7, value: 8, status: 'PRODUCTION', realizedValue: 640000, roiEstimate: 580000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 580000, unit: '€', description: 'Inventory holding cost reduction' },
                { type: 'PERFORMANCE', value: 31, unit: '%', description: 'Reduction in stockout events' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: vertex.id, title: 'Customer Service AI Assistant', department: 'Customer Service',
            description: 'LLM chat handling returns, order tracking and product queries — deflecting 65% of inbound contacts.',
            priority: 'HIGH', complexity: 4, value: 7, status: 'PILOTING',
            povTimeframe: '6 weeks', povNotes: 'Pilot in Northern region call centre. 3 weeks in. Deflection at 58%, trending up.',
            povSuccessCriteria: '• Contact deflection ≥ 65%\n• CSAT ≥ 4.2/5\n• AHT reduced by 40%',
            roiEstimate: 390000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 390000, unit: '€', description: 'Cost reduction from contact deflection' },
                { type: 'TIME', value: 24, unit: 'hrs/week', description: 'Agent hours freed for complex queries' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: vertex.id, title: 'Dynamic Pricing Optimisation', department: 'Pricing',
            description: 'Real-time pricing engine adjusts prices based on competitor data, demand signals and margin targets.',
            priority: 'MEDIUM', complexity: 8, value: 8, status: 'APPROVED',
            povTimeframe: '12 weeks', povNotes: 'PoV starts Q2. Competitor data feed contract signed.',
            povSuccessCriteria: '• Gross margin improvement ≥ 2.5%\n• Price change latency < 15 minutes\n• Zero pricing errors in pilot category',
            roiEstimate: 820000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 820000, unit: '€', description: 'Gross margin improvement from optimised pricing' },
                { type: 'PERFORMANCE', value: 2.5, unit: '%', description: 'Gross margin percentage uplift' },
            ]},
        },
    })
    await prisma.changeManagementItem.createMany({ data: [
        { customerId: vertex.id, category: 'STAKEHOLDER', title: 'Executive AI Steering Committee', description: 'Monthly C-suite forum overseeing AI rollout across all retail divisions.', status: 'IN_PROGRESS', owner: 'Chief Digital Officer', dueDate: 'Ongoing' },
        { customerId: vertex.id, category: 'LITERACY', title: 'AI for Retail Staff — e-Learning Pathway', description: 'Mandatory modules covering AI basics, data privacy and responsible use for all 5,000 staff.', status: 'IN_PROGRESS', owner: 'L&D Team', dueDate: 'Q2 2026', notes: '62% completed Module 1.' },
        { customerId: vertex.id, category: 'GOVERNANCE', title: 'AI Ethics & Responsible Use Policy', description: 'Policy covering bias detection, explainability and customer data handling.', status: 'COMPLETED', owner: 'Head of Compliance', dueDate: 'Q1 2026', notes: 'Policy approved by Board.' },
    ]})

    // ────────────────────────────────────────────────────────────────────────
    // 4. ATLAS LOGISTICS — Phase 5 — GENERAL_AI (mature)
    // ────────────────────────────────────────────────────────────────────────
    console.log('4/10  Atlas Logistics…')
    const atlas = await prisma.customer.create({
        data: { name: 'Atlas Logistics', industry: 'Logistics', employees: '1,000–5,000', ambitionLevel: 5, currentPhase: 5, aiTrack: 'GENERAL_AI', createdAt: daysAgo(400) },
    })
    await prisma.assessment.create({
        data: { customerId: atlas.id, scoreStrategy: 4.6, scoreData: 4.2, scoreTech: 4.5, scoreSecurity: 4.3, scoreSkills: 4.0, scoreOps: 4.7, scoreGovernance: 4.1, scoreFinancial: 4.8, status: 'COMPLETED', completedAt: daysAgo(370) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(atlas.id, [1, 2, 3, 4]), ...partialTasks(atlas.id, 5, 3)] })
    await prisma.deliverable.createMany({ data: allDeliverables(atlas.id, [1, 2, 3, 4]) })
    await prisma.useCase.create({
        data: {
            customerId: atlas.id, title: 'Route Optimisation AI', department: 'Fleet Operations',
            description: 'Reinforcement learning model reduces fleet distance 14% across 800 daily routes.',
            priority: 'HIGH', complexity: 8, value: 10, status: 'PRODUCTION', realizedValue: 2100000, roiEstimate: 1800000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 1800000, unit: '€', description: 'Fuel and operational cost savings' },
                { type: 'PERFORMANCE', value: 14, unit: '%', description: 'Reduction in total fleet distance' },
                { type: 'TIME', value: 3, unit: 'hrs/week', description: 'Dispatcher planning time saved per planner' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: atlas.id, title: 'Predictive Maintenance for HGVs', department: 'Maintenance',
            description: 'IoT + AI predicts component failures 72 hours in advance, cutting unplanned downtime 38%.',
            priority: 'HIGH', complexity: 7, value: 9, status: 'PRODUCTION', realizedValue: 870000, roiEstimate: 750000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 750000, unit: '€', description: 'Avoided breakdown and emergency repair costs' },
                { type: 'PERFORMANCE', value: 38, unit: '%', description: 'Reduction in unplanned vehicle downtime' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: atlas.id, title: 'Warehouse Picking Optimisation', department: 'Warehousing',
            description: 'Computer vision and AI path-finding cuts picker travel distance 22% across 3 distribution centres.',
            priority: 'HIGH', complexity: 6, value: 8, status: 'PRODUCTION', realizedValue: 480000, roiEstimate: 440000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'PERFORMANCE', value: 22, unit: '%', description: 'Reduction in picker travel distance' },
                { type: 'MONEY', value: 440000, unit: '€', description: 'Labour efficiency gains across 3 DCs' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: atlas.id, title: 'Automated Customs Documentation', department: 'Compliance',
            description: 'LLM extracts data from shipping manifests and auto-completes customs declarations, cutting processing 80%.',
            priority: 'MEDIUM', complexity: 5, value: 7, status: 'PRODUCTION', realizedValue: 310000, roiEstimate: 290000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'TIME', value: 20, unit: 'hrs/week', description: 'Compliance clerk hours saved' },
                { type: 'MONEY', value: 290000, unit: '€', description: 'Labour cost and penalty avoidance' },
            ]},
        },
    })
    await prisma.changeManagementItem.createMany({ data: [
        { customerId: atlas.id, category: 'STAKEHOLDER', title: 'Board-level AI Value Dashboard', status: 'COMPLETED', owner: 'CEO Office', dueDate: 'Q4 2025', notes: 'Live. Presented at Q4 Board meeting.' },
        { customerId: atlas.id, category: 'LITERACY', title: 'Driver & Dispatcher AI Adoption Programme', status: 'COMPLETED', owner: 'Head of Operations', dueDate: 'Q3 2025', notes: '97% completion rate.' },
        { customerId: atlas.id, category: 'GOVERNANCE', title: 'AI Model Audit & Drift Monitoring', status: 'IN_PROGRESS', owner: 'Data Science Lead', dueDate: 'Ongoing', notes: 'Drift alerts live for all 4 production models.' },
    ]})

    // ────────────────────────────────────────────────────────────────────────
    // 5. ORION ENERGY SOLUTIONS — Phase 2 — GENERAL_AI (aggressive)
    // ────────────────────────────────────────────────────────────────────────
    console.log('5/10  Orion Energy Solutions…')
    const orion = await prisma.customer.create({
        data: { name: 'Orion Energy Solutions', industry: 'Energy', employees: '500–1,000', ambitionLevel: 5, currentPhase: 2, aiTrack: 'GENERAL_AI', createdAt: daysAgo(90) },
    })
    await prisma.assessment.create({
        data: { customerId: orion.id, scoreStrategy: 4.2, scoreData: 3.5, scoreTech: 3.8, scoreSecurity: 3.9, scoreSkills: 3.0, scoreOps: 3.6, scoreGovernance: 3.3, scoreFinancial: 4.4, status: 'COMPLETED', completedAt: daysAgo(70) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(orion.id, [1]), ...partialTasks(orion.id, 2, 3)] })
    await prisma.deliverable.createMany({ data: allDeliverables(orion.id, [1]) })
    await prisma.useCase.create({
        data: {
            customerId: orion.id, title: 'Energy Demand Forecasting', department: 'Grid Operations',
            description: 'AI predicts grid demand at 15-min intervals, improving balancing efficiency and reducing imbalance penalties.',
            priority: 'HIGH', complexity: 8, value: 10, status: 'DRAFT', roiEstimate: 3200000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 3200000, unit: '€', description: 'Grid balancing cost savings annually' },
                { type: 'PERFORMANCE', value: 24, unit: '%', description: 'Improvement in demand forecast accuracy' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: orion.id, title: 'Predictive Asset Failure Detection', department: 'Asset Management',
            description: 'Sensor data fusion identifies transformer and line failures 48–72 hours in advance.',
            priority: 'HIGH', complexity: 9, value: 9, status: 'DRAFT', roiEstimate: 1500000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 1500000, unit: '€', description: 'Emergency repair and outage cost avoidance' },
                { type: 'PERFORMANCE', value: 45, unit: '%', description: 'Reduction in unplanned outage hours' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: orion.id, title: 'Renewable Generation Optimisation', department: 'Renewables',
            description: 'ML optimises dispatch for wind/solar assets based on weather forecasts and market prices.',
            priority: 'HIGH', complexity: 7, value: 9, status: 'DRAFT', roiEstimate: 890000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 890000, unit: '€', description: 'Incremental revenue from optimised dispatch' },
                { type: 'PERFORMANCE', value: 12, unit: '%', description: 'Increase in renewable asset yield' },
            ]},
        },
    })

    // ══════════════════════════════════════════════════════════════════════════
    // COPILOT CUSTOMERS (3)
    // ══════════════════════════════════════════════════════════════════════════

    // ────────────────────────────────────────────────────────────────────────
    // 6. STRATEGOS CONSULTING — Phase 4 — COPILOT
    //    Professional services firm — Copilot for productivity & delivery
    // ────────────────────────────────────────────────────────────────────────
    console.log('6/10  Strategos Consulting (COPILOT)…')
    const strategos = await prisma.customer.create({
        data: { name: 'Strategos Consulting', industry: 'Professional Services', employees: '100–200', ambitionLevel: 4, currentPhase: 4, aiTrack: 'COPILOT', createdAt: daysAgo(300) },
    })
    await prisma.copilotAssessment.create({
        data: {
            customerId: strategos.id,
            scoreStrategy: 4.5,   // Strong vision — partners fully aligned
            scoreM365: 4.2,       // Full E5 licensing, Teams-first culture
            scoreContent: 3.8,    // Good SharePoint governance, some gaps
            scoreSecurity: 4.6,   // Excellent — ISO27001 certified
            scoreIdentity: 4.3,   // MFA enforced, Conditional Access fully configured
            scoreAdoption: 4.0,   // Strong L&D culture, dedicated champions
            scoreUseCases: 4.7,   // High-value use cases identified and validated
            scoreGovernance: 4.1, // Acceptable Use Policy live, under review
            status: 'COMPLETED', completedAt: daysAgo(270),
        },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(strategos.id, [1, 2, 3]), ...partialTasks(strategos.id, 4, 3)] })
    await prisma.deliverable.createMany({ data: allDeliverables(strategos.id, [1, 2, 3]) })
    // All use cases are COPILOT type
    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'Copilot for Proposal Drafting', department: 'Business Development',
            description: 'Copilot in Word generates first-draft proposals from brief notes, pulling in methodology templates and past engagement summaries from SharePoint.',
            priority: 'HIGH', complexity: 3, value: 9, status: 'PRODUCTION', realizedValue: 320000, roiEstimate: 280000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 8, unit: 'hrs/week', description: 'Senior consultant time saved per proposal cycle' },
                { type: 'MONEY', value: 280000, unit: '€', description: 'Effective billing rate increase from time saved' },
                { type: 'PERFORMANCE', value: 30, unit: '%', description: 'Reduction in proposal production time' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'Copilot Meeting Intelligence in Teams', department: 'All Practices',
            description: 'Copilot in Teams summarises client meetings, extracts action items and follow-ups, and posts structured notes to the project Teams channel automatically.',
            priority: 'HIGH', complexity: 2, value: 8, status: 'PRODUCTION', realizedValue: 185000, roiEstimate: 160000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 3, unit: 'hrs/week', description: 'Note-taking and follow-up time saved per consultant' },
                { type: 'MONEY', value: 160000, unit: '€', description: 'Billable hours recovered from admin tasks' },
                { type: 'PERFORMANCE', value: 90, unit: '%', description: 'Action item capture rate vs manual notes' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'Research Synthesis with Copilot', department: 'Research',
            description: 'Copilot in Edge and Word synthesises market research PDFs, competitor reports and client financials into structured insight briefs.',
            priority: 'HIGH', complexity: 3, value: 8, status: 'PILOTING',
            povTimeframe: '8 weeks', povNotes: 'Running with 12 analysts in Strategy practice. Week 5 of 8.',
            povSuccessCriteria: '• Research brief quality rated ≥ 4/5 by senior reviewers\n• Time per brief reduced ≥ 40%\n• 80% of analysts using weekly',
            roiEstimate: 95000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 5, unit: 'hrs/week', description: 'Analyst time saved per engagement research cycle' },
                { type: 'PERFORMANCE', value: 40, unit: '%', description: 'Reduction in research synthesis time' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'Copilot for Client Email Drafting', department: 'Client Management',
            description: 'Copilot in Outlook drafts client-facing status updates, escalation responses, and meeting requests — maintaining tone consistency and pulling context from Teams threads.',
            priority: 'MEDIUM', complexity: 2, value: 6, status: 'APPROVED',
            povTimeframe: '6 weeks', povNotes: 'Approved for PoV. Rollout to client-facing teams scheduled.',
            roiEstimate: 55000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 2, unit: 'hrs/week', description: 'Email drafting and editing time saved per consultant' },
                { type: 'PERFORMANCE', value: 20, unit: '%', description: 'Reduction in response turnaround time' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'Knowledge Management AI Search', department: 'Knowledge & Learning',
            description: 'Copilot in SharePoint and Microsoft Search indexes 10 years of engagement deliverables for semantic search and rapid IP reuse.',
            priority: 'MEDIUM', complexity: 4, value: 7, status: 'PILOTING',
            povTimeframe: '6 weeks', povNotes: 'Knowledge base indexed (4,200 docs). User testing starts next week.',
            povSuccessCriteria: '• Search relevance ≥ 4/5 in user testing\n• 70% of consultants using weekly after rollout',
            roiEstimate: 75000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 4, unit: 'hrs/week', description: 'Time saved searching for and reusing past work' },
                { type: 'PERFORMANCE', value: 25, unit: '%', description: 'Reuse rate of existing IP in new engagements' },
            ]},
        },
    })
    await prisma.changeManagementItem.createMany({ data: [
        { customerId: strategos.id, category: 'STAKEHOLDER', title: 'Partner-Level Copilot Sponsorship Forum', status: 'COMPLETED', owner: 'Managing Partner', dueDate: 'Q1 2026', notes: 'Partners actively champion Copilot with clients.' },
        { customerId: strategos.id, category: 'LITERACY', title: 'Copilot Prompt Engineering Masterclass', status: 'COMPLETED', owner: 'Head of Innovation', dueDate: 'Feb 2026', notes: '100% participation. Prompt quality scores improved significantly.' },
        { customerId: strategos.id, category: 'GOVERNANCE', title: 'Client Data Copilot Usage Policy', status: 'COMPLETED', owner: 'General Counsel', dueDate: 'Q4 2025', notes: 'Approved by all partners. Included in client engagement letters.' },
        { customerId: strategos.id, category: 'CUSTOM', title: 'Copilot Champions Network', status: 'IN_PROGRESS', owner: 'COO', dueDate: 'Q2 2026', notes: '6 of 8 practice champions identified. Slack channel active with 90+ members.' },
    ]})

    // ────────────────────────────────────────────────────────────────────────
    // 7. CONTOSO LEGAL LLP — Phase 2 — COPILOT
    //    Law firm — Copilot for legal research, drafting & compliance
    // ────────────────────────────────────────────────────────────────────────
    console.log('7/10  Contoso Legal LLP (COPILOT)…')
    const contoso = await prisma.customer.create({
        data: { name: 'Contoso Legal LLP', industry: 'Professional Services', employees: '200–500', ambitionLevel: 3, currentPhase: 2, aiTrack: 'COPILOT', createdAt: daysAgo(100) },
    })
    await prisma.copilotAssessment.create({
        data: {
            customerId: contoso.id,
            scoreStrategy: 3.5,   // Vision articulated but not fully board-driven
            scoreM365: 3.8,       // E3 licensing, moving to E5 for Copilot
            scoreContent: 2.8,    // SharePoint governance needs work — inconsistent labelling
            scoreSecurity: 4.0,   // Strong — legal sector compliance requirements
            scoreIdentity: 3.6,   // MFA enforced, some legacy user provisioning gaps
            scoreAdoption: 2.9,   // Cautious culture; some senior partners resistant
            scoreUseCases: 3.4,   // Good use case list, prioritisation in progress
            scoreGovernance: 3.0, // Policy in draft; not yet formally approved
            status: 'COMPLETED', completedAt: daysAgo(75),
        },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(contoso.id, [1]), ...partialTasks(contoso.id, 2, 2)] })
    await prisma.deliverable.createMany({ data: allDeliverables(contoso.id, [1]) })
    await prisma.useCase.create({
        data: {
            customerId: contoso.id, title: 'Contract Review & Redlining with Copilot', department: 'Corporate',
            description: 'Copilot in Word reviews NDAs and MSAs, highlights non-standard clauses, suggests standard language, and drafts redline comments — reducing associate review time by 60%.',
            priority: 'HIGH', complexity: 4, value: 9, status: 'PILOTING',
            povTimeframe: '8 weeks', povNotes: 'Running with 8 associates in Corporate practice. Week 3. Partners reviewing output quality weekly.',
            povSuccessCriteria: '• Clause identification accuracy ≥ 90% vs senior associate review\n• Time per contract review reduced ≥ 50%\n• Partner sign-off rate on AI-redlined output ≥ 75%',
            roiEstimate: 340000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 10, unit: 'hrs/week', description: 'Associate hours saved on first-pass contract review' },
                { type: 'MONEY', value: 340000, unit: '€', description: 'Billable hours recovered and cost avoidance on junior review' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: contoso.id, title: 'Legal Research Summarisation', department: 'Litigation',
            description: 'Copilot surfaces and summarises relevant case law, statutes and regulatory guidance from indexed legal databases and internal matter files.',
            priority: 'HIGH', complexity: 4, value: 8, status: 'DRAFT', roiEstimate: 210000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 8, unit: 'hrs/week', description: 'Research time saved per matter' },
                { type: 'MONEY', value: 210000, unit: '€', description: 'Reduction in paralegal research costs' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: contoso.id, title: 'Copilot for Client Status Reporting', department: 'All Practices',
            description: 'Copilot in Outlook and Teams drafts weekly client matter updates pulling context from case files, emails and billing records.',
            priority: 'MEDIUM', complexity: 2, value: 6, status: 'DRAFT', roiEstimate: 65000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 2.5, unit: 'hrs/week', description: 'Client reporting time saved per fee-earner' },
            ]},
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 8. NORDVIK BANK — Phase 3 — COPILOT
    //    Regional bank — Copilot for productivity, compliance & advisor support
    // ────────────────────────────────────────────────────────────────────────
    console.log('8/10  Nordvik Bank (COPILOT)…')
    const nordvik = await prisma.customer.create({
        data: { name: 'Nordvik Bank', industry: 'Financial Services', employees: '1,000–5,000', ambitionLevel: 3, currentPhase: 3, aiTrack: 'COPILOT', createdAt: daysAgo(180) },
    })
    await prisma.copilotAssessment.create({
        data: {
            customerId: nordvik.id,
            scoreStrategy: 3.8,   // Clear vision, CTO/CDO sponsorship
            scoreM365: 4.0,       // Full M365 E5, well-managed tenant
            scoreContent: 3.4,    // Sensitivity labels in place, some legacy docs unlabelled
            scoreSecurity: 4.2,   // Strong — regulated institution, DLP fully configured
            scoreIdentity: 4.0,   // Azure AD well-managed, PIM in place for privileged roles
            scoreAdoption: 3.2,   // Training programme underway; branch staff slower to adopt
            scoreUseCases: 3.9,   // Strong use case pipeline across front, middle and back office
            scoreGovernance: 3.6, // Acceptable Use Policy approved; monitoring tooling in progress
            status: 'COMPLETED', completedAt: daysAgo(150),
        },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(nordvik.id, [1, 2]), ...partialTasks(nordvik.id, 3, 2)] })
    await prisma.deliverable.createMany({ data: allDeliverables(nordvik.id, [1, 2]) })
    await prisma.useCase.create({
        data: {
            customerId: nordvik.id, title: 'Copilot for Relationship Manager Briefings', department: 'Commercial Banking',
            description: 'Copilot generates pre-meeting client briefings for Relationship Managers — pulling account history, recent transactions, news and relationship notes from CRM and SharePoint.',
            priority: 'HIGH', complexity: 4, value: 9, status: 'PILOTING',
            povTimeframe: '10 weeks', povNotes: 'Running with 20 RMs in Corporate Banking division. Week 6. Early results show 55 min saved per client meeting.',
            povSuccessCriteria: '• Briefing prep time reduced ≥ 60%\n• RM satisfaction ≥ 4.5/5\n• Revenue-per-RM metric improves ≥ 5% in pilot cohort',
            roiEstimate: 480000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 6, unit: 'hrs/week', description: 'RM preparation and admin time saved' },
                { type: 'MONEY', value: 480000, unit: '€', description: 'Revenue capacity freed for additional client meetings' },
                { type: 'PERFORMANCE', value: 18, unit: '%', description: 'Increase in client-facing time per RM' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: nordvik.id, title: 'Regulatory Change Summarisation', department: 'Compliance',
            description: 'Copilot in Word and Edge monitors EBA/ECB/FSA publications and generates structured impact assessment drafts — reducing compliance team effort by 70%.',
            priority: 'HIGH', complexity: 3, value: 8, status: 'PILOTING',
            povTimeframe: '8 weeks', povNotes: 'Week 4. Processing 3 regulatory updates so far. Compliance team rating output quality 4.1/5.',
            povSuccessCriteria: '• Impact assessment draft quality ≥ 4/5 by compliance officers\n• Time per assessment reduced ≥ 60%\n• Zero missed material regulatory changes during PoV',
            roiEstimate: 220000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 12, unit: 'hrs/week', description: 'Compliance officer time saved on regulatory monitoring' },
                { type: 'MONEY', value: 220000, unit: '€', description: 'External legal advisory costs avoided' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: nordvik.id, title: 'Copilot for Internal Policy Q&A', department: 'Operations',
            description: 'Copilot connected to indexed internal policy library answers staff questions about procedures, HR policies and product rules — reducing helpdesk volume.',
            priority: 'MEDIUM', complexity: 3, value: 7, status: 'APPROVED',
            povTimeframe: '6 weeks', povNotes: 'IT environment ready. Copilot Studio plugin configured. Launching next sprint.',
            roiEstimate: 150000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'MONEY', value: 150000, unit: '€', description: 'IT helpdesk deflection cost savings' },
                { type: 'TIME', value: 4, unit: 'hrs/week', description: 'Avg staff time saved finding policy answers' },
                { type: 'PERFORMANCE', value: 40, unit: '%', description: 'Reduction in internal helpdesk policy queries' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: nordvik.id, title: 'Credit Memo Drafting with Copilot', department: 'Credit',
            description: 'Copilot in Word generates first-draft credit memos from structured deal data, financial spreads and analyst notes — cutting memo production time in half.',
            priority: 'HIGH', complexity: 4, value: 8, status: 'DRAFT', roiEstimate: 190000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 7, unit: 'hrs/week', description: 'Credit analyst time saved per memo cycle' },
                { type: 'MONEY', value: 190000, unit: '€', description: 'Analyst productivity gains and capacity freed' },
            ]},
        },
    })

    // ══════════════════════════════════════════════════════════════════════════
    // MIXED CUSTOMERS (2) — Both General AI and Copilot tracks active
    // ══════════════════════════════════════════════════════════════════════════

    // ────────────────────────────────────────────────────────────────────────
    // 9. HEALTHBRIDGE PARTNERS — Phase 3 — MIXED
    //    Healthcare: AI for clinical automation + Copilot for admin productivity
    // ────────────────────────────────────────────────────────────────────────
    console.log('9/10  HealthBridge Partners (MIXED)…')
    const healthbridge = await prisma.customer.create({
        data: { name: 'HealthBridge Partners', industry: 'Healthcare', employees: '200–500', ambitionLevel: 4, currentPhase: 3, aiTrack: 'MIXED', createdAt: daysAgo(180) },
    })
    // General AI assessment — clinical data & model readiness
    await prisma.assessment.create({
        data: { customerId: healthbridge.id, scoreStrategy: 3.8, scoreData: 3.2, scoreTech: 3.5, scoreSecurity: 4.0, scoreSkills: 3.0, scoreOps: 3.6, scoreGovernance: 4.2, scoreFinancial: 3.5, status: 'COMPLETED', completedAt: daysAgo(150) },
    })
    // Copilot assessment — M365 tenant & productivity track
    await prisma.copilotAssessment.create({
        data: {
            customerId: healthbridge.id,
            scoreStrategy: 3.5,
            scoreM365: 3.8,
            scoreContent: 3.0,    // Clinical data sensitivity makes content governance complex
            scoreSecurity: 4.4,   // Strict — HIPAA/GDPR requirements fully met
            scoreIdentity: 3.9,
            scoreAdoption: 3.3,   // Clinical staff cautious; admin staff enthusiastic
            scoreUseCases: 3.6,
            scoreGovernance: 3.7,
            status: 'COMPLETED', completedAt: daysAgo(130),
        },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(healthbridge.id, [1, 2]), ...partialTasks(healthbridge.id, 3, 2)] })
    await prisma.deliverable.createMany({ data: allDeliverables(healthbridge.id, [1, 2]) })
    // General AI use cases
    await prisma.useCase.create({
        data: {
            customerId: healthbridge.id, title: 'Clinical Note Summarisation', department: 'Clinical Operations',
            description: 'AI generates structured SOAP summaries from physician dictations, cutting documentation time by 60%.',
            priority: 'HIGH', complexity: 5, value: 9, status: 'PILOTING',
            povTimeframe: '10 weeks', povNotes: 'Week 4 of 10. Running with 12 cardiologists.',
            povSuccessCriteria: '• Physician documentation time reduced by ≥50%\n• 95% accuracy vs manual review\n• NPS score ≥ 7 from pilot physicians',
            roiEstimate: 280000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'TIME', value: 6, unit: 'hrs/week', description: 'Documentation time saved per physician' },
                { type: 'MONEY', value: 280000, unit: '€', description: 'Annual documentation labour avoided' },
                { type: 'PERFORMANCE', value: 28, unit: '%', description: 'Increase in patient-facing time per physician' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: healthbridge.id, title: 'Patient Triage Chatbot', department: 'Patient Services',
            description: 'Symptom-based AI routes patients to the right care pathway, reducing A&E overcrowding.',
            priority: 'HIGH', complexity: 6, value: 8, status: 'APPROVED',
            povTimeframe: '8 weeks', povNotes: 'Integration with appointment system underway.',
            povSuccessCriteria: '• Correct triage classification ≥ 88%\n• Patient satisfaction ≥ 4/5\n• 20% reduction in low-acuity A&E visits',
            roiEstimate: 150000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 150000, unit: '€', description: 'A&E cost reduction via appropriate routing' },
                { type: 'PERFORMANCE', value: 20, unit: '%', description: 'Reduction in unnecessary A&E presentations' },
            ]},
        },
    })
    // Copilot use cases (admin/productivity track)
    await prisma.useCase.create({
        data: {
            customerId: healthbridge.id, title: 'Copilot for Ward Round Meeting Notes', department: 'Clinical Administration',
            description: 'Copilot in Teams transcribes and summarises multidisciplinary ward round meetings, auto-generates patient action lists and distributes to relevant care teams.',
            priority: 'HIGH', complexity: 3, value: 8, status: 'PILOTING',
            povTimeframe: '6 weeks', povNotes: 'Running in 2 wards. Junior doctors very positive — saving ~90 min/day on documentation.',
            povSuccessCriteria: '• Action list accuracy ≥ 92% vs manual notes\n• Staff satisfaction ≥ 4/5\n• Documentation time reduced ≥ 40%',
            roiEstimate: 130000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 7, unit: 'hrs/week', description: 'Junior doctor admin time saved across pilot wards' },
                { type: 'MONEY', value: 130000, unit: '€', description: 'Labour cost avoidance from reduced documentation time' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: healthbridge.id, title: 'HR Policy & Rota Q&A with Copilot', department: 'Human Resources',
            description: 'Copilot Studio agent answers staff questions about rotas, leave policies and HR procedures — connected to SharePoint HR knowledge base.',
            priority: 'MEDIUM', complexity: 2, value: 5, status: 'DRAFT', roiEstimate: 45000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 3, unit: 'hrs/week', description: 'HR team time saved answering routine queries' },
                { type: 'PERFORMANCE', value: 30, unit: '%', description: 'Reduction in HR helpdesk volume' },
            ]},
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 10. TELECOM NOVA — Phase 3 — MIXED
    //     Telco: AI for network ops & data science + Copilot for workforce
    // ────────────────────────────────────────────────────────────────────────
    console.log('10/10  Telecom Nova (MIXED)…')
    const telecom = await prisma.customer.create({
        data: { name: 'Telecom Nova', industry: 'Telecommunications', employees: '5,000+', ambitionLevel: 4, currentPhase: 3, aiTrack: 'MIXED', createdAt: daysAgo(210) },
    })
    // General AI assessment
    await prisma.assessment.create({
        data: { customerId: telecom.id, scoreStrategy: 3.8, scoreData: 4.0, scoreTech: 4.2, scoreSecurity: 3.7, scoreSkills: 3.4, scoreOps: 3.9, scoreGovernance: 3.5, scoreFinancial: 4.0, status: 'COMPLETED', completedAt: daysAgo(180) },
    })
    // Copilot assessment — productivity for 5,000 knowledge workers
    await prisma.copilotAssessment.create({
        data: {
            customerId: telecom.id,
            scoreStrategy: 4.0,
            scoreM365: 4.3,       // Large M365 E5 estate, well-managed
            scoreContent: 3.6,    // AIP labels deployed; coverage still rolling out
            scoreSecurity: 3.8,
            scoreIdentity: 4.1,   // Entra ID mature; SSPR and MFA enforced
            scoreAdoption: 3.5,   // Digital-savvy workforce; formal champion network established
            scoreUseCases: 4.2,   // Strong cross-functional use case backlog
            scoreGovernance: 3.4, // Acceptable Use Policy approved; usage analytics in progress
            status: 'COMPLETED', completedAt: daysAgo(160),
        },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(telecom.id, [1, 2]), ...partialTasks(telecom.id, 3, 3)] })
    await prisma.deliverable.createMany({ data: allDeliverables(telecom.id, [1, 2]) })
    // General AI use cases
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Network Anomaly Detection', department: 'Network Operations',
            description: 'AI monitors 2M+ network events/second, detecting service degradation before customer impact.',
            priority: 'HIGH', complexity: 9, value: 10, status: 'PILOTING',
            povTimeframe: '12 weeks', povNotes: 'Week 8 of 12. MTTD currently 4.2 mins — model v2 in training.',
            povSuccessCriteria: '• Mean time to detect (MTTD) < 3 minutes\n• False positive rate < 5%\n• Zero P1 incidents missed during PoV',
            roiEstimate: 4500000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 4500000, unit: '€', description: 'SLA penalty avoidance and churn reduction' },
                { type: 'PERFORMANCE', value: 60, unit: '%', description: 'Reduction in mean time to detect issues' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Subscriber Churn Propensity Scoring', department: 'Marketing',
            description: 'ML scores 4M+ subscribers monthly, triggering personalised retention offers for high-risk segments.',
            priority: 'HIGH', complexity: 6, value: 9, status: 'APPROVED',
            povTimeframe: '10 weeks', povNotes: 'Data pipeline ready. Model training complete. Starting PoV next sprint.',
            povSuccessCriteria: '• Churn prediction AUC ≥ 0.82\n• Retention rate in targeted segment improves ≥ 15%',
            roiEstimate: 2800000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 2800000, unit: '€', description: 'Revenue retained from churn prevention' },
                { type: 'PERFORMANCE', value: 15, unit: '%', description: 'Improvement in targeted segment retention' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Automated 5G Tower Site Planning', department: 'Network Planning',
            description: 'Geospatial AI optimises placement of new 5G towers based on coverage gaps, cost and planning constraints.',
            priority: 'MEDIUM', complexity: 8, value: 7, status: 'DRAFT', roiEstimate: 950000, useCaseType: 'GENERAL_AI',
            rois: { create: [
                { type: 'MONEY', value: 950000, unit: '€', description: 'CAPEX savings from optimised site placement' },
                { type: 'TIME', value: 40, unit: 'hrs/month', description: 'Planning team time saved per deployment cycle' },
            ]},
        },
    })
    // Copilot use cases — workforce productivity for 5,000 staff
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Copilot for Call Centre Agent Assist', department: 'Customer Operations',
            description: 'Copilot in Teams surfaces real-time knowledge base answers, billing summaries and resolution scripts for agents during live calls — without leaving the Teams interface.',
            priority: 'HIGH', complexity: 4, value: 8, status: 'PILOTING',
            povTimeframe: '8 weeks', povNotes: 'Running with 50 agents in Cork centre. Week 5. AHT down 22%. Agent satisfaction 4.3/5.',
            povSuccessCriteria: '• AHT reduced ≥ 25%\n• First call resolution ≥ 82%\n• Agent satisfaction ≥ 4/5',
            roiEstimate: 1200000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'MONEY', value: 1200000, unit: '€', description: 'Cost savings from handle time reduction across 800 agents' },
                { type: 'TIME', value: 35, unit: 'hrs/week', description: 'Total agent time saved across pilot cohort' },
                { type: 'PERFORMANCE', value: 25, unit: '%', description: 'Average handle time reduction' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Copilot for Executive Briefings & Board Reports', department: 'Strategy & Comms',
            description: 'Copilot in PowerPoint and Word generates first-draft board decks and executive briefings from structured data inputs and prior quarter documents.',
            priority: 'MEDIUM', complexity: 3, value: 7, status: 'PRODUCTION', realizedValue: 85000, roiEstimate: 78000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 6, unit: 'hrs/week', description: 'Strategy team time saved on deck production' },
                { type: 'MONEY', value: 78000, unit: '€', description: 'Internal productivity gains from faster reporting cycles' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Field Technician Knowledge Assistant', department: 'Field Services',
            description: 'Copilot Studio agent answers field technician questions about installation procedures, fault codes and parts — accessed via Teams Mobile on-site.',
            priority: 'HIGH', complexity: 4, value: 8, status: 'APPROVED',
            povTimeframe: '8 weeks', povNotes: 'Copilot Studio agent built and tested. Field trial rollout approved for Q2.',
            roiEstimate: 280000, useCaseType: 'COPILOT',
            rois: { create: [
                { type: 'TIME', value: 4, unit: 'hrs/week', description: 'Time saved per technician on fault resolution lookups' },
                { type: 'MONEY', value: 280000, unit: '€', description: 'Reduction in re-work and escalations from field errors' },
                { type: 'PERFORMANCE', value: 20, unit: '%', description: 'Reduction in mean time to resolve field faults' },
            ]},
        },
    })
    await prisma.changeManagementItem.createMany({ data: [
        { customerId: telecom.id, category: 'STAKEHOLDER', title: 'AI & Copilot Transformation Board', status: 'IN_PROGRESS', owner: 'Chief Digital Officer', dueDate: 'Ongoing', notes: 'Bi-monthly steering forum. Both tracks reviewed.' },
        { customerId: telecom.id, category: 'LITERACY', title: 'Copilot Champions Programme — 5,000 Staff', status: 'IN_PROGRESS', owner: 'Head of Digital Enablement', dueDate: 'Q3 2026', notes: '180 champions trained across 12 business units. Adoption at 38% MAU.' },
        { customerId: telecom.id, category: 'RESKILLING', title: 'Data Science & MLOps Upskilling', status: 'IN_PROGRESS', owner: 'Engineering Director', dueDate: 'Q2 2026', notes: 'Cohort 2 of 3 completed. 45 engineers MLOps certified.' },
        { customerId: telecom.id, category: 'GOVERNANCE', title: 'Unified AI & Copilot Acceptable Use Policy', status: 'COMPLETED', owner: 'Legal & Compliance', dueDate: 'Q1 2026', notes: 'Single policy covering both tracks. Approved by Board.' },
    ]})

    console.log('\n✅ Seed complete. 10 companies created:\n')
    console.log('   ── GENERAL AI ──────────────────────────────────────────')
    console.log('   1. Nexus Manufacturing GmbH       — Phase 1 — GENERAL_AI')
    console.log('   2. Meridian Financial Services     — Phase 2 — GENERAL_AI')
    console.log('   3. Vertex Retail Group             — Phase 4 — GENERAL_AI')
    console.log('   4. Atlas Logistics                 — Phase 5 — GENERAL_AI')
    console.log('   5. Orion Energy Solutions          — Phase 2 — GENERAL_AI (aggressive)')
    console.log('   ── COPILOT ─────────────────────────────────────────────')
    console.log('   6. Strategos Consulting            — Phase 4 — COPILOT')
    console.log('   7. Contoso Legal LLP               — Phase 2 — COPILOT')
    console.log('   8. Nordvik Bank                    — Phase 3 — COPILOT')
    console.log('   ── MIXED ───────────────────────────────────────────────')
    console.log('   9. HealthBridge Partners           — Phase 3 — MIXED')
    console.log('  10. Telecom Nova                    — Phase 3 — MIXED')
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
